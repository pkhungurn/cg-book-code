#version 300 es

in vec2 vert_position;

void main() {
    gl_Position = vec4(vert_position, 0, 1);
}