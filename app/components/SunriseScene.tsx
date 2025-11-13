"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sky, SoftShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type FloatingProps = {
  speed?: number;
  intensity?: number;
  children: React.ReactNode;
};

function Floating({ speed = 1.5, intensity = 0.1, children }: FloatingProps) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime() * speed;
    group.current.position.y = Math.sin(t) * intensity;
    group.current.rotation.y = Math.sin(t * 0.6) * intensity;
  });
  return <group ref={group}>{children}</group>;
}

function Ground() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
    gradient.addColorStop(0, "#ffe48d");
    gradient.addColorStop(0.4, "#f5d880");
    gradient.addColorStop(1, "#a7d27d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial map={texture ?? undefined} roughness={0.8} />
    </mesh>
  );
}

function Hut() {
  return (
    <group position={[-4, 1, -6]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.2, 2.2, 6]} />
        <meshStandardMaterial color="#f0b77d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <coneGeometry args={[2.3, 1.5, 6]} />
        <meshStandardMaterial color="#c6753b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.1, 1.1]}>
        <boxGeometry args={[0.6, 1, 0.1]} />
        <meshStandardMaterial color="#5b3715" />
      </mesh>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 2, 8]} />
        <meshStandardMaterial color="#8d4e27" />
      </mesh>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh position={[0, 2.6, 0]} castShadow>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshStandardMaterial color="#4caf4f" roughness={0.4} />
        </mesh>
        <mesh position={[0.8, 2.2, 0.6]} castShadow>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial color="#60c162" />
        </mesh>
        <mesh position={[-0.8, 2.2, -0.6]} castShadow>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#56b85a" />
        </mesh>
      </Float>
    </group>
  );
}

function FlowerField() {
  const flowers = useMemo(() => {
    const data: Array<{ position: [number, number, number]; color: string }> = [];
    const palette = ["#ff6fa1", "#ffd166", "#ff8a5c", "#57cc99", "#9b5de5"];
    for (let i = 0; i < 150; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      data.push({ position: [x, 0.02, z], color: palette[i % palette.length] });
    }
    return data;
  }, []);

  return (
    <group>
      {flowers.map((flower, index) => (
        <mesh key={index} position={flower.position} rotation-x={-Math.PI / 2}>
          <cylinderGeometry args={[0, 0.08, 0.5, 6]} />
          <meshStandardMaterial color={flower.color} emissive={flower.color} emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Sun() {
  return (
    <Floating intensity={0.5}>
      <mesh position={[15, 12, -30]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial emissive="#fff4b1" emissiveIntensity={1.5} color="#fff4b1" />
      </mesh>
    </Floating>
  );
}

function Cloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.x += 0.001 * scale;
    if (group.current.position.x > 25) {
      group.current.position.x = -25;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 0.4, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#f6f6ff" roughness={0.3} />
      </mesh>
      <mesh position={[-1.1, 0.3, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#f8f8ff" roughness={0.3} />
      </mesh>
    </group>
  );
}

function Boy() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.x = Math.sin(t) * 1.2;
    group.current.rotation.y = Math.sin(t) * 0.4;
  });

  return (
    <group ref={group} position={[0, 1, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffcba3" />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#f7a94d" />
      </mesh>
      <mesh position={[0, -0.3, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 4, 8]} />
        <meshStandardMaterial color="#3f7cf5" />
      </mesh>
      <mesh position={[-0.3, -0.9, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#2b61c5" />
      </mesh>
      <mesh position={[0.3, -0.9, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#2b61c5" />
      </mesh>
      <mesh position={[-0.45, 0.1, 0]} rotation={[0, 0, 1.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
        <meshStandardMaterial color="#ffcba3" />
      </mesh>
      <mesh position={[0.55, 0.1, 0]} rotation={[0, 0, -1.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
        <meshStandardMaterial color="#ffcba3" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#2d1f15" />
      </mesh>
      <mesh position={[0, 1.3, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2d1f15" />
      </mesh>
      <mesh position={[0.2, 1.2, 0.35]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 1.2, 0.35]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 1.05, 0.4]}>
        <torusGeometry args={[0.15, 0.04, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#ff9770" />
      </mesh>
    </group>
  );
}

function VillageScene() {
  return (
    <group>
      <SoftShadows size={40} samples={16} focus={0.5} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Sun />
      <Ground />
      <Hut />
      <Tree position={[3.5, 0, -4]} />
      <Tree position={[-6, 0, 5]} />
      <Tree position={[7, 0, 6]} />
      <FlowerField />
      <Floating intensity={0.15}>
        <Boy />
      </Floating>
      <Cloud position={[-10, 8, -15]} scale={2.6} />
      <Cloud position={[6, 9, -12]} scale={2} />
      <Cloud position={[-18, 7, -10]} scale={1.8} />
      <Sky
        sunPosition={[15, 12, -30]}
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.45}
        azimuth={0.25}
      />
    </group>
  );
}

export default function SunriseScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 6, 12], fov: 40 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#fffaf0"]} />
      <Suspense fallback={null}>
        <VillageScene />
      </Suspense>
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.7}
        maxDistance={25}
        minDistance={8}
      />
    </Canvas>
  );
}
