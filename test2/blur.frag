precision mediump float;

uniform sampler2D tex0;
uniform vec2 resolution;
uniform float blurSize;
uniform float noiseStrength;
varying vec2 vTexCoord;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 texCoord = vTexCoord;
    vec4 color = vec4(0.0);
    float total = 0.0;

    for (float x = -4.0; x <= 4.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
            vec2 samplePos = texCoord + vec2(x, y) * blurSize / resolution;
            vec4 sampleColor = texture2D(tex0, samplePos);
            float noise = (random(samplePos) - 0.5) * noiseStrength;
            sampleColor.r += noise;
            sampleColor.g += noise;
            sampleColor.b += noise;
            color += sampleColor;
            total += 1.0;
        }
    }

    gl_FragColor = color / total;
}
