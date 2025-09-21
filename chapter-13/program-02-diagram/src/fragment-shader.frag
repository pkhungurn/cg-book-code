#version 300 es

precision highp float;

in vec3 geom_color;

out vec4 fragColor;

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
    fragColor = vec4(linearToSrgb(geom_color), 1.0);
}