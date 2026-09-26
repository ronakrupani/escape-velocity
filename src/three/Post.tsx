/**
 * Post-processing and colour grade. Every value is driven per frame from the
 * timeline's look keys (journey.look) plus events (ignition flash).
 */
import { useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Noise, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, Effect, KernelSize, ToneMappingMode } from 'postprocessing';
import { forwardRef, useMemo, useRef } from 'react';
import { Color, Uniform, Vector2 } from 'three';
import { journey } from '../journey/state';

const gradeFragment = /* glsl */ `
uniform float uExposure;
uniform float uSaturation;
uniform float uFlash;
uniform vec3 uTint;
uniform vec3 uLift;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb * uExposure * uTint;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, uSaturation);
  // Cool the shadows a touch, warm the highlights: a filmic split tone.
  float shadow = 1.0 - smoothstep(0.0, 0.35, l);
  c += uLift * shadow;
  // Ignition: a warm white-out that blooms and decays.
  c += uFlash * vec3(1.0, 0.78, 0.55) * 4.0;
  outputColor = vec4(c, inputColor.a);
}
`;

class GradeEffect extends Effect {
  constructor() {
    super('GradeEffect', gradeFragment, {
      uniforms: new Map<string, Uniform>([
        ['uExposure', new Uniform(1)],
        ['uSaturation', new Uniform(1)],
        ['uFlash', new Uniform(0)],
        ['uTint', new Uniform(new Color(1, 1, 1))],
        ['uLift', new Uniform(new Color(0.004, 0.006, 0.012))],
      ]),
    });
  }
}

const Grade = forwardRef<GradeEffect>(function Grade(_, ref) {
  const effect = useMemo(() => new GradeEffect(), []);
  return <primitive ref={ref} object={effect} dispose={null} />;
});

type BloomLike = { intensity: number; luminanceMaterial: { threshold: number } };
type ChromaLike = { offset: Vector2 };
type VignetteLike = { darkness: number };
type NoiseLike = { blendMode: { opacity: { value: number } } };

export function Post() {
  const bloom = useRef<BloomLike>(null);
  const chroma = useRef<ChromaLike>(null);
  const vignette = useRef<VignetteLike>(null);
  const noise = useRef<NoiseLike>(null);
  const grade = useRef<GradeEffect>(null);
  const low = journey.quality === 'low';
  const caOffset = useMemo(() => new Vector2(0.0006, 0.0006), []);

  useFrame(() => {
    const l = journey.look;
    if (bloom.current) {
      bloom.current.intensity = l.bloom * (1 + journey.flash * 2.5);
      bloom.current.luminanceMaterial.threshold = l.bloomThreshold;
    }
    const warp = journey.warp;
    if (chroma.current) chroma.current.offset.setScalar(l.chroma * (1 + warp * 2.5) + journey.shake * 0.0012);
    if (vignette.current) vignette.current.darkness = l.vignette;
    if (noise.current) noise.current.blendMode.opacity.value = l.grain;
    if (grade.current) {
      const u = grade.current.uniforms;
      u.get('uExposure')!.value = l.exposure;
      u.get('uSaturation')!.value = l.saturation;
      u.get('uFlash')!.value = journey.flash;
    }
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        ref={bloom as never}
        mipmapBlur
        intensity={0.7}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.25}
        radius={0.82}
        levels={low ? 5 : 8}
        kernelSize={KernelSize.LARGE}
      />
      <Grade ref={grade} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {low ? <></> : <ChromaticAberration ref={chroma as never} offset={caOffset} radialModulation modulationOffset={0.35} />}
      <Vignette ref={vignette as never} offset={0.28} darkness={0.55} eskil={false} />
      <Noise ref={noise as never} premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.05} />
      {low ? <></> : <SMAA />}
    </EffectComposer>
  );
}
