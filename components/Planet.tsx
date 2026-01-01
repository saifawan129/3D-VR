
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE_CORE from 'three';
import gsap from 'gsap';
import { ProductState } from '../types';
import { PRODUCT_CONFIGS } from '../constants';

const THREE = THREE_CORE;

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uMorphFactor;
  uniform float uDisplacement;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    float wave = sin(position.y * 2.5 + uTime) * 0.08 * uMorphFactor;
    vec3 newPosition = position + normal * wave * uDisplacement;
    
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  uniform vec3 uColor;
  uniform vec3 uAccentColor;
  uniform float uRoughness;
  uniform float uMetalness;
  uniform float uTime;
  uniform bool uIsVR;
  uniform bool uIsScanning;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + .1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
                   mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                   mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    
    float nDetail = noise(vPosition * 30.0 + uTime * 0.05);
    float surfaceGrain = nDetail * 0.1;
    
    float panelLines = 0.0;
    if(uIsVR) {
      vec2 grid = abs(fract(vUv * vec2(12.0, 6.0) - 0.5) - 0.5);
      panelLines = smoothstep(0.46, 0.5, max(grid.x, grid.y));
    } else {
      panelLines = smoothstep(0.48, 0.5, abs(fract(vPosition.y * 6.0 - uTime * 0.2) - 0.5)) * 0.3;
    }
    
    float breathe = 0.6 + 0.4 * sin(uTime * 1.2);
    float flicker = 0.96 + 0.04 * sin(uTime * 60.0);
    
    // Diagnostic Scan Visual Modifier
    if (uIsScanning) {
      flicker = 0.8 + 0.2 * sin(uTime * 120.0);
      breathe = 1.0 + 0.5 * sin(uTime * 10.0);
    }
    
    float activity = smoothstep(0.75, 1.0, noise(vPosition * 8.0 + uTime * 0.5));
    float scan = smoothstep(0.97, 1.0, sin(vPosition.y * 12.0 - uTime * 3.0));
    
    float emissiveIntensity = (panelLines * 4.0 + activity * 2.0 + scan * 6.0);
    if (uIsScanning) emissiveIntensity *= 2.0;
    
    vec3 emission = uAccentColor * emissiveIntensity * breathe * flicker;
    
    vec3 finalBase = uColor + (surfaceGrain * (1.0 - uRoughness));
    
    float spec = pow(max(dot(reflect(-viewDir, vNormal), vec3(0, 1, 0)), 0.0), 40.0);
    vec3 reflection = vec3(1.0) * (fresnel + spec * uMetalness) * (1.2 - uRoughness);
    
    gl_FragColor = vec4(finalBase + reflection + emission, 1.0);
  }
`;

const ProductGeometry = ({ type }: { type: string }) => {
  switch (type) {
    case 'box': return <boxGeometry args={[3, 4, 0.5, 64, 64, 64]} />; 
    case 'wide-box': return <boxGeometry args={[5, 1.5, 0.4, 64, 64, 64]} />; 
    case 'torus': return <torusGeometry args={[2, 0.4, 64, 128]} />; 
    case 'cylinder': return <cylinderGeometry args={[2.5, 2.5, 1, 64, 64, true]} />; 
    case 'vr-visor': 
      return <cylinderGeometry args={[2, 2.2, 2.5, 128, 64, false, 0, Math.PI * 2]} />;
    default: return <sphereGeometry args={[2.2, 128, 128]} />; 
  }
};

interface ProductDisplayProps {
  activeState: ProductState;
  isScanning: boolean;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ activeState, isScanning }) => {
  const meshRef = useRef<THREE_CORE.Mesh>(null!);
  const materialRef = useRef<THREE_CORE.ShaderMaterial>(null!);
  const { camera } = useThree();
  const config = PRODUCT_CONFIGS[activeState];

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(config.color) },
    uAccentColor: { value: new THREE.Color(config.accentColor) },
    uMorphFactor: { value: 0 },
    uDisplacement: { value: 0.5 },
    uRoughness: { value: config.roughness },
    uMetalness: { value: config.metalness },
    uIsVR: { value: activeState === ProductState.VR },
    uIsScanning: { value: isScanning }
  }), []);

  useEffect(() => {
    gsap.to(uniforms.uColor.value, {
      r: new THREE.Color(config.color).r,
      g: new THREE.Color(config.color).g,
      b: new THREE.Color(config.color).b,
      duration: 1.5,
      ease: "power3.inOut"
    });

    gsap.to(uniforms.uAccentColor.value, {
      r: new THREE.Color(config.accentColor).r,
      g: new THREE.Color(config.accentColor).g,
      b: new THREE.Color(config.accentColor).b,
      duration: 1.5,
      ease: "power3.inOut"
    });

    gsap.to(uniforms.uMetalness, { value: config.metalness, duration: 1.2 });
    gsap.to(uniforms.uRoughness, { value: config.roughness, duration: 1.2 });
    uniforms.uIsVR.value = activeState === ProductState.VR;

    gsap.fromTo(uniforms.uMorphFactor, 
      { value: 4.0 }, 
      { value: 0.2, duration: 3.0, ease: "elastic.out(1, 0.4)" }
    );

    gsap.to(camera.position, {
      z: config.zoom,
      duration: 2.0,
      ease: "expo.inOut"
    });
  }, [activeState, camera, uniforms, config]);

  useEffect(() => {
    uniforms.uIsScanning.value = isScanning;
    if (isScanning) {
      gsap.to(uniforms.uMorphFactor, { value: 2.0, duration: 0.5, yoyo: true, repeat: -1 });
    } else {
      gsap.to(uniforms.uMorphFactor, { value: 0.2, duration: 1 });
    }
  }, [isScanning, uniforms]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      const rotSpeed = isScanning ? 0.01 : 0.002;
      meshRef.current.rotation.y += rotSpeed;
      meshRef.current.rotation.x += rotSpeed * 0.25;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <ProductGeometry type={config.geometryType} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

export default ProductDisplay;
