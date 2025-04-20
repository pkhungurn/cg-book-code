#version 300 es

#define BALL_COUNT 16;

in vec2 position;

struct Ball {
    vec2 displacement;
    float radius;
    vec3 color;
};

uniform Ball ball;


void main() {
    gl_Position = vec4(position * ball.radius + ball.displacement, 0, 1);
}