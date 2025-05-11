const $ = require('jquery');
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
        let fragmentShaderSource = await loadText("fragment-shader.frag");

        let simpleVertexShaderSource = await loadText("vertex-shader-simple.vert");
        this.simpleProgram = createGlslProgram(this.gl, simpleVertexShaderSource, fragmentShaderSource);

        let fancyVertexShaderSource = await loadText("vertex-shader-fancy.vert");
        this.fancyProgram = createGlslProgram(this.gl, fancyVertexShaderSource, fragmentShaderSource);
    }

    createBuffers() {
        this.numVertices = 256;

        let vertexData = [];
        for (let i = 0; i < this.numVertices; i++) {
            vertexData.push(-1.0 + 2.0 * i / (this.numVertices - 1));
        }
        this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));

        let indexData = [];
        for (let i = 0; i < this.numVertices - 1; i++) {
            indexData.push(i);
            indexData.push(i + 1);
        }
        this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));
    }

    updateWebGL() {
        let self = this;

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        let program = null;
        if ($("#fancyVertexShaderRadio").is(":checked")) {
            program = this.fancyProgram;
        } else {
            program = this.simpleProgram;
        }

        useProgram(this.gl, program, () => {
            setupVertexAttribute(self.gl, program, "t", self.vertexBuffer, 1, 4, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.LINES, (self.numVertices - 1) * 2, 0);
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

