
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProductState } from '../types';
import { PRODUCT_CONFIGS } from '../constants';

interface OrbitalElementsProps {
  activeState: ProductState;
}

const FloatingDataBit = ({ orbitRadius, speed, color, offset }: { orbitRadius: number, speed: number, color: string, offset: number }) => {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.z = Math.sin(t) * orbitRadius;
    ref.current.position.y = Math.sin(t * 0.5) * 2;
    ref.current.rotation.y += 0.02;
  });

  return (
    <group ref={ref}>
      {/* Floating geometric tech bit */}
      <mesh>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      {/* Small glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.005, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const OrbitalElements: React.FC<OrbitalElementsProps> = ({ activeState }) => {
  const config = PRODUCT_CONFIGS[activeState];

  const dataBits = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      orbitRadius: 4 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  return (
    <group>
      {dataBits.map((bit, i) => (
        <FloatingDataBit key={i} {...bit} color={config.color} />
      ))}
    </group>
  );
};

export default OrbitalElements;
