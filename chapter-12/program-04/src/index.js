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

class Ball {
    constructor(displacement, radius, velocity, color) {
        this.displacement = displacement;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
    }

    update(delta) {
        this.displacement[0] += this.velocity[0] * delta;
        this.displacement[1] += this.velocity[1] * delta;
        
        if (this.displacement[0] > 1.0 - this.radius) {
            this.displacement[0] = 1.0 - this.radius;
            this.velocity[0] *= -1.0;
        }
        if (this.displacement[0] < -1.0 + this.radius) {
            this.displacement[0] = -1.0 + this.radius;
            this.velocity[0] *= -1.0;
        }
        if (this.displacement[1] > 1.0 - this.radius) {
            this.displacement[1] = 1.0 - this.radius;
            this.velocity[1] *= -1.0;
        }
        if (this.displacement[1] < -1.0 + this.radius) {
            this.displacement[1] = -1.0 + this.radius;
            this.velocity[1] *= -1.0
        }
    }
}

class WebGLApp {
    constructor(gl) {
        this.gl = gl;
        this.lastTime = performance.now();
        this.elaspedTime = 0.0;
        
        this.numSlices = 128;

        this.balls = [];
        for (let i = 0; i < 16; i++) {
            let radius = 0.01 + (0.09) * Math.random();

            let displacement = [
                -1.0 + radius + (2.0 - 2 * radius) * Math.random(), 
                -1.0 + radius + (2.0 - 2 * radius) * Math.random()
            ];
            
            let angle = 2 * Math.PI * Math.random();
            let velocity = [
                Math.cos(angle) * 0.001,
                Math.sin(angle) * 0.001
            ];

            let color = [
                0.5 + 0.5 * Math.random(),
                0.5 + 0.5 * Math.random(),
                0.5 + 0.5 * Math.random()
            ];

            let ball = new Ball(displacement, radius, velocity, color);

            this.balls.push(ball);
        }
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

        for (let i=0; i < this.balls.length; i++) {
            this.balls[i].update(delta);
        }
        
        useProgram(this.gl, this.program, () => {
            for (let i=0; i < this.balls.length; i++) {
                let ball = this.balls[i];

                let ballDisplacementLocation = self.gl.getUniformLocation(self.program, "ball.displacement");
                self.gl.uniform2fv(ballDisplacementLocation, ball.displacement);

                let ballRadiusLocation = self.gl.getUniformLocation(self.program, "ball.radius");
                self.gl.uniform1f(ballRadiusLocation, ball.radius);

                let ballColorLocation = self.gl.getUniformLocation(self.program, "ball.color");
                self.gl.uniform3fv(ballColorLocation, ball.color);
                
                setupVertexAttribute(self.gl, self.program, "position", self.vertexBuffer, 2, 8, 0);
                drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, 3*this.numSlices, 0);
            }
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