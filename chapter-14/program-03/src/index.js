const $ = require('jquery');
require("jquery-ui/ui/widgets/slider");
require('jquery-ui/themes/base/core.css');
require('jquery-ui/themes/base/slider.css');
require('jquery-ui/themes/base/theme.css');

import { GlProgram } from './program.js';
import { PosColMeshBuilder } from './pos-col-mesh.js';

async function loadText(url) {
    let fetchResult = await fetch(url);
    return fetchResult.text();
}

class WebGLApp {
    constructor(gl) {
        this.gl = gl;
    }

    createUi() {
        this.centerXSlider = $("#centerXSlider").slider({
            min: -1000,
            max: 1000,
            value: 0
        });
        this.centerYSlider = $("#centerYSlider").slider({
            min: -1000,
            max: 1000,
            value: 0
        });
        this.scaleSlider = $("#scaleSlider").slider({
            min: -1000,
            max: 1000,
            value: 0
        });
    }

    async createProgram() {
        let vertexShaderSource = await loadText("vertex-shader.vert");
        let fragmentShaderSource = await loadText("fragment-shader.frag");    
        this.program = new GlProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }

    createMesh() {
        let meshBuilder = new PosColMeshBuilder(this.gl);
        
        meshBuilder
            .setColor(1.0, 1.0, 0.0, 1.0)
            .addVertex(-0.5, -0.5, 0.0)
            .setColor(0.0,  1.0, 1.0, 1.0)
            .addVertex(0.5, -0.5, 0.0)
            .setColor(1.0,  0.0, 1.0, 1.0)
            .addVertex(0.5, 0.5, 0.0)
            .setColor(1.0, 1.0, 1.0, 1.0)
            .addVertex(-0.5, 0.5, 0.0);
            
        meshBuilder
            .addIndices(0, 1, 2)
            .addIndices(0, 2, 3);

        this.mesh = meshBuilder.build();
    }

    updateWebGL() {
        let self = this;

        let centerX = this.centerXSlider.slider("value") / 1000.0;
        let centerY = this.centerYSlider.slider("value") / 1000.0;
        let scale = Math.pow(2, this.scaleSlider.slider("value") / 1000.0);

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        this.program.use(() => {
            self.program.uniform("center")?.set3Float(centerX, centerY, 0.0);
            self.program.uniform("scale")?.set1Float(scale);
            self.mesh.draw(self.program);
        });   
        
        window.requestAnimationFrame(() => self.updateWebGL());
    }

    async run() {
        let self = this;
        this.createUi();
        await this.createProgram();
        this.createMesh();
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