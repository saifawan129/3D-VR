
import { ProductState, StateConfig } from './types';

export const PRODUCT_CONFIGS: Record<ProductState, StateConfig> = {
  [ProductState.GLASSES]: {
    name: 'Vision Prime',
    tagline: 'Intelligent Eye Wear',
    description: 'Ultra-lightweight titanium frames with integrated holographic HUD and neural-sync technology for seamless digital overlay.',
    price: '$499.00',
    color: '#00f2ff',
    accentColor: '#ffffff',
    roughness: 0.1,
    metalness: 0.9,
    zoom: 6.0,
    bgIntensity: 0.5,
    gridColor: '#00f2ff',
    geometryType: 'wide-box'
  },
  [ProductState.TSHIRT]: {
    name: 'AeroFiber Tee',
    tagline: 'Seamless Comfort',
    description: '100% organic tech-cotton blend. Designed with heat-mapping technology to provide ventilation where you need it most.',
    price: '$55.00',
    color: '#3e8aff',
    accentColor: '#e0eaff',
    roughness: 1.0,
    metalness: 0.0,
    zoom: 5.5,
    bgIntensity: 0.2,
    gridColor: '#3e8aff',
    geometryType: 'box'
  },
  [ProductState.WATCH]: {
    name: 'Horizon Chrono',
    tagline: 'Precision Engineering',
    description: 'A masterpiece of horology. Featuring a sapphire crystal lens and a 48-hour power reserve mechanical movement.',
    price: '$1,250.00',
    color: '#ffd700',
    accentColor: '#fff9e0',
    roughness: 0.1,
    metalness: 1.0,
    zoom: 7.0,
    bgIntensity: 0.6,
    gridColor: '#ffd700',
    geometryType: 'torus'
  },
  [ProductState.VR]: {
    name: 'Neural Vision 3',
    tagline: 'Beyond Reality',
    description: 'The world’s most advanced spatial computer. 8K dual-displays and ultra-low latency eye-tracking technology.',
    price: '$3,499.00',
    color: '#a855f7',
    accentColor: '#f3e8ff',
    roughness: 0.2,
    metalness: 0.8,
    zoom: 6.0,
    bgIntensity: 0.5,
    gridColor: '#a855f7',
    geometryType: 'vr-visor'
  }
};
