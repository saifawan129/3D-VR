import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import ProductDisplay from './Planet';
import SpaceBackground from './SpaceBackground';
import OrbitalElements from './OrbitalElements';
import { ProductState } from '../types';
import { PRODUCT_CONFIGS } from '../constants';

interface SceneProps {
  activeState: ProductState;
  isScanning: boolean;
}

const Scene: React.FC<SceneProps> = ({ activeState, isScanning }) => {
  const config = PRODUCT_CONFIGS[activeState];

  return (
    <Canvas 
      dpr={[1, 2]} 
      shadows 
      gl={{ 
        antialias: false, 
        powerPreference: "high-performance",
        alpha: true,
        stencil: false,
        depth: true
      }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      
      {/* Studio Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 15, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={config.bgIntensity * 8} 
        castShadow 
        color={config.color} 
      />
      <pointLight position={[-10, -5, -10]} intensity={1.5} color={config.accentColor} />
      
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <ProductDisplay activeState={activeState} isScanning={isScanning} />
        </Float>
        
        <OrbitalElements activeState={activeState} />
        <SpaceBackground activeState={activeState} />
        
        <ContactShadows 
          position={[0, -3.1, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={10} 
          color="#000000"
        />
        
        <Environment preset="studio" />
        
        <EffectComposer multisampling={0}>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={isScanning ? 2.5 : 1.2} 
            radius={0.4}
          />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.5} 
        autoRotate={false}
      />
    </Canvas>
  );
};

export default Scene;