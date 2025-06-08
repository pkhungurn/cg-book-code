const $ = require('jquery');
require("jquery-ui/ui/widgets/slider");
require('jquery-ui/themes/base/core.css');
require('jquery-ui/themes/base/slider.css');
require('jquery-ui/themes/base/theme.css');

import { createGlslProgram, useProgram, setupVertexAttribute } from './program.js';
import { createVertexBuffer, createIndexBuffer } from './vertex-index-buffer.js';
import { drawElements } from './primitives.js'

async function loadText(url) {
    let fetchResult = await fetch(url);
    return fetchResult.text();
}


class WebGLApp {
    constructor(gl) {
        this.gl = gl;
    }

    createUi() {
        this.centerXSlider = $("#centerXSlider").slider({
            min: -1000,
            max: 1000,
            value: 0
        });
        this.centerYSlider = $("#centerYSlider").slider({
            min: -1000,
            max: 1000,
            value: 0
        });
        this.scaleSlider = $("#scaleSlider").slider({
            min: -1000,
            max: 1000,
            value: 0
        });
    }


    async createProgram() {
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");    
        this.program = createGlslProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    createBuffers() {
        let vertexData = [
            -1.0, -1.0,       
             1.0, -1.0,       
             1.0,  1.0,       
            -1.0,  1.0
        ];
        this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));

        let indexData = [
            0, 1, 2,
            0, 2, 3
        ];
        this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));
    }

    updateWebGL() {
        let self = this;

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        let centerX = this.centerXSlider.slider("value") / 1000.0;
        let centerY = this.centerYSlider.slider("value") / 1000.0;
        let scale = Math.pow(2, this.scaleSlider.slider("value") / 100.0);

        let drawZonePlate = $('input[name=func]:checked').val() === 'zonePlate';


        useProgram(this.gl, this.program, () => {
            let centerLocation = self.gl.getUniformLocation(self.program, "center");
            self.gl.uniform2f(centerLocation, centerX, centerY);

            let scaleLocation = self.gl.getUniformLocation(self.program, "scale");
            self.gl.uniform1f(scaleLocation, scale);

            let drawZonePlateLocation = self.gl.getUniformLocation(self.program, "drawZonePlate");
            self.gl.uniform1i(drawZonePlateLocation, drawZonePlate);
            
            setupVertexAttribute(self.gl, self.program, "vert_position", self.vertexBuffer, 2, 8, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, 6, 0);
        });
        
        window.requestAnimationFrame(() => self.updateWebGL());
    }

    async run() {
        let self = this;
        this.createUi();
        await this.createProgram();
        this.createBuffers();
        window.requestAnimationFrame(() => self.updateWebGL());
    }
}

let canvas = $("#webglCanvas");
let gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
    let app = new WebGLApp(gl);
    await app.run();
}