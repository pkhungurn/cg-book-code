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

    async createProgram() {
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");    
        this.program = createGlslProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    createBuffers() {
        let vertexData = [
            -0.5, -0.5,       // First vertex
             1.0,  0.0, 0.0,  // is red.
             0.5, -0.5,       // Second vertex
             0.0,  1.0, 0.0,  // is green.
             0.5,  0.5,       // Third vertex
             0.0,  0.0, 1.0,  // is blue.
            -0.5,  0.5,       // Fourth vertex
             1.0,  1.0, 1.0   // is white.
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

        useProgram(this.gl, this.program, () => {
            setupVertexAttribute(self.gl, self.program, "vert_position", self.vertexBuffer, 2, 4*5, 0);
            setupVertexAttribute(self.gl, self.program, "vert_color", self.vertexBuffer, 3, 4*5, 4*2)
            drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, 6, 0);
        });
        
        window.requestAnimationFrame(() => self.updateWebGL());
    }

    async run() {
        let self = this;
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