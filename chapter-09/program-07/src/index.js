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
        let vertexData = new Float32Array([
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0
        ]);
        this.vertexBuffer = createVertexBuffer(this.gl, vertexData);

        let indexData = new Int32Array([
            0, 1, 2,
            0, 2, 3
        ]);
        this.indexBuffer = createIndexBuffer(this.gl, indexData);
    }

    updateWebGL() {
        let self = this;

        if ($("#scissorTestCheckbox").is(":checked")) {
            this.gl.enable(this.gl.SCISSOR_TEST);
            this.gl.scissor(0, 0, 256, 256);
        } else {
            this.gl.disable(this.gl.SCISSOR_TEST);
        }
        
        this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if ($("#viewportCheckbox").is(":checked")) {
            this.gl.viewport(0, 0, 256, 256);
        } else {
            this.gl.viewport(0, 0, 512, 512);
        }

        useProgram(this.gl, this.program, () => {
            setupVertexAttribute(self.gl, self.program, "position", self.vertexBuffer, 3, 3*4, 0);
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

