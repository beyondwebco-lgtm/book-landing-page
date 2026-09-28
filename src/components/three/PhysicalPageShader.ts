import * as THREE from 'three';

/**
 * Custom GLSL Shader for physically realistic Paper Page Curvature and Turning.
 * 
 * PHYSICS PRINCIPLE:
 * - Hinge (x = 0) remains fixed at the spine (x=0, z=0).
 * - Free Edge (x = 1) leads the rotation smoothly from right (+width) to left (-width).
 * - Smooth geometric cylinder bend that arches naturally over the spine without clipping or distortion.
 * - Double-sided texture mapping with gl_FrontFacing and UV flip on back page.
 */

export interface PageTurnUniforms {
  [uniform: string]: THREE.IUniform;
  uCurlProgress: { value: number };
  uFrontTexture: { value: THREE.Texture | null };
  uBackTexture: { value: THREE.Texture | null };
  uPageWidth: { value: number };
  uPageHeight: { value: number };
  uSpineShadowIntensity: { value: number };
}

export const PhysicalPageShader = {
  vertexShader: `
    uniform float uCurlProgress;
    uniform float uPageWidth;
    uniform float uPageHeight;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vCurlProgress;

    void main() {
      vUv = uv;
      vCurlProgress = uCurlProgress;

      // uv.x: 0.0 (spine hinge) to 1.0 (free outer edge)
      float x = uv.x;
      float y = uv.y;

      float width = uPageWidth;
      float height = uPageHeight;

      vec3 pos = vec3(x * width, (y - 0.5) * height, 0.0);

      if (uCurlProgress > 0.0001 && uCurlProgress < 0.9999) {
        // Overall turn angle from 0 (flat right) to PI (flat left)
        float turnAngle = uCurlProgress * 3.14159265359;

        // Smooth wave propagation: outer edge moves first, inner follows
        float phase = clamp((uCurlProgress - (1.0 - x) * 0.25) / 0.75, 0.0, 1.0);
        float smoothPhase = smoothstep(0.0, 1.0, phase);
        float localAngle = smoothPhase * 3.14159265359;

        // Natural cylindrical arching height above the book
        float archHeight = sin(localAngle) * (width * 0.35) * sin(x * 3.14159265 * 0.95);

        // Smooth rotation around the spine hinge
        pos.x = x * width * cos(localAngle);
        pos.z = archHeight + sin(localAngle) * (x * width * 0.22);

        // Corner flex: outer corner lifts slightly ahead of center
        float cornerFlex = sin(localAngle) * pow(abs(y - 0.5) * 2.0, 2.0) * (width * 0.08);
        pos.z += cornerFlex;
      } else if (uCurlProgress >= 0.9999) {
        // Fully landed flat on left page spread
        pos.x = -x * width;
        pos.z = 0.002;
      }

      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,

  fragmentShader: `
    uniform float uCurlProgress;
    uniform sampler2D uFrontTexture;
    uniform sampler2D uBackTexture;
    uniform float uSpineShadowIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vCurlProgress;

    void main() {
      bool isFront = gl_FrontFacing;
      
      vec4 texColor;
      if (isFront) {
        // Front page texture (Right Page Spread)
        texColor = texture2D(uFrontTexture, vUv);
      } else {
        // Back page texture (Left Page Spread of Next Chapter)
        vec2 backUv = vec2(1.0 - vUv.x, vUv.y);
        texColor = texture2D(uBackTexture, backUv);
      }

      // Spine hinge shadow
      float spineAO = smoothstep(0.0, 0.18, vUv.x);
      spineAO = mix(0.65, 1.0, spineAO);

      // Warm directional light calculation
      vec3 lightDir = normalize(vec3(0.2, 0.8, 1.0));
      vec3 normal = normalize(vNormal);
      if (!isFront) normal = -normal;

      float diff = max(dot(normal, lightDir), 0.3);

      vec3 ambientLight = vec3(0.96, 0.93, 0.86) * 0.7;
      vec3 diffuseLight = vec3(1.0, 0.96, 0.9) * (diff * 0.45);

      vec3 finalColor = texColor.rgb * (ambientLight + diffuseLight) * spineAO;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
