#version 300 es

const float PI = 3.14159265359;

in float t;

uniform float amplitude;
uniform float period;
uniform float phase;

void main() {
    float x = t;
    float y = amplitude * sin(2.0 * PI * t /period + phase);
    gl_Position = vec4(x, y, 0.0, 1.0);    
}