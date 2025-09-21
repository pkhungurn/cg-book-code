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
        let vertexData = [];
        let indexData = [];

        this.fragCount = 0;
        for (let i=0;i<16;i++) {
            for (let j=0;j<16;j++) {
                let x = -0.5 + (j + 0.5) / 16;
                let y = -0.5 + (i + 0.5) / 16;
                if (x > y) {
                    let alpha = 0.5 - x;
                    let beta = (1 - alpha) * (0.5 - y);
                    let gamma = (1 - alpha) * (0.5 + y);

                    let r = 1.0 * alpha + 0.0 * beta + 1.0 * gamma;
                    let g = 1.0 * alpha + 1.0 * beta + 0.0 * gamma;
                    let b = 0.0 * alpha + 1.0 * beta + 1.0 * gamma;

                    vertexData.push(x - 0.5/16, y - 0.5/16, r, g, b);
                    vertexData.push(x + 0.5/16, y - 0.5/16, r, g, b);
                    vertexData.push(x + 0.5/16, y + 0.5/16, r, g, b);
                    vertexData.push(x - 0.5/16, y + 0.5/16, r, g, b);

                    indexData.push(4 * this.fragCount + 0, 4 * this.fragCount + 1, 4 * this.fragCount + 2);
                    indexData.push(4 * this.fragCount + 0, 4 * this.fragCount + 2, 4 * this.fragCount + 3);

                    this.fragCount += 1;
                } else {
                    let beta = 0.5 + x;
                    let gamma = (1-beta) * (0.5 + y);
                    let alpha = (1-beta) * (0.5 - y);

                    let r = 1.0 * alpha + 1.0 * beta + 1.0 * gamma;
                    let g = 1.0 * alpha + 0.0 * beta + 1.0 * gamma;
                    let b = 0.0 * alpha + 1.0 * beta + 1.0 * gamma;

                    vertexData.push(x - 0.5/16, y - 0.5/16, r, g, b);
                    vertexData.push(x + 0.5/16, y - 0.5/16, r, g, b);
                    vertexData.push(x + 0.5/16, y + 0.5/16, r, g, b);
                    vertexData.push(x - 0.5/16, y + 0.5/16, r, g, b);

                    indexData.push(4 * this.fragCount + 0, 4 * this.fragCount + 1, 4 * this.fragCount + 2);
                    indexData.push(4 * this.fragCount + 0, 4 * this.fragCount + 2, 4 * this.fragCount + 3);

                    this.fragCount += 1;
                }
            }
        }

        this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));
        this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));
    }

    updateWebGL() {
        let self = this;

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        useProgram(this.gl, this.program, () => {
            setupVertexAttribute(self.gl, self.program, "vert_position", self.vertexBuffer, 2, 4*5, 0);
            setupVertexAttribute(self.gl, self.program, "vert_color", self.vertexBuffer, 3, 4*5, 4*2)
            drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, this.fragCount * 6, 0);
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