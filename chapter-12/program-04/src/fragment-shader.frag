#version 300 es

precision highp float;

struct Ball {
    vec2 displacement;
    float radius;
    vec3 color;
};

uniform Ball ball;
out vec4 fragColor;

void main() {
    fragColor = vec4(ball.color, 1.0);
}