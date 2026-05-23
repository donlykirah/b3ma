import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, SpotLight, Text } from '@react-three/drei';
import * as THREE from 'three';

function AgentPedestal({ position, color, agentName, isSpeaking, activeLight }) {
  const meshRef = useRef();
  const lightRef = useRef();
  
  useFrame(({ clock }) => {
    if (meshRef.current && isSpeaking) {
      const time = clock.getElapsedTime();
      meshRef.current.scale.y = 1 + Math.sin(time * 8) * 0.05;
      if (lightRef.current) {
        lightRef.current.intensity = 2 + Math.sin(time * 10) * 1;
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Pedestal base */}
      <mesh position={[0, -0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.8, 1, 0.3, 32]} />
        <meshStandardMaterial color="#2a1f1a" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Marble column */}
      <mesh ref={meshRef} position={[0, 0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.5, 0.6, 1, 32]} />
        <meshStandardMaterial color="#d4c5b0" metalness={0.4} roughness={0.2} emissive={isSpeaking ? color : '#000'} emissiveIntensity={isSpeaking ? 0.3 : 0} />
      </mesh>
      
      {/* Agent symbol - floating */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {agentName === 'APOLLO' && '🟢'}
        {agentName === 'CASSANDRA' && '🔴'}
        {agentName === 'SENTINEL' && '🟡'}
        {agentName === 'ORACLE' && '🔵'}
      </Text>
      
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {agentName}
      </Text>
      
      {/* Reactive spot light */}
      <SpotLight
        ref={lightRef}
        position={[0, 2, 1]}
        angle={0.4}
        penumbra={0.5}
        intensity={isSpeaking ? 1.5 : 0.2}
        color={color}
        distance={5}
      />
    </group>
  );
}

function SenateFloor() {
  const floorRef = useRef();
  
  useFrame(({ clock }) => {
    if (floorRef.current) {
      floorRef.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  const floorShader = useMemo(() => ({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_PointSize = 1.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec3 color1 = vec3(0.2, 0.12, 0.08);
        vec3 color2 = vec3(0.15, 0.08, 0.05);
        float pattern = sin(vUv.x * 20.0 + time) * cos(vUv.y * 20.0 + time);
        vec3 finalColor = mix(color1, color2, pattern * 0.5 + 0.5);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), []);
  
  return (
    <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial args={[floorShader]} />
    </mesh>
  );
}

function SenateChamber({ activeLight, currentSpeaker }) {
  const pedestals = [
    { name: 'ORACLE', position: [-3, 0, -2], color: '#00ccff' },
    { name: 'APOLLO', position: [-1, 0, -2.5], color: '#00ff88' },
    { name: 'CASSANDRA', position: [1, 0, -2.5], color: '#ff3366' },
    { name: 'SENTINEL', position: [3, 0, -2], color: '#ffaa00' },
  ];
  
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 8], fov: 50 }}
      style={{ background: '#050505' }}
    >
      <color attach="background" args={['#050505']} />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
      
      <SenateFloor />
      
      {/* Central emblem */}
      <mesh position={[0, -0.5, -1]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 64]} />
        <meshStandardMaterial color="#c9a03d" metalness={0.8} roughness={0.2} emissive="#ffaa00" emissiveIntensity={0.1} />
      </mesh>
      
      {pedestals.map((pedestal, idx) => (
        <AgentPedestal
          key={idx}
          position={pedestal.position}
          color={pedestal.color}
          agentName={pedestal.name}
          isSpeaking={currentSpeaker === pedestal.name}
          activeLight={activeLight}
        />
      ))}
      
      {/* Floating particles */}
      <Environment preset="night" />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        target={[0, 0, -1]}
        maxPolarAngle={Math.PI / 3}
      />
      
      <fog exp={0.02} color="#050505" />
    </Canvas>
  );
}

export default SenateChamber;