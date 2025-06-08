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
        let self = this;

        this.htmlCanvas = $("#htmlCanvas");

        this.redSlider = $("#redSlider").slider({
            min: 0,
            max: 255,
            value: 0,
        });
        this.greenSlider = $("#greenSlider").slider({
            min: 0,
            max: 255,
            value: 0
        });
        this.blueSlider = $("#blueSlider").slider({
            min: 0,
            max: 255,
            value: 0
        });
        

        this.redSlider.on( "slide", function( event, ui ) {
            $("#redValueCell").html(ui.value.toString() + "/ 255");
            self.updateHtmlCanvasBackgroundColor(
                ui.value,
                self.greenSlider.slider("value"),
                self.blueSlider.slider("value")
            );
        });
        this.greenSlider.on( "slide", function( event, ui ) {
            $("#greenValueCell").html(ui.value.toString() + "/ 255");
            self.updateHtmlCanvasBackgroundColor(
                self.redSlider.slider("value"),
                ui.value,
                self.blueSlider.slider("value")
            );
        });
        this.blueSlider.on( "slide", function( event, ui ) {
            $("#blueValueCell").html(ui.value.toString() + "/ 255");
            self.updateHtmlCanvasBackgroundColor(
                self.redSlider.slider("value"),
                self.greenSlider.slider("value"),
                ui.value
            );
        });
    }

    updateHtmlCanvasBackgroundColor(r, g, b) {
        let rgbString = 'rgb(' + r.toString() + "," + g.toString() + "," + b.toString();
        this.htmlCanvas.css('background-color', rgbString);
    }


    async createProgram() {
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");    
        this.program = createGlslProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    createBuffers() {
        let vertexData = [
            -1.0, -1.0,       
             1.0, -1.0,       
             1.0,  1.0,       
            -1.0,  1.0
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

        let r = this.redSlider.slider("value") / 255.0;
        let g = this.greenSlider.slider("value") / 255.0;
        let b = this.blueSlider.slider("value") / 255.0

        let useLinearColorSpace = $('input[name=colorSpace]:checked').val() === 'linear';


        useProgram(this.gl, this.program, () => {
            let colorLocation = self.gl.getUniformLocation(self.program, "color");
            self.gl.uniform3f(colorLocation, r, g, b);

            let useLinearColorSpaceLocation = self.gl.getUniformLocation(self.program, "useLinearColorSpace");
            self.gl.uniform1i(useLinearColorSpaceLocation, useLinearColorSpace);
            
            setupVertexAttribute(self.gl, self.program, "vert_position", self.vertexBuffer, 2, 8, 0);
            drawElements(self.gl, self.indexBuffer, self.gl.TRIANGLES, 6, 0);
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