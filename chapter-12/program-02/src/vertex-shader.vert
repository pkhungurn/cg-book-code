#version 300 es

in vec2 position;

uniform vec2 displacement;

void main() {
    gl_Position = vec4(position + displacement, 0, 1);
}