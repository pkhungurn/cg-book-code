#version 300 es

const float PI = 3.14159265359;

in float t;

void main() {
    float theta = 2.0 * PI * t;
    float x = 0.25 * (2.0*cos(theta) - cos(2.0*theta));
    float y = 0.25 * (2.0*sin(theta) - sin(2.0*theta));
    gl_Position = vec4(x, y, 0.0, 1.0);
}