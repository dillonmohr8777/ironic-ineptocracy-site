/* The Bleeding Standard. All geometry is derived from one material-space surface.
   Units: 1000 × 640 print bed, seconds. Nothing is downloaded by the renderer. */
export const PRINT_PHASE = 1.12;
export function material() {
  const c = document.createElement("canvas");
  c.width = 1900;
  c.height = 1000;
  const g = c.getContext("2d")!;
  let seed = 1709;
  const rand = () =>
    (seed = (Math.imul(1664525, seed) + 1013904223) >>> 0) / 4294967296;
  g.fillStyle = "#f7f2e9";
  g.fillRect(0, 0, 1900, 1000);
  for (let i = 0; i < 13; i += 2) {
    g.fillStyle = i % 4 ? "#b1231c" : "#b81d18";
    g.fillRect(0, (i * 1000) / 13, 1900, 1000 / 13 + 0.35);
  }
  g.fillStyle = "#13203a";
  g.fillRect(0, 0, 760, 7000 / 13);
  g.fillStyle = "#f0ecdd";
  for (let j = 0; j < 9; j++)
    for (let i = 0; i < 6 - (j % 2); i++) {
      const x = ((i + 1 / 2 + (j % 2) * 0.5) * 760) / 6,
        y = ((j + 1) * 700) / 13;
      g.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (k * Math.PI) / 5 - Math.PI / 2,
          r = k % 2 ? 10 : 24.8;
        g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      g.closePath();
      g.fill();
    }
  // Random yarn slubs, warp and weft. Mipmapped instead of shimmering at distance.
  for (let y = 0; y < 1000; y += 2) {
    g.fillStyle = `rgba(43,29,19,${rand() * 0.16})`;
    g.fillRect(0, y, 1900, 0.85);
  }
  for (let x = 0; x < 1900; x += 2) {
    g.fillStyle = `rgba(255,250,224,${rand() * 0.2})`;
    g.fillRect(x, 0, 0.85, 1000);
  }
  for (let i = 0; i < 68000; i++) {
    g.fillStyle = i % 2 ? "rgba(255,247,222,.16)" : "rgba(28,19,16,.12)";
    g.fillRect(
      rand() * 1900,
      rand() * 1000,
      0.7 + rand() * 4,
      0.7 + rand() * 0.6,
    );
  }
  for (const x of [8, 16, 1870, 1881]) {
    g.strokeStyle = "rgba(42,31,27,.27)";
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 1000);
    g.stroke();
    g.strokeStyle = "rgba(255,245,220,.7)";
    g.setLineDash([3, 2]);
    g.beginPath();
    g.moveTo(x + 1, 0);
    g.lineTo(x + 1, 1000);
    g.stroke();
    g.setLineDash([]);
  }
  return c;
}
// A slack catenary with three travelling wave trains. Both lateral displacement
// and out-of-plane lift vanish at the hoist, including the gust contribution.
const surface = `
uniform float time, wind, focus, sweep;
vec3 cloth(vec2 st, float t) {
  float u=st.x, v=st.y, edge=u*u*u;
  float pin=smoothstep(0.,.21,u), k=pin*(.54+.46*u);
  float packet=exp(-9.*(u-focus)*(u-focus));
  float a=11.55*u+1.88*v+.91*sin(3.1*v+4.3*u)-.87*t + wind*packet*(.32*sweep-.21);
  float b=5.8*u+2.05*v-.49*t, c=29.*u+5.7*v+2.1*sin(5.*v+7.*u)-1.12*t;
  float pleat=sin(a)+.29*sin(2.*a+.83*v)+.09*sin(c);
  float gust=wind*packet*sin(16.*u+1.8*v-1.8*t+sweep);
  float x=47.+850.*u + v*(15.+pin*19.*sin(b)) - 8.*sin(3.14159*v)
        + k*(51.*sin(a+.95)+13.*sin(2.*a+1.06))+edge*13.*sin(8.6*v-t);
  float y=156.+310.*v + pin*(33.*sin(4.18*u+.43)+23.*v*sin(b))-92.*u+61.*edge
        + k*(44.*pleat+12.*sin(b)+8.*gust)+edge*15.*sin(8.*v+3.*u-1.08*t);
  float z=-16.*v+k*(130.*pleat+29.*sin(b)+11.*sin(c)*cos(4.*v-u)+19.*gust)
        +edge*10.*sin(23.*u-8.*v-.71*t);
  return vec3(x,y,z);
}
vec4 project(vec3 p) {return vec4((16.+.966*p.x)/500.-1.,1.-p.y/320.,-p.z*.0024,1.);}
`;
const vert = `#version 300 es
precision highp float;
layout(location=0) in vec2 uv;
out vec2 st;out vec3 normal;out float depth;
${surface}
void main(){vec3 p=cloth(uv,time);st=uv;depth=p.z;
normal=normalize(cross(cloth(uv+vec2(.001,0),time)-p,cloth(uv+vec2(0,.001),time)-p));gl_Position=project(p);}`;
const lighting = `uniform float uMode, uFlicker;
vec3 exposure(vec3 linen, vec3 n, float depth){
 float rim=pow(clamp(1.-abs(n.z),0.,1.),2.);float ridge=smoothstep(-68.,78.,depth);
 vec3 sodium=linen*vec3(.85,.68,.55)*(.71+.23*ridge)+vec3(.21,.12,.055)*rim;
 float key=.54+.39*uFlicker,drop=1.-uFlicker;
 vec3 cold=linen*vec3(.62,.75,.69)*key*(.74+.26*ridge)+vec3(.11,.045,.029)*(drop+rim*.27)+vec3(.21,.023,.009)*drop*(1.-ridge)*.7;
 return mix(mix(linen,sodium,smoothstep(0.,1.,uMode)),cold,smoothstep(1.,2.,uMode));}`;
