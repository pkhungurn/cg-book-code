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
        this.lastTime = performance.now();
        this.elaspedTime = 0.0;        
    }

    async createProgram() {
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");    
        this.program = createGlslProgram(this.gl, vertexShaderSource, fragmentShaderSource);        
    }

    createBuffers() {
      let vertexData = [
        -0.1, -0.1,
         0.1, -0.1,
         0.1,  0.1,
        -0.1,  0.1
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

        let currentTime = performance.now();
        let delta = currentTime - this.lastTime;   
        this.elaspedTime += delta;
        this.lastTime = currentTime;

        let angularPosition = 0.001 * this.elaspedTime;
        
        let displacementX = 0.5 * Math.cos(angularPosition);
        let displacementY = 0.5 * Math.sin(angularPosition);

        useProgram(this.gl, this.program, () => {
            let displacementLocation = self.gl.getUniformLocation(self.program, "displacement");
            self.gl.uniform2f(displacementLocation, displacementX, displacementY);
            
            setupVertexAttribute(self.gl, self.program, "vert_position", self.vertexBuffer, 2, 8, 0);
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