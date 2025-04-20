#version 300 es

precision highp float;

out vec4 fragColor;

struct Ball {
    vec2 displacement;
    float radius;
    vec3 color;
};

uniform Ball ball;

void main() {
    fragColor = vec4(ball.color, 1.0);
}