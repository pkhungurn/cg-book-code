#version 300 es

in vec3 vert_position;
in vec4 vert_color;

uniform float scale;
uniform vec3 center;

out vec4 geom_color;

void main() {
    vec3 position = vert_position * scale + center;
    gl_Position = vec4(position, 1);    
    geom_color = vert_color;
}