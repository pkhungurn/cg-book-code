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
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");
        this.program = createGlslProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    createBuffers() {
        let N = 17;

        this.numVertices = N * N;
        let vertexData = [];
        for (let i = 0; i < N; i++) {
            let y = i * 1.0 / (N - 1);
            for (let j = 0; j < N; j++) {
                let x = j * 1.0 / (N - 1);
                vertexData.push(x);
                vertexData.push(y);
            }
        }
        this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));

        this.numEdges = 0;
        let indexData = [];
        for (let i = 0; i < N - 1; i++) {
            for (let j = 0; j < N - 1; j++) {
                let i00 = i * N + j;
                let i10 = i * N + (j + 1);
                let i11 = (i + 1) * N + (j + 1);
                let i01 = (i + 1) * N + j;

                indexData.push(i00);
                indexData.push(i01);

                indexData.push(i01);
                indexData.push(i11);

                indexData.push(i11);
                indexData.push(i10);

                indexData.push(i10);
                indexData.push(i00);

                this.numEdges += 4;
            }
        }
        this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));
    }

    updateWebGL() {
        let self = this;

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        useProgram(this.gl, this.program, () => {
            setupVertexAttribute(self.gl, self.program, "position", self.vertexBuffer, 2, 2 * 4, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.LINES, self.numEdges * 2, 0);
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

