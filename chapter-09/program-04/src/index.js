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
        
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        console.log("aaa", this.gl);
        console.log("bbb", self.program);
        useProgram(this.gl, this.program, () => {
            console.log(self.program);
            setupVertexAttribute(self.gl, self.program, "position", self.vertexBuffer, 3, 3*4, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, 6, 0);            
        });
        
        window.requestAnimationFrame(() => self.updateWebGL());
    }

    async run() {
        await this.createProgram();
        this.createBuffers();
        let self = this;
        console.log("run", this.program);
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

