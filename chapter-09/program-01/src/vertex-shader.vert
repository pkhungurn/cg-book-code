#version 300 es

int vec3 position;

void main() {
    gl_Position = vec4(position, 1);
}