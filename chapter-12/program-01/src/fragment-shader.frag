#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec3 color;

void main() {
    fragColor = vec4(color, 1.0);
}