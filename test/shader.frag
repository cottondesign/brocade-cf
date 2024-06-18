#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec2 resolution;
uniform float time;

void main() {
  vec2 st = gl_FragCoord.xy / resolution;

  // Sample the texture
  vec4 color = texture2D(texture, st);

  // Add noise
  float noise = (fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5) * 0.2;
  color.rgb += noise;

  // Simple blur by averaging surrounding pixels
  vec4 blur = vec4(0.0);
  int samples = 9;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 offset = vec2(float(x), float(y)) / resolution;
      blur += texture2D(texture, st + offset);
    }
  }
  blur /= float(samples);
  color = blur;

  // Apply threshold
  float avg = (color.r + color.g + color.b) / 3.0;
  float threshold = 0.5;
  if (avg > threshold) {
    color.rgb = vec3(1.0);
  } else {
    color.rgb = vec3(0.0);
  }

  gl_FragColor = color;
}
