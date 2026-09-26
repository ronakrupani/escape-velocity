import { AdaptiveDpr, PerformanceMonitor, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { journey } from '../journey/state';
import { Director } from './Director';
import { Post } from './Post';
import { World } from './World';

export default function Experience() {
  const maxDpr = journey.quality === 'high' ? 2 : journey.quality === 'medium' ? 1.5 : 1.25;
  const [dpr, setDpr] = useState(Math.min(maxDpr, typeof window === 'undefined' ? 1 : window.devicePixelRatio));
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100lvh', zIndex: 0 }}
      flat
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, alpha: false, depth: true }}
      camera={{ fov: 36, near: 0.02, far: 4e6, position: [0, 0, 10] }}
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      aria-hidden="true"
    >
      <color attach="background" args={['#05060A']} />
      <PerformanceMonitor
        bounds={() => [45, 58]}
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(1, +(d * 0.8).toFixed(2)))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, +(d * 1.15).toFixed(2)))}
      />
      <AdaptiveDpr pixelated={false} />
      <Director />
      <Suspense fallback={null}>
        <World />
        <Preload all />
      </Suspense>
      <Post />
    </Canvas>
  );
}