const frag = `#version 300 es
precision highp float;
${lighting}
in vec2 st;in vec3 normal;in float depth;uniform sampler2D textile;out vec4 color;
float hash(float n){return fract(sin(n*127.1)*4375.5453);}
void main(){
  float wear=.002+.0035*hash(floor(st.y*950.))+.004*pow(abs(sin(st.y*46.)),8.);
  if(st.x>1.-wear) discard;
  vec3 n=normalize(normal); if(n.z<0.) n=-n;
  vec3 l=normalize(vec3(-.52,-.54,.78)),h=normalize(l+vec3(0,0,1));
  float d=clamp(dot(n,l),0.,1.),valley=1.-smoothstep(-100.,54.,depth);
  float shine=pow(max(dot(n,h),0.),22.), nap=pow(1.-abs(n.z),3.);
  // Pigment follows longitudinal yarn, not screen coordinates, along lower hems.
  vec2 uv=st;float fiber=pow(.5+.5*sin(uv.x*817.+2.*sin(uv.x*113.)),10.);
  uv.y-=smoothstep(.46,.98,st.y)*fiber*(.002+.011*valley+.004*pow(sin(30.*uv.x),4.));
  vec3 dye=texture(textile,uv).rgb;float flax=smoothstep(.57,.86,dye.g);
  float ao=1.-.215*valley*(1.-.45*d);
  vec3 lit=dye*(.52+.61*d)*ao;
  lit+=vec3(1.,.91,.74)*(.062*shine+.021*nap+flax*.064*max(0.,-dot(n,l)));
  color=vec4(exposure(lit,n,depth),1.);
}`;
const inkVert = `#version 300 es
precision highp float;
layout(location=0) in vec4 attr;layout(location=1) in vec3 more;
out vec2 uv;out float seed,mode,opacity;
${surface}
vec3 thread(float u,float d,float len,float t,float s){
  vec3 q=cloth(vec2(u,.996),t-.34*d*d);float valley=1.-smoothstep(-100.,85.,q.z);
  q.y+=d*min(593.-q.y,len*(.72+.28*valley)*(.93+.07*sin(.69*t+s)));
  q.x+=d*(1.8*sin(s+d*5.1)+1.1*sin(d*10.+s))+d*d*wind*1.6;
  return q;
}
void main(){float u=attr.x,d=attr.y,side=attr.z,len=attr.w,rad=more.x,s=more.y;mode=more.z;seed=s;opacity=1.;uv=vec2(side,d);
  vec3 p=thread(u,d,len,time,s);
  if(mode<.5){float pulse=.5+.5*cos(d*20.-time*2.+s);
    p.x+=side*rad*((.18+.82*pow(1.-d,2.7))*(.72+.28*pulse)+.12*exp(-1000.*(d-.97)*(d-.97)));
  } else {
    // Each droplet remembers the point it left, even as the hem moves away.
    float cycle=3.5+.9*fract(s),phase=mod(time+s,cycle),fall=.85+.35*fract(s*.62);
    float launch=time-phase; vec3 tip=thread(u,1.,len,launch,s);
    vec2 drift=vec2(2.2*sin(s),min(42.+28.*fract(s*.48),619.-tip.y));
    if(mode<1.5){float f=clamp(phase/fall,0.,1.);p=tip; p.xy+=drift*vec2(f,f*f);
      p.y+=rad*(.72+f*.6)*(d-.5);p.x+=side*rad*.40*sin(d*3.14159);
      opacity=smoothstep(0.,.14,f)*(1.-smoothstep(.90,1.,f));
    } else {float age=phase-fall;float wick=smoothstep(0.,1.2,age);p=tip;p.xy+=drift;
      p.xy+=vec2(side,(d-.5)*2.)*vec2(2.4+3.8*wick,1.4+1.7*wick);opacity=step(0.,age)*(1.-smoothstep(.1,cycle-fall,age));}
  }gl_Position=project(p);
}`;
const inkFrag = `#version 300 es
precision highp float;
${lighting}
in vec2 uv;in float seed,mode,opacity;out vec4 color;uniform float time;
void main(){float w=abs(uv.x),d=uv.y;
  float a=(1.-smoothstep(.16,1.,w))*(.51+.33*fract(seed*.61));
  float load=.5+.5*sin(15.*d-1.66*time+seed);
  a*=.78+.22*load;
  if(mode<.5)a*=1.-.62*smoothstep(.88,1.,d);
  if(mode>1.5){float r=length(vec2(uv.x,2.*d-1.));a=.20*(1.-smoothstep(.15,.99,r))+.08*exp(-80.*(r-.69)*(r-.69));}
  vec3 pigment=mix(vec3(.722,.114,.094),vec3(.561,.067,.051),.26+.65*load);
  float wet=(1.-smoothstep(.02,.40,abs(uv.x+.30)))*load;
  pigment=mix(pigment,vec3(.49,.079,.052)+vec3(.33,.14,.09)*wet*uFlicker+.16*(1.-uFlicker)*vec3(1,.06,.03),smoothstep(0.,1.,uMode));
  color=vec4(pigment,min(1.,a*(1.+.6*smoothstep(0.,1.,uMode)))*opacity);
}`;
const yarnVert=`#version 300 es
precision highp float;layout(location=0) in vec4 yarn;out vec2 st;out float shade;
${surface}
void main(){float v=yarn.x,d=yarn.y,s=yarn.w;st=vec2(.984,v);vec3 p=cloth(st,time);float l=3.+16.*fract(s*7.3);
  p+=d*(cloth(vec2(.997,v),time)-p);p.x+=d*l;p.y+=d*d*(4.8*sin(s+time)+1.)+yarn.z*(.66-.55*d);p.z+=1.;
  shade=.69+.25*fract(s);gl_Position=project(p);}`;
