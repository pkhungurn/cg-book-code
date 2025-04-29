#version 300 es

in vec2 vert_position;

uniform vec2 displacement;

void main() {
    gl_Position = vec4(vert_position + displacement, 0, 1);
}