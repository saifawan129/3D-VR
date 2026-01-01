
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ProductState } from '../types';
import { PRODUCT_CONFIGS } from '../constants';

interface SpaceBackgroundProps {
  activeState: ProductState;
}

const ProductBackground: React.FC<SpaceBackgroundProps> = ({ activeState }) => {
  const gridRef = useRef<THREE.GridHelper>(null!);
  const config = PRODUCT_CONFIGS[activeState];

  useEffect(() => {
    if (gridRef.current) {
      const targetColor = new THREE.Color(config.gridColor);
      // Fade grid color
      gsap.to(gridRef.current.material, {
        opacity: 0.1,
        duration: 1
      });
    }
  }, [activeState, config.gridColor]);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <>
      {/* Moving Tech Grid Floor */}
      <gridHelper 
        ref={gridRef} 
        args={[100, 50, config.color, '#111']} 
        position={[0, -3.1, 0]} 
      />
      
      {/* Background Pillars/Glows */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial 
          color="#000" 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Floating Light Bars */}
      <group>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[(i - 2) * 10, 5, -15]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, 20, 0.1]} />
            <meshBasicMaterial color={config.color} transparent opacity={0.1} />
          </mesh>
        ))}
      </group>
    </>
  );
};

export default ProductBackground;
