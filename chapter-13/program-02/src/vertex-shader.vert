#version 300 es

in vec2 vert_position;
in vec3 vert_color;

out vec3 geom_color;

void main() {
    gl_Position = vec4(vert_position, 0, 1);
    geom_color = vert_color;
}