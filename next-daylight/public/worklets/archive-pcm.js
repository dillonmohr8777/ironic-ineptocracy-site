// Mic input only. Average across hardware-rate samples and emit 20 ms, 16 kHz LE packets.
class ArchivePCM extends AudioWorkletProcessor {
  constructor(){super();this.active=false;this.reset();this.port.onmessage=e=>{this.active=e.data===true;this.reset()}}
  reset(){this.phase=this.sum=this.count=this.at=0;this.buf=new ArrayBuffer(640);this.view=new DataView(this.buf)}
  process(inputs){const ch=inputs[0]?.[0];if(!this.active||!ch)return true;
    for(const x of ch){this.sum+=x;this.count++;this.phase+=16000;
      if(this.phase>=sampleRate){this.phase-=sampleRate;const y=Math.max(-1,Math.min(1,this.sum/this.count));this.view.setInt16(2*this.at++,y<0?y*32768:y*32767,true);this.sum=this.count=0;
        if(this.at===320){this.port.postMessage(this.buf,[this.buf]);this.at=0;this.buf=new ArrayBuffer(640);this.view=new DataView(this.buf)}}}return true;}
}
registerProcessor('archive-pcm',ArchivePCM);
