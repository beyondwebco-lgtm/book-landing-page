/**
 * Custom Vertex and Fragment shader for realistic physical page curvature,
 * gentle paper thickness shading, spine ambient occlusion, and lighting response.
 */
export const PageCurlShader = {
  vertexShader: `
    uniform float uCurlProgress;
    uniform float uSpineSide; // -1 for left page, 1 for right page
    uniform float uTime;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vShadowDepth;

    void main() {
      vUv = uv;
      vec3 transformed = position;

      // Distance from binding spine (x = 0) to page edge (x = 1)
      float distFromSpine = uv.x;
      
      // Calculate realistic arch curl deformation when page is actively turning
      if (uCurlProgress > 0.001 && uCurlProgress < 0.999) {
        float theta = uCurlProgress * 3.14159265;
        transformed.z += sin(distFromSpine * 3.14159265) * 0.45 * sin(theta);
        transformed.x = (1.0 - cos(theta * distFromSpine)) * (uSpineSide > 0.0 ? -1.0 : 1.0) * distFromSpine;
        float cornerLift = pow(uv.y, 2.0) * sin(theta) * 0.15;
        transformed.z += cornerLift;
      }

      transformed.z += sin(uTime * 1.5 + position.x * 2.0) * 0.003;

      vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
      vWorldPosition = worldPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      vShadowDepth = distFromSpine;

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec3 uSpineColor;
    uniform float uSpineSide;
    uniform vec3 uGoldTint;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vShadowDepth;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      float spineCreaseAO = smoothstep(0.0, 0.25, vUv.x);
      spineCreaseAO = mix(0.55, 1.0, spineCreaseAO);

      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
      float diff = max(dot(vNormal, lightDir), 0.15);
      
      vec3 ambient = vec3(0.96, 0.91, 0.82) * 0.6;
      vec3 finalColor = texColor.rgb * (ambient + diff * 0.55) * spineCreaseAO;

      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `
};
