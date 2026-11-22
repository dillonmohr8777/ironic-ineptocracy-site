/* A material-space cloth study. Coordinates are measured on a 1000 × 640 print bed.
   The trailing edge twists out of plane; the ink mesh samples the same moving hem. */
export const BED = [1000, 640];
export function cloth(u: number, v: number, t: number, w = 0) {
  const a =
    11.55 * u + 1.64 * v + 0.94 * Math.sin(v * 3.1 + u * 4.3) - t * 0.72;
  const k = 0.43 + 0.57 * u,
    fly = Math.pow(u, 3),
    slack = Math.sin(5.9 * u - 0.44 * t + 2.1 * v);
  const shear = 29 * u + 6 * v + 2.3 * Math.sin(5 * v + 7 * u) - 0.82 * t;
  const pleat =
    Math.sin(a) + 0.31 * Math.sin(2 * a + 0.83 * v) + 0.115 * Math.sin(shear);
  return [
    36 +
      879 * u +
      k * (48 * Math.sin(a + 0.9) + 16 * Math.sin(2 * a + 0.97)) +
      v * (10 + 25 * slack) +
      fly * 13 * Math.sin(9 * v - t),
    158 +
      65 * fly +
      v * (307 + 21 * slack) -
      u * 84 +
      37 * Math.sin(u * 4.1 + 0.5) +
      k * (43 * pleat + 12 * slack) +
      fly * (13 + w * 6) * Math.sin(8 * v + 3 * u - t * 1.1) +
      w * k * 8 * Math.sin(a),
    145 * k * pleat +
      32 * slack +
      13 * Math.sin(shear) * Math.cos(v * 4 - u) +
      8 * Math.sin(24 * u - 7 * v - 0.69 * t) -
      17 * v,
  ];
}
export function material() {
  const c = document.createElement("canvas");
  c.width = 1900;
  c.height = 1000;
  const g = c.getContext("2d")!;
  let seed = 1709;
  const rand = () =>
    (seed = (Math.imul(1664525, seed) + 1013904223) >>> 0) / 4294967296;
  g.fillStyle = "#efede3";
  g.fillRect(0, 0, 1900, 1000);
  for (let i = 0; i < 13; i += 2) {
    g.fillStyle = i % 4 ? "#a0261f" : "#b81d18";
    g.fillRect(0, (i * 1000) / 13, 1900, 1000 / 13 + 0.35);
  }
  g.fillStyle = "#17253b";
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
  for (let i = 0; i < 160000; i++) {
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
const body = `vec3 cloth(vec2 uv,float t){float u=uv.x,v=uv.y;float a=11.55*u+1.64*v+.94*sin(v*3.1+u*4.3)-t*.72;float k=.43+.57*u,e=pow(u,3.),s=sin(5.9*u-.44*t+2.1*v);float sh=29.*u+6.*v+2.3*sin(5.*v+7.*u)-.82*t;float f=sin(a)+.31*sin(2.*a+.83*v)+.115*sin(sh);return vec3(36.+879.*u+k*(48.*sin(a+.9)+16.*sin(2.*a+.97))+v*(10.+25.*s)+e*13.*sin(9.*v-t),158.+65.*e+v*(307.+21.*s)-u*84.+37.*sin(u*4.1+.5)+k*(43.*f+12.*s)+e*(13.+wind*6.)*sin(8.*v+3.*u-t*1.1)+wind*k*8.*sin(a),145.*k*f+32.*s+13.*sin(sh)*cos(v*4.-u)+8.*sin(24.*u-7.*v-.69*t)-17.*v);}
vec4 project(vec3 p){return vec4((15.+.965*p.x)/500.-1.,1.-p.y/320.,-p.z*.002,1.);}`;
const vert = `#version 300 es
precision highp float;layout(location=0) in vec2 uv;uniform float time,wind;out vec2 st;out vec3 normal;out float depth;${body}
void main(){st=uv;vec3 p=cloth(uv,time);normal=normalize(cross(cloth(uv+vec2(.0008,0),time)-p,cloth(uv+vec2(0,.0008),time)-p));depth=p.z;gl_Position=project(p);}`;
const frag = `#version 300 es
precision highp float;in vec2 st;in vec3 normal;in float depth;uniform sampler2D textile;out vec4 outColor;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){float wear=hash(vec2(floor(st.y*920.),2.));if(st.x>1.-.0015-.005*wear-.004*pow(sin(st.y*49.),8.)) discard;
vec3 n=normalize(normal);vec3 l=normalize(vec3(-.45,-.58,.78));float diffuse=max(.0,dot(n,l));float spec=pow(max(.0,dot(n,normalize(l+vec3(0,0,1)))),18.);
float ao=.85+.15*smoothstep(-105.,36.,depth);float fibers=pow(max(0.,sin(st.x*561.+2.*sin(st.x*89.))),10.);vec2 dye=st;dye.y-=smoothstep(.63,.99,st.y)*fibers*(.003+.010*pow(sin(31.*st.x),4.));vec3 pigment=texture(textile,dye).rgb;float yarn=.006*(hash(floor(st*vec2(1800.,980.)))-.5);vec3 color=pigment*(.48+.68*diffuse)*ao+(.092*spec+yarn)*vec3(1.,.96,.85);outColor=vec4(color,1.);}`;
const inkVert = `#version 300 es
precision highp float;layout(location=0) in vec4 attr;layout(location=1) in vec2 more;uniform float time,wind;out float side,down,seed;${body}
void main(){float drop=step(1.5,attr.y);float d=mix(attr.y,1.,drop),s=more.y;float flight=fract(time*.36+s);vec3 root=cloth(vec2(attr.x,.996),time-d*.25-drop*flight*.70);float len=min(615.-root.y,attr.w*(.88+.12*sin(.65*time+s)));float radius=more.x*(.23+.77*pow(1.-d,2.4))*(.84+.16*sin(d*22.+s));root.x+=d*(2.8*sin(s+d*5.)+2.*sin(11.*d+s)) + attr.z*radius;root.y+=d*len;if(drop>.5){float z=attr.y-2.;root.y+=1.+flight*flight*min(48.,623.-root.y)+z*3.5;root.x+=attr.z*1.1*sin(z*3.14159);d=.72+.27*z;}side=attr.z;down=d;seed=s;gl_Position=project(root);}`;
const inkFrag = `#version 300 es
precision highp float;in float side,down,seed;uniform float time;out vec4 outColor;void main(){float grain=fract(sin(dot(floor(gl_FragCoord.xy),vec2(14.17,78.23)))*4375.5);float a=(1.-smoothstep(.15,1.,abs(side)))*(.34+.45*fract(seed*2.72))*(.74+.26*grain)*(1.-smoothstep(.93,1.,down));float flow=.60+.40*smoothstep(-.8,.9,sin(18.*down-seed-time*1.6));outColor=vec4(mix(vec3(.61,.065,.046),vec3(.72,.12,.07),down),a*flow);}`;
export function trails() {
  let k = 120;
  const r = () => (k = (Math.imul(k, 1664525) + 1013904223) >>> 0) / 4294967296;
  const out: number[][] = [];
  for (const [u, l, n] of [
    [0.035, 46, 5],
    [0.165, 118, 9],
    [0.29, 146, 13],
    [0.38, 65, 4],
    [0.565, 143, 9],
    [0.71, 64, 4],
    [0.84, 37, 6],
    [0.94, 58, 3],
  ])
    for (let j = 0; j < n; j++)
      out.push([
        u + (r() - 0.5) * 0.047,
        l * (0.16 + 0.84 * r()),
        1.6 + 6.8 * r(),
        40 * r(),
      ]);
  return out;
}
export function webRenderer(canvas: HTMLCanvasElement, tex: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const buffers: WebGLBuffer[] = [],
    progs: WebGLProgram[] = [],
    vaos: WebGLVertexArrayObject[] = [];
  function program(a: string, b: string) {
    const p = gl!.createProgram()!;
    for (const [type, src] of [
      [gl!.VERTEX_SHADER, a],
      [gl!.FRAGMENT_SHADER, b],
    ] as const) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS))
        throw Error(gl!.getShaderInfoLog(sh) || "Material compilation failed");
      gl!.attachShader(p, sh);
      gl!.deleteShader(sh);
    }
    gl!.linkProgram(p);
    if (!gl!.getProgramParameter(p, gl!.LINK_STATUS))
      throw Error("Material link failed");
    progs.push(p);
    return p;
  }
  const clothP = program(vert, frag),
    inkP = program(inkVert, inkFrag);
  const w = 174,
    h = 94,
    uv = [],
    ix = [];
  for (let y = 0; y <= h; y++)
    for (let x = 0; x <= w; x++) uv.push(x / w, y / h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * (w + 1) + x;
      ix.push(i, i + 1, i + w + 1, i + 1, i + w + 2, i + w + 1);
    }
  function vao() {
    const v = gl!.createVertexArray()!;
    vaos.push(v);
    gl!.bindVertexArray(v);
    return v;
  }
  function buf(target: number, data: Float32Array | Uint16Array) {
    const b = gl!.createBuffer()!;
    buffers.push(b);
    gl!.bindBuffer(target, b);
    gl!.bufferData(target, data, gl!.STATIC_DRAW);
  }
  const cv = vao();
  buf(gl.ARRAY_BUFFER, new Float32Array(uv));
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  buf(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ix));
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const iv = vao(),
    ribbons = [];
  for (const [u, len, rad, s] of trails())
    for (let j = 0; j < 18; j++)
      for (const [z, side] of [
        [0, -1],
        [0, 1],
        [1, -1],
        [1, -1],
        [0, 1],
        [1, 1],
      ])
        ribbons.push(u, (j + z) / 18, side, len, rad, s);
  for (const [u, len, rad, s] of trails().filter((_, i) => i % 4 === 0))
    for (let j = 0; j < 6; j++)
      for (const [z, side] of [
        [0, -1],
        [0, 1],
        [1, -1],
        [1, -1],
        [0, 1],
        [1, 1],
      ])
        ribbons.push(u, 2 + (j + z) / 6, side, len, rad, s);
  buf(gl.ARRAY_BUFFER, new Float32Array(ribbons));
  for (let a = 0; a < 2; a++) {
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, a ? 2 : 4, gl.FLOAT, false, 24, a ? 16 : 0);
  }
  const loc = progs.map((p) =>
    ["time", "wind"].map((n) => gl.getUniformLocation(p, n)),
  );
  return {
    draw(t: number, w: number) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(inkP);
      gl.uniform1f(loc[1][0], t);
      gl.uniform1f(loc[1][1], w);
      gl.bindVertexArray(iv);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA,
      );
      gl.drawArrays(gl.TRIANGLES, 0, ribbons.length / 6);
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(clothP);
      gl.uniform1f(loc[0][0], t);
      gl.uniform1f(loc[0][1], w);
      gl.bindVertexArray(cv);
      gl.drawElements(gl.TRIANGLES, ix.length, gl.UNSIGNED_SHORT, 0);
    },
    dispose() {
      for (const v of vaos) gl.deleteVertexArray(v);
      for (const b of buffers) gl.deleteBuffer(b);
      for (const p of progs) gl.deleteProgram(p);
      gl.deleteTexture(texture);
    },
  };
}
// Affine triangular patches retain the 50 woven stars, even without WebGL.
export function paperRenderer(c: HTMLCanvasElement, mat: HTMLCanvasElement) {
  const g = c.getContext("2d")!,
    inks = trails();
  return {
    draw(t: number, w: number) {
      g.setTransform(c.width / 1000, 0, 0, c.height / 640, 0, 0);
      g.clearRect(0, 0, 1000, 640);
      g.translate(15, 0);
      g.scale(0.965, 1);
      for (const [u, len, r, s] of inks) {
        const [x, y] = cloth(u, 1, t, w);
        g.fillStyle = "rgba(153,37,29,.54)";
        g.beginPath();
        g.moveTo(x - r, y - 2);
        g.quadraticCurveTo(x, y + len * 0.4, x + Math.sin(s) * 2, y + len);
        g.quadraticCurveTo(x + 2, y + len * 0.23, x + r, y - 2);
        g.fill();
      }
      const nx = 42,
        ny = 16;
      for (let i = 0; i < nx; i++)
        for (let j = 0; j < ny; j++) {
          const u = i / nx,
            v = j / ny;
          for (const f of [0, 1]) {
            const a = cloth(u + f / nx, v + f / ny, t, w),
              b = cloth(u + (1 - f) / nx, v + f / ny, t, w),
              d = cloth(u + f / nx, v + (1 - f) / ny, t, w);
            g.save();
            g.beginPath();
            g.moveTo(a[0], a[1]);
            g.lineTo(b[0], b[1]);
            g.lineTo(d[0], d[1]);
            g.closePath();
            g.clip();
            const sx = ((1 - 2 * f) * mat.width) / nx,
              sy = ((1 - 2 * f) * mat.height) / ny;
            g.transform(
              (b[0] - a[0]) / sx,
              (b[1] - a[1]) / sx,
              (d[0] - a[0]) / sy,
              (d[1] - a[1]) / sy,
              a[0],
              a[1],
            );
            g.drawImage(
              mat,
              -(u + f / nx) * mat.width,
              -(v + f / ny) * mat.height,
            );
            g.fillStyle = `rgba(30,25,20,${Math.max(0, 0.13 - ((b[2] - a[2]) / (1 - 2 * f)) * 0.009)})`;
            g.fillRect(-mat.width, -mat.height, mat.width * 2, mat.height * 2);
            g.restore();
          }
        }
    },
    dispose() {},
  };
}
