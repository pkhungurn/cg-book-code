#version 300 es

const float PI = 3.14159265359;

in float t;

void main() {
    float theta = 2.0 * PI * t;
    float x = 2.0 * 0.2 * (1.0 - cos(theta)) * cos(theta);
    float y = 2.0 * 0.2 * (1.0 - cos(theta)) * sin(theta);
    gl_Position = vec4(x, y, 0.0, 1.0);
}