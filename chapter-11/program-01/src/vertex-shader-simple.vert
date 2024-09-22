#version 300 es

in float t;

void main() {
    gl_Position = vec4(t, 0.0, 0.0, 1.0);
}