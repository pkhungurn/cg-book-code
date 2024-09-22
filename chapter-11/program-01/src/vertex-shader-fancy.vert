#version 300 es

const float PI = 3.14159265359;

in float t;

void main() {
    gl_Position = vec4(t, 0.1*sin(2.0*5.0*PI*t), 0.0, 1.0);    
}