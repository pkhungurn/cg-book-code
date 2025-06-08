#version 300 es

precision highp float;

in vec3 geom_color;

out vec4 fragColor;

void main() {
    fragColor = vec4(geom_color, 1.0);
}