"use client";

import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      // Optimize GPU performance by rendering at a lower resolution (25%) since it's a blurred aurora
      const scale = 0.25; 
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * scale);
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * scale);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    
    window.addEventListener("resize", syncSize);
    syncSize();

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext;
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = v_texCoord;
          
          float t = u_time * 0.3;
          
          // Indigo blob
          vec2 p1 = vec2(0.3 + 0.2 * cos(t), 0.7 + 0.1 * sin(t * 1.1));
          float d1 = length(uv - p1);
          float aurora1 = smoothstep(0.6, 0.0, d1) * 0.3;
          vec3 color1 = vec3(0.12, 0.15, 0.4) * aurora1;
          
          // Rose blob
          vec2 p2 = vec2(0.7 + 0.15 * sin(t * 0.8), 0.3 + 0.2 * cos(t * 1.3));
          float d2 = length(uv - p2);
          float aurora2 = smoothstep(0.5, 0.0, d2) * 0.2;
          vec3 color2 = vec3(0.4, 0.1, 0.15) * aurora2;
          
          vec3 baseBg = vec3(0.039, 0.039, 0.043); // #0A0A0B
          
          gl_FragColor = vec4(baseBg + color1 + color2, 1.0);
      }
    `;

    function cs(type: number, src: string) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vShader = cs(gl.VERTEX_SHADER, vs);
    const fShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vShader || !fShader) return;

    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let animationFrameId: number;

    function render(t: number) {
      if (!canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render(0);

    return () => {
      window.removeEventListener("resize", syncSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full opacity-60"
      style={{ display: "block" }}
    />
  );
}
