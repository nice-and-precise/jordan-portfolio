/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Color, Vector2, AdditiveBlending } from 'three';

const ParticleShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorChaos: { value: new Color('#ff4d4d') }, // Red/Orange for chaos
        uColorOrder: { value: new Color('#3b82f6') }, // Blue for order
        uMouse: { value: new Vector2(0, 0) },
    },
    vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    attribute vec3 aRandomPos;
    attribute vec3 aTargetPos;
    attribute float aSpeed;
    
    varying vec2 vUv;
    varying float vOrder;

    // Cubic easing out
    float easeOutCubic(float x) {
      return 1.0 - pow(1.0 - x, 3.0);
    }

    void main() {
      vUv = uv;
      
      // Oscillate between 0 (Chaos) and 1 (Order)
      // Slower, breathing rhythm
      float progress = (sin(uTime * 0.5) + 1.0) * 0.5;
      
      // Add some staggering based on particle index/speed
      float localProgress = clamp(progress + sin(uTime + aSpeed * 10.0) * 0.1, 0.0, 1.0);
      
      vOrder = localProgress;

      // Mix positions
      vec3 pos = mix(aRandomPos, aTargetPos, easeOutCubic(localProgress));
      
      // Mouse interaction (repel)
      float dist = distance(pos.xy, uMouse);
      float force = smoothstep(3.0, 0.0, dist);
      vec3 repelDir = normalize(pos - vec3(uMouse, 0.0));
      pos += repelDir * force * 0.5;

      // Particle Size
      float size = mix(3.0, 1.5, localProgress); // Larger in chaos, organized dots in order

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    uniform vec3 uColorChaos;
    uniform vec3 uColorOrder;
    varying float vOrder;

    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;

      // Glow effect
      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 1.5);

      vec3 color = mix(uColorChaos, uColorOrder, vOrder);
      
      gl_FragColor = vec4(color, glow);
    }
  `
};

function Particles({ count = 2000 }) {
    const mesh = useRef(null);
    const shaderMaterial = useRef(null);

    const [[positions, randomPos, targetPos, speeds]] = useState(() => {
        const positions = new Float32Array(count * 3);
        const randomPos = new Float32Array(count * 3);
        const targetPos = new Float32Array(count * 3);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Target: Structured Grid/Sphere
            const x = (i % 50) - 25;
            const y = (Math.floor(i / 50) % 40) - 20;
            const z = 0;
            targetPos[i * 3] = x * 0.5;
            targetPos[i * 3 + 1] = y * 0.5;
            targetPos[i * 3 + 2] = z;

            // Random: Chaos sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 15 + Math.random() * 10;

            randomPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            randomPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            randomPos[i * 3 + 2] = radius * Math.cos(phi);

            speeds[i] = Math.random();
        }

        return [positions, randomPos, targetPos, speeds];
    });

    useFrame((state) => {
        if (shaderMaterial.current) {
            shaderMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
            // Convert simpler mouse coordinates (-1 to 1) 
            const x = (state.pointer.x * state.viewport.width) / 2;
            const y = (state.pointer.y * state.viewport.height) / 2;
            shaderMaterial.current.uniforms.uMouse.value.set(x, y);
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aRandomPos"
                    count={randomPos.length / 3}
                    array={randomPos}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aTargetPos"
                    count={targetPos.length / 3}
                    array={targetPos}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aSpeed"
                    count={speeds.length}
                    array={speeds}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={shaderMaterial}
                args={[ParticleShaderMaterial]}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
            />
        </points>
    );
}

export default function EntropyParticles() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]} // Quality scaling
            >
                <Particles count={3000} />
            </Canvas>
        </div>
    );
}
