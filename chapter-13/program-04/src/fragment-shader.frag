#version 300 es

precision highp float;

in vec2 geom_position;

uniform vec2 center;
uniform float scale;

out vec4 fragColor;

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
    return float(j) / 100.0;
}

vec3 scalarToColor(float x) {
    if (x < 1.0 / 6.0) {
        float alpha = x * 6.0;
        return (1.0 - alpha) * vec3(1.0, 0.0, 0.0) + alpha * vec3(1.0, 1.0, 0.0);
    } else if (x < 2.0 / 6.0) {
        float alpha = (x - 1.0 / 6.0) * 6.0;
        return (1.0 - alpha) * vec3(1.0, 1.0, 0.0) + alpha * vec3(0.0, 1.0, 0.0);
    } else if (x < 3.0 / 6.0) {
        float alpha = (x - 2.0 / 6.0) * 6.0;
        return (1.0 - alpha) * vec3(0.0, 1.0, 0.0) + alpha * vec3(0.0, 1.0, 1.0);
    } else if (x < 4.0 / 6.0) {
        float alpha = (x - 3.0 / 6.0) * 6.0;
        return (1.0 - alpha) * vec3(0.0, 1.0, 1.0) + alpha * vec3(0.0, 0.0, 1.0);
    } else if (x < 5.0 / 6.0) {
        float alpha = (x - 4.0 / 6.0) * 6.0;
        return (1.0 - alpha) * vec3(0.0, 0.0, 1.0) + alpha * vec3(1.0, 0.0, 0.5);
    } else {
        float alpha = (x - 5.0 / 6.0) * 6.0;
        return (1.0 - alpha) * vec3(1.0, 0.0, 0.5) + alpha * vec3(1.0, 0.0, 1.0);
    }
}

float linearToSrgbSingle(float c) {
    float a = 0.055;
    if (c <= 0.0)
        return 0.0;
    else if (c < 0.0031308) {
        return 12.92*c;
    } else {
        if (c >= 1.0)
            return 1.0;
        else
            return (1.0+a)*pow(c, 1.0/2.4)-a;
    }
}

vec3 linearToSrgb(vec3 color) {
    return vec3(linearToSrgbSingle(color.r), linearToSrgbSingle(color.g), linearToSrgbSingle(color.b));
}

void main() {
    vec2 p = (geom_position - center) * scale;

    float value = fractal(p);
    vec3 color = scalarToColor(value);
    fragColor = vec4(linearToSrgb(color), 1.0);
}