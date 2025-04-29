#version 300 es

struct Ball {
    vec2 displacement;
    float radius;
    vec3 color;
};

uniform Ball ball;
in vec2 position;

void main() {
    gl_Position = vec4(position * ball.radius + ball.displacement, 0, 1);
}