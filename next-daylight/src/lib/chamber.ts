import type { Renderer } from './stage';
// Analytic primary rays: intersect the envelope and paired rectangular piers. Periodic
// architectural details live in world coordinates so joints and reflections stay locked.
const vert = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}`;
const frag = `#version 300 es
precision highp float;
uniform vec2 resolution, aim;
uniform float t, travel, uMode, uFlicker;
out vec4 film;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float seam(float x,float w){float a=max(fwidth(x),.003);return 1.-smoothstep(w,w+a,abs(x));}
float joint(float x,float period,float w){return seam(mod(x+period*.5,period)-period*.5,w);}
float boxHit(vec3 ro,vec3 inv,vec3 c,vec3 size,out vec3 normal){vec3 a=(c-size-ro)*inv,b=(c+size-ro)*inv,lo=min(a,b),hi=max(a,b);float near=max(max(lo.x,lo.y),lo.z),far=min(min(hi.x,hi.y),hi.z);normal=-sign(inv)*step(vec3(near-.0001),lo);return near>0.&&far>near?near:200.;}
void main(){
 vec2 uv=(gl_FragCoord.xy*2.-resolution)/resolution.y;
 vec3 ro=vec3(-.38+aim.x*.19+.08*sin(t*.23),2.06+aim.y*.07+.025*sin(t*.4),-.7+travel*1.16+.11*sin(t*.18));
 vec3 rd=normalize(vec3(uv.x+.15+aim.x*.04,uv.y-.035+aim.y*.035,1.46));vec3 inv=sign(rd)/max(abs(rd),vec3(.00001));
 float dusk=smoothstep(0.,1.,uMode),night=smoothstep(1.,2.,uMode),drop=(1.-uFlicker)*night;
 float zEnd=31.,wall=4.25,ceilY=4.7;
 float dist=(zEnd-ro.z)*inv.z;vec3 n=vec3(0,0,-1);int mat=0;
 float dx=(sign(rd.x)*wall-ro.x)*inv.x, dy=((rd.y>0.?ceilY:0.)-ro.y)*inv.y;
 if(dx>0.&&dx<dist){dist=dx;n=vec3(-sign(rd.x),0,0);mat=1;}if(dy>0.&&dy<dist){dist=dy;n=vec3(0,-sign(rd.y),0);mat=rd.y>0.?2:3;}
 for(int i=0;i<8;i++){float z=1.35+float(i)*4.;for(int j=0;j<2;j++){float side=j==0?-1.:1.;vec3 norm;float h=boxHit(ro,inv,vec3(side*3.56,ceilY*.5,z),vec3(.29,ceilY*.5,.42),norm);if(h<dist){dist=h;n=norm;mat=4;}}
  vec3 norm;float h=boxHit(ro,inv,vec3(0,ceilY-.12,z),vec3(wall,.17,.42),norm);if(h<dist){dist=h;n=norm;mat=5;}}
 vec3 p=ro+rd*dist;vec2 stone=mat==2||mat==3?p.xz:abs(n.x)>.5?p.zy:p.xy;
 float grain=hash(gl_FragCoord.xy)-.5, panel=noise(stone*2.7), pore=noise(stone*21.);
 vec3 concrete=mix(vec3(.85,.843,.797),mix(vec3(.36,.37,.39),vec3(.32,.36,.347),night),dusk);
 vec3 lamp=mix(vec3(1.,.964,.864),mix(vec3(.96,.67,.35),vec3(.72,.86,.78),night),dusk);
 float bay=mod(p.z+.65,4.)-2.;float rib=exp(-4.*abs(bay)),down=clamp(1.-p.y/ceilY,0.,1.);
 float intensity=.87+.09*n.y+.08*n.z+.14*max(-n.x,0.);
 intensity*=1.-.19*rib;
 float tube=0.,pool=0.;float rail=abs(abs(p.x)-1.9);
 if(mat==2){float recess=step(.28,abs(bay))*step(.24,abs(p.x))*step(abs(p.x),3.22);intensity-=recess*.12;
   tube=(1.-smoothstep(.022,.065,rail))*(1.-smoothstep(.96,1.23,abs(bay)));pool=.36*exp(-2.6*rail-1.7*max(abs(bay)-.9,0.));}
 if(mat==3){intensity+=.11;float v=noise(p.xz*vec2(1.9,.45));float reflectBay=mod(ro.z+(p.z-ro.z)*(ceilY+ro.y)/ro.y+.65,4.)-2.;
   float reflectRail=abs(abs(ro.x+(p.x-ro.x)*(ceilY+ro.y)/ro.y)-1.9);pool=.33*exp(-reflectRail*7.-2.*abs(reflectBay))+.11*exp(-rail*1.8-abs(bay)*.9);intensity+=v*.055;
   intensity-=.15*max(joint(p.x,1.62,.008),joint(p.z,2.,.013));}
 if(mat==1||mat==4){intensity-=.17*joint(p.y,1.17,.012)+.25*exp(-down*24.)+.12*exp(-p.y*5.);pool=.17*exp(-abs(bay)*1.2)*(1.-down*.6);
   if(mat==1){intensity-=.18*joint(p.z,2.,.015);intensity-=.11*step(.3,p.y)*step(p.y,.43);}}
 if(mat==0){float door=step(abs(p.x),1.05)*step(p.y,2.85);intensity-=door*.32;intensity-=.15*joint(p.x,1.5,.014);
   tube=max(tube,(1.-smoothstep(.02,.055,abs(p.y-2.96)))*(1.-smoothstep(.6,.76,abs(p.x))));}
 vec3 col=concrete*intensity*(.93+panel*.06+pore*.025);col*=mix(1.,.68-night*.14,dusk);
 col+=lamp*(pool+tube*.84)*(1.-drop*.84);col+=vec3(.68,.085,.055)*drop*exp(-p.y*.78)*(.5+.4*rib);
 // Integrate a small number of light samples inside the corridor, up to the first surface.
 float mist=0.;for(int i=0;i<8;i++){vec3 v=ro+rd*dist*((float(i)+.5)/8.);float d=ceilY-v.y;
   float axis=abs(abs(v.x+d*.14)-1.9),z=abs(mod(v.z+.65,4.)-2.);mist+=exp(-axis*axis/(.035+d*.08)-max(0.,z-.9)*2.)*(1.-.12*d);}
 col+=lamp*mist*min(dist,20.)*.0019*(1.-drop*.5);
 vec3 air=mix(vec3(.98,.974,.941),mix(vec3(.35,.33,.30),vec3(.23,.276,.254),night),dusk);col=mix(col,air,1.-exp(-dist*.046));
 // Slow motes in two focus planes; individual specks, never a full-screen exposure change.
 for(int i=1;i<=2;i++){float k=float(i);vec2 m=uv*(28.+k*14.)+vec2(t*.16*k-aim.x*.3,t*.21/k);float star=smoothstep(.12,0.01,length(fract(m)-.5));col+=lamp*step(.972,hash(floor(m)+k))*star*.11;}
 col+=grain*.016;film=vec4(col,1.);
}`;
export function chamber(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext('webgl2', { alpha:false, antialias:false, depth:false, powerPreference:'low-power' }); if (!gl) return null;
  const program=gl.createProgram()!;
  for(const [kind,src] of [[gl.VERTEX_SHADER,vert],[gl.FRAGMENT_SHADER,frag]] as const){const sh=gl.createShader(kind)!;gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){gl.deleteShader(sh);gl.deleteProgram(program);return null;}gl.attachShader(program,sh);gl.deleteShader(sh);}
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return null;}
  gl.useProgram(program);const [res,aim,t,travel,mode,level]=['resolution','aim','t','travel','uMode','uFlicker'].map(k=>gl.getUniformLocation(program,k));
  let quality=1, slow=0;
  return { draw(f){
    if(f.dt>.038 && ++slow>20 && quality>.65){quality-=.12;slow=0;}
    const w=Math.max(1,Math.round(Math.min(1040,canvas.clientWidth*Math.min(devicePixelRatio,1.4))*quality)),h=Math.max(1,Math.round(w*canvas.clientHeight/(canvas.clientWidth||1)));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
    gl.uniform2f(res,w,h);gl.uniform2f(aim,f.x,f.y);gl.uniform1f(t,f.time);gl.uniform1f(travel,f.scroll);gl.uniform1f(mode,f.mode);gl.uniform1f(level,f.flicker);gl.drawArrays(gl.TRIANGLES,0,3);
  },dispose(){gl.deleteProgram(program);} };
}
