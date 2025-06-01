#version 300 es

precision highp float;

in vec2 geom_position;

uniform vec2 center;
uniform float scale;
uniform bool drawZonePlate;

out vec4 fragColor;

float fractionalPartToMonochrome(float t) {
    float u = t - floor(t);
    if (u < 0.5) {
        return 0.0;
    } else {
        return 1.0;
    }
}

float zonePlate(vec2 p) {
    float r2 = p.x*p.x + p.y*p.y;
    return fractionalPartToMonochrome(r2);
}

float fractal(vec2 p) {
    float real = p.x;
    float imag = p.y;
    vec2 c = vec2(-0.4, 0.6);

    int j = 0;
    for (int i = 0; i < 100; i++) {
 		float temp = (real * real) - (imag * imag) + c.x;
 		imag = 2.0 * real * imag + c.y;
 		real = temp;
 		j = i+1;

 		vec2 x = vec2(real, imag);
 		if (dot(x, x) > 4.0) {
 			break;
 		}
    }
    if (j==100) {
    	return 1.0;
    } else {
        return 0.0;
    }
}

void main() {
    vec2 p = (geom_position - center) * scale;

    float value;
    if (drawZonePlate) {
        value = zonePlate(p);
    } else {
        value = fractal(p);
    }

    fragColor = vec4(value, value, value, 1.0);
}