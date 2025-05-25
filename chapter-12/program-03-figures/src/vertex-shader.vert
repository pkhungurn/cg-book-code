#version 300 es

in vec2 position;

uniform vec2 displacement;
uniform float radius;

void main() {
    gl_Position = vec4(radius * position + displacement, 0, 1);
}