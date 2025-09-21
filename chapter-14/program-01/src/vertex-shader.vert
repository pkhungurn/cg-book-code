#version 300 es

in vec2 vert_position;
in vec3 vert_color;

uniform float scale;
uniform vec2 center;

out vec3 geom_color;

void main() {
    vec2 position = vert_position * scale + center;
    gl_Position = vec4(position, 0, 1) ;    
    geom_color = vert_color;
}