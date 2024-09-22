#version 300 es

const float PI = 3.14159265359;

in vec2 position;

void main() {
    float s = position.s;
    float t = position.t;
    float r = sqrt(s) * 0.8;
    float x = r * cos(2.0 * PI * t);
    float y = r * sin(2.0 * PI * t);
    gl_Position = vec4(x, y, 0.0, 1.0);
}