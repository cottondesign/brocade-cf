precision mediump float;

uniform sampler2D tex0;
uniform float threshold;
varying vec2 vTexCoord;

void main() {
    vec4 color = texture2D(tex0, vTexCoord);
    float brightness = (color.r + color.g + color.b) / 3.0;
    if (brightness > threshold) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
