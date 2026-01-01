
export enum ProductState {
  GLASSES = 'GLASSES',
  TSHIRT = 'TSHIRT',
  WATCH = 'WATCH',
  VR = 'VR'
}

export interface StateConfig {
  name: string;
  tagline: string;
  description: string;
  price: string;
  color: string;
  accentColor: string;
  roughness: number;
  metalness: number;
  zoom: number;
  bgIntensity: number;
  gridColor: string;
  geometryType: 'sphere' | 'box' | 'torus' | 'cylinder' | 'wide-box' | 'vr-visor';
}
