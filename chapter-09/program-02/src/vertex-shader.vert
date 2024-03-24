#version 300 es

in vec3 position;

void main() {
    gl_PointSize = 10.0;
    gl_Position = vec4(position, 1);
}