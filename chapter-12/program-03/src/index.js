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
        
        this.numSlices = 128;
        this.radius = 0.1;

        let angle = 2 * Math.PI * Math.random();
        this.velocityX = Math.cos(angle) * 0.001;
        this.velocityY = Math.sin(angle) * 0.001;

        this.displacementX = 0.0;
        this.displacementY = 0.0;
    }

    async createProgram() {
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");    
        this.program = createGlslProgram(this.gl, vertexShaderSource, fragmentShaderSource);        
    }

    createBuffers() {
        let vertexData = [];
        for(let i=0; i<this.numSlices; i++) {
            let angle = 2 * Math.PI * i / this.numSlices;
            vertexData.push(Math.cos(angle), Math.sin(angle));
        }
        vertexData.push(0.0);
        vertexData.push(0.0);

        this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));

        let indexData = [];
        for(let i=0; i<this.numSlices; i++) {
            indexData.push(i);
            indexData.push((i+1) % this.numSlices);
            indexData.push(this.numSlices);
        }
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

        this.displacementX = this.displacementX + delta * this.velocityX;
        this.displacementY = this.displacementY + delta * this.velocityY;
        
        if (this.displacementX > 1.0 - this.radius) {
            this.displacementX = 1.0 - this.radius;
            this.velocityX *= -1.0;
        }
        if (this.displacementX < -1.0 + this.radius) {
            this.displacementX = -1.0 + this.radius;
            this.velocityX *= -1.0;
        }
        if (this.displacementY > 1.0 - this.radius) {
            this.displacementY = 1.0 - this.radius;
            this.velocityY *= -1.0;
        }
        if (this.displacementY < -1.0 + this.radius) {
            this.displacementY = -1.0 + this.radius;
            this.velocityY *= -1.0;
        }
        
        useProgram(this.gl, this.program, () => {
            let displacementLocation = self.gl.getUniformLocation(self.program, "displacement");
            self.gl.uniform2f(displacementLocation, this.displacementX, this.displacementY);

            let radiusLocation = self.gl.getUniformLocation(self.program, "radius");
            self.gl.uniform1f(radiusLocation, this.radius);
            
            setupVertexAttribute(self.gl, self.program, "position", self.vertexBuffer, 2, 8, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, 3*this.numSlices, 0);
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