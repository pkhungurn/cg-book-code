#version 300 es

precision highp float;

in vec2 geom_position;

out vec4 fragColor;

void main() {
    fragColor = vec4((geom_position + 1.0) * 0.5, 0.0, 1.0);
}