const yarnFrag=`#version 300 es
precision highp float;${lighting}
in vec2 st;in float shade;uniform sampler2D textile;out vec4 color;
void main(){color=vec4(exposure(texture(textile,st).rgb*shade,vec3(0,0,1),0.),1.);}`;
function seeded(n:number){return ()=> (n=(Math.imul(1664525,n)+1013904223)>>>0)/4294967296;}
export function webRenderer(canvas:HTMLCanvasElement){
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'low-power'});if(!gl)return null;
  const buffers:WebGLBuffer[]=[],arrays:WebGLVertexArrayObject[]=[],programs:WebGLProgram[]=[];
  function compile(v:string,f:string){const p=gl!.createProgram()!;programs.push(p);
    for(const [type,src] of [[gl!.VERTEX_SHADER,v],[gl!.FRAGMENT_SHADER,f]] as const){const sh=gl!.createShader(type)!;gl!.shaderSource(sh,src);gl!.compileShader(sh);if(!gl!.getShaderParameter(sh,gl!.COMPILE_STATUS))throw Error(gl!.getShaderInfoLog(sh)??'Shader compilation');gl!.attachShader(p,sh);gl!.deleteShader(sh)}
    gl!.linkProgram(p);if(!gl!.getProgramParameter(p,gl!.LINK_STATUS))throw Error(gl!.getProgramInfoLog(p)??'Shader link');
    const loc=['time','wind','focus','sweep','uMode','uFlicker'].map(n=>gl!.getUniformLocation(p,n));return (values:number[])=>{gl!.useProgram(p);loc.forEach((l,i)=>gl!.uniform1f(l,values[i]))};}
  function buffer(target:number,data:Float32Array|Uint16Array){const b=gl!.createBuffer()!;buffers.push(b);gl!.bindBuffer(target,b);gl!.bufferData(target,data,gl!.STATIC_DRAW);}
  function vao(data:number[],sizes:number[]){const v=gl!.createVertexArray()!;arrays.push(v);gl!.bindVertexArray(v);buffer(gl!.ARRAY_BUFFER,new Float32Array(data));const stride=sizes.reduce((s,n)=>s+n,0)*4;let offset=0;sizes.forEach((n,i)=>{gl!.enableVertexAttribArray(i);gl!.vertexAttribPointer(i,n,gl!.FLOAT,false,stride,offset);offset+=n*4});return v;}
  const textile=compile(vert,frag), ink=compile(inkVert,inkFrag), yarn=compile(yarnVert,yarnFrag);
  const nx=158,ny=78,uv:number[]=[],ix:number[]=[];
  for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++)uv.push(x/nx,y/ny);
  for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*(nx+1)+x;ix.push(i,i+1,i+nx+1,i+1,i+nx+2,i+nx+1)}
  const cloth=vao(uv,[2]);buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ix));
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,material());gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const quad=[[0,-1],[0,1],[1,-1],[1,-1],[0,1],[1,1]],r=seeded(120),ribbons:number[]=[],fibers:number[]=[];
  for(const [center,length,count] of [[.035,45,3],[.16,111,7],[.285,138,8],[.392,60,4],[.565,143,7],[.715,71,4],[.84,41,4],[.94,58,4]]){
    for(let j=0;j<count;j++){const u=center+(r()-.5)*.041,len=length*(.19+.81*r()),rad=1.5+4.6*r(),s=40*r();
      for(const [mode,steps] of [[0,20],...(j===0||j===4?[[1,8],[2,1]]:[])])for(let k=0;k<steps;k++)for(const [z,side] of quad)ribbons.push(u,(k+z)/steps,side,len,rad,s,mode);}}
  for(let j=0;j<165;j++){const v=r(),s=r()*39;for(let k=0;k<4;k++)for(const [z,side] of quad)fibers.push(v,(k+z)/4,side,s)}
  const trails=vao(ribbons,[4,3]),fray=vao(fibers,[4]);
  return {draw(t:number,w=0,f=.5,d=0,mode=0,flicker=1){const values=[t,w,f,d,mode,flicker];gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);ink(values);gl.bindVertexArray(trails);gl.drawArrays(gl.TRIANGLES,0,ribbons.length/7);
    gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);textile(values);gl.bindVertexArray(cloth);gl.drawElements(gl.TRIANGLES,ix.length,gl.UNSIGNED_SHORT,0);yarn(values);gl.bindVertexArray(fray);gl.drawArrays(gl.TRIANGLES,0,fibers.length/4);
  },dispose(){arrays.forEach(v=>gl.deleteVertexArray(v));buffers.forEach(b=>gl.deleteBuffer(b));programs.forEach(p=>gl.deleteProgram(p));gl.deleteTexture(tex);}};
}
