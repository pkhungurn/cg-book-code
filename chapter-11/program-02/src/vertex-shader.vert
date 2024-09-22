#version 300 es

in float t;

void main() {
    float x = 0.25 * (2.0*cos(t) - cos(2.0*t));
    float y = 0.25 * (2.0*sin(t) - sin(2.0*t));
    gl_Position = vec4(x, y, 0.0, 1.0);
}