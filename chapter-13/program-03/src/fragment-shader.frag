#version 300 es

precision highp float;

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

in vec2 geom_position;

out vec4 fragColor;

void main() {
    vec3 color = vec3((geom_position + 0.5) + 0.5, 0.0);
    fragColor = vec4(linearToSrgb(color), 1.0);
}