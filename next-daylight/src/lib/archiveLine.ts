import { collector } from './contact';
import type { WorldMode } from './worldMode';
export type Speaker = 'Reader'|'Archivist';
type Events = { ready:()=>void; unavailable:()=>void; transcript:(who:Speaker,text:string)=>void; turn:()=>void };
type Part = {inlineData?:{mimeType?:string; data?:string}; text?:string; thought?:boolean};
type Frame = { setupComplete?:object; error?:object; goAway?:object; serverContent?:{ interrupted?:boolean; turnComplete?:boolean; modelTurn?:{parts?:Part[]}; inputTranscription?:{text?:string}; outputTranscription?:{text?:string} } };
const wsEndpoint='wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained';
/** The token, PCM buffers and transcript never enter storage, logs or analytics. */
export class ArchiveLine {
  private readonly abort = new AbortController();
  private socket:WebSocket|null=null;
  private ctx: AudioContext | null=null;
  analyser:AnalyserNode|null=null;
  private chunks=new Set<AudioBufferSourceNode>();
  private cursor=0; private timer=0; private ready=false; private closed=false;
  private stream:MediaStream|null=null; private capture:AudioWorkletNode|null=null; private input:MediaStreamAudioSourceNode|null=null; private silent:GainNode|null=null; private talking=false; private micVersion=0;
  constructor(private events:Events){}
  async open(mode:WorldMode){
    try{
      // Unlock output on the user gesture, without asking for mic access. Text survives audio denial.
      try{this.ctx=new AudioContext();this.analyser=this.ctx.createAnalyser();this.analyser.fftSize=512;this.analyser.connect(this.ctx.destination);void this.ctx.resume().catch(()=>{});}catch{this.ctx=null;}
      this.timer=window.setTimeout(()=>this.fail(),14000);
      const r=await fetch(collector+'/api/live-token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode}),credentials:'omit',cache:'no-store',signal:this.abort.signal});
      if(!r.ok)throw Error('Broker unavailable');const res=await r.json();if(this.closed)return;
      if(!res.ok||res.wsBase!==wsEndpoint||typeof res.token!=='string'||!res.token.startsWith('auth_tokens/')||typeof res.model!=='string'||!res.model.startsWith('models/'))throw Error('Invalid line');
      const ws=new WebSocket(`${wsEndpoint}?access_token=${encodeURIComponent(res.token)}`);ws.binaryType='arraybuffer';this.socket=ws;
      // All other fields (voice, instructions, transcription) are constrained by the broker.
      ws.onopen=()=>{this.send({setup:{model:res.model}})};
      ws.onmessage=e=>{try{this.receive(JSON.parse(typeof e.data==='string'?e.data:new TextDecoder().decode(e.data)))}catch{this.fail()}};
      ws.onclose=ws.onerror=()=>this.fail();
    }catch{this.fail();}
  }
  private fail(){if(this.closed)return;this.close();this.events.unavailable();}
  private send(data:object){if(this.socket?.readyState!==WebSocket.OPEN)return false;try{this.socket.send(JSON.stringify(data));return true}catch{this.fail();return false}}
  text(text:string){return this.ready&&this.send({realtimeInput:{text}});}
  private receive(m:Frame){
    if(this.closed)return;if(m.error||m.goAway){this.fail();return;}
    if(m.setupComplete){clearTimeout(this.timer);this.ready=true;this.events.ready();} const c=m.serverContent;if(!c)return;
    if(c.interrupted){this.flush();this.events.turn();return;}
    if(c.inputTranscription?.text)this.events.transcript('Reader',c.inputTranscription.text);
    if(c.outputTranscription?.text)this.events.transcript('Archivist',c.outputTranscription.text);
    for(const part of c.modelTurn?.parts??[]){if(part.thought)continue;
      if(part.inlineData?.data&&part.inlineData.mimeType?.startsWith('audio/pcm'))this.play(part.inlineData.data,part.inlineData.mimeType);
      if(part.text&&!c.outputTranscription?.text)this.events.transcript('Archivist',part.text);
    }
    if(c.turnComplete)this.events.turn();
  }
  private play(encoded:string,mime:string){
    const ctx=this.ctx;if(!ctx||!this.analyser||encoded.length>4_000_000)return;
    const raw=atob(encoded),pcm=Uint8Array.from(raw,ch=>ch.charCodeAt(0)),view=new DataView(pcm.buffer),n=Math.floor(pcm.length/2);if(!n)return;
    const rate=Number(/rate=(\d+)/.exec(mime)?.[1]||24000);if(rate<8000||rate>96000)return;
    const b=ctx.createBuffer(1,n,rate),out=b.getChannelData(0);for(let i=0;i<n;i++)out[i]=view.getInt16(i*2,true)/32768;
    if(this.cursor>ctx.currentTime+60)this.flush();const src=ctx.createBufferSource();src.buffer=b;src.connect(this.analyser);this.chunks.add(src);src.onended=()=>{this.chunks.delete(src);src.disconnect()};this.cursor=Math.max(ctx.currentTime+.018,this.cursor);src.start(this.cursor);this.cursor+=b.duration;
  }
  private flush(){for(const s of this.chunks){s.onended=null;try{s.stop();s.disconnect()}catch{/* already ended */}}this.chunks.clear();this.cursor=0;}
  async enableMic(){
    const ctx=this.ctx,id=++this.micVersion;if(!this.ready||!ctx?.audioWorklet||!navigator.mediaDevices?.getUserMedia)return false;
    try{await ctx.resume();await ctx.audioWorklet.addModule('/worklets/archive-pcm.js');if(id!==this.micVersion||this.closed)return false;
      const stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true},video:false});
      if(id!==this.micVersion||this.closed){stream.getTracks().forEach(t=>t.stop());return false;}
      this.stream=stream;stream.getAudioTracks().forEach(t=>t.enabled=false);this.input=ctx.createMediaStreamSource(stream);
      this.capture=new AudioWorkletNode(ctx,'archive-pcm',{channelCount:1,channelCountMode:'explicit'});this.silent=ctx.createGain();this.silent.gain.value=0;
      this.input.connect(this.capture).connect(this.silent).connect(ctx.destination);
      this.capture.port.onmessage=e=>{if(!this.talking||!this.ready||!this.socket||this.socket.bufferedAmount>96000)return;const data=btoa(String.fromCharCode(...new Uint8Array(e.data)));this.send({realtimeInput:{audio:{data,mimeType:'audio/pcm;rate=16000'}}})};return true;
    }catch{this.mute();return false;}
  }
  talk(hold:boolean){if(!this.capture||hold===this.talking||!this.ready)return;this.talking=hold;
    this.stream?.getAudioTracks().forEach(t=>t.enabled=hold);this.capture.port.postMessage(hold);if(!hold)this.send({realtimeInput:{audioStreamEnd:true}});}
  mute(){this.micVersion++;this.talk(false);this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.input?.disconnect();this.input=null;if(this.capture){this.capture.port.onmessage=null;this.capture.disconnect();this.capture.port.close();this.capture=null;}this.silent?.disconnect();this.silent=null;}
  close(){if(this.closed)return;this.closed=true;clearTimeout(this.timer);this.abort.abort();this.mute();this.ready=false;this.flush();const ws=this.socket;this.socket=null;
    if(ws){ws.onmessage=ws.onerror=ws.onclose=ws.onopen=null;if(ws.readyState<=WebSocket.OPEN)ws.close(1000);}
    this.analyser?.disconnect();this.analyser=null;if(this.ctx){void this.ctx.close().catch(()=>{});this.ctx=null;}
  }
}
