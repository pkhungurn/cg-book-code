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
        let sliderNames = ["rSlider", "gSlider", "bSlider"];
        this.rgbSliders = sliderNames.map(name => $("#" + name).slider({
            min: 0,
            max: 255,
            value: 0
        }));
        this.rgbSliders[0].slider("value", 255);
        this.rgbSliders[1].slider("value", 255);
        this.rgbSliders[2].slider("value", 255);

        this.amplitudeSlider = $("#amplitudeSlider").slider({
            min: 0,
            max: 1000,
            value: 800
        });
        this.periodSlider = $("#periodSlider").slider({
            min: 0,
            max: 2000,
            value: 200
        });
        this.phaseSlider = $("#phaseSlider").slider({
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
      this.numVertices = 256;

      let vertexData = [];      
      for (let i=0; i<this.numVertices; i++) {
          vertexData.push(-1.0 + 2.0*i/(this.numVertices-1));
      }      
      this.vertexBuffer = createVertexBuffer(this.gl, new Float32Array(vertexData));
      
      let indexData = [];
      for (let i=0;i<this.numVertices-1;i++) {
        indexData.push(i);
        indexData.push(i+1);
      }      
      this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));
    }

    updateWebGL() {
        let self = this;

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        let rgb = this.rgbSliders.map(s => s.slider("value") / 255);
        let amplitude = this.amplitudeSlider.slider("value") / 1000.0;
        let period = this.periodSlider.slider("value") / 1000.0;
        let phase =this.phaseSlider.slider("value") / 1000.0 * 2 * Math.PI;

        
        useProgram(this.gl, this.program, () => {
            // ******************
            // * Using uniforms *
            // ******************
            // Step 1: Get its location.
            let colorLocation = gl.getUniformLocation(this.program, "color");
            // Step 2: Set its value using the right function.
            gl.uniform3f(colorLocation, rgb[0], rgb[1], rgb[2]);

            let amplitudeLocation = gl.getUniformLocation(this.program, "amplitude");
            gl.uniform1f(amplitudeLocation, amplitude);

            let periodLocation = gl.getUniformLocation(this.program, "period");
            gl.uniform1f(periodLocation, period);

            let phaseLocation = gl.getUniformLocation(this.program, "phase");
            gl.uniform1f(phaseLocation, phase);

            setupVertexAttribute(self.gl, this.program, "t", self.vertexBuffer, 1, 4, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.LINES, (self.numVertices-1)*2, 0);            
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