#version 300 es

precision highp float;

in vec2 geom_position;

uniform vec2 center;
uniform float scale;

out vec4 fragColor;

vec2 square(vec2 z) {
    return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

int julaNumIterations(vec2 p, float R, vec2 c, int N) {
    vec2 z = p;
    int n = 0;
    for (int i = 0; i < N; i++) {
 		z = square(z) + c;
 		n = n+1;
 		if (dot(z, z) >= R*R) {
 			break;
 		}
    }
    return n;
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
    vec2 c = vec2(-0.4, 0.6);
    float R = 2.0;
    int N = 100;

    int n = julaNumIterations(p, R, c, N);
    vec3 color = scalarToColor(float(n) / float(N));
    fragColor = vec4(linearToSrgb(color), 1.0);
}