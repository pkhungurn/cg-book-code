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

    createMeshes() {
        this.meshes = [this.createHouseMesh()];
        for (let numSpikes=3;numSpikes<=12;numSpikes++) {
            this.meshes.push(this.createStarMesh(numSpikes));
        }        
    }

    createHouseMesh() {
        let meshBuilder = new PosColMeshBuilder(this.gl);

        meshBuilder.setPrimitiveType(this.gl.LINES);
        
        // Main body
        meshBuilder
            .setColor(1.0, 1.0, 1.0, 1.0)
            .addVertex(-0.5, -0.75, 0.0)   // #0
            .addVertex(0.5, -0.75, 0.0)    // #1
            .addVertex(0.5, 0.20, 0.0)     // #2
            .addVertex(-0.5, 0.20, 0.0)    // #3
            .addIndices(0, 1)
            .addIndices(1, 2)
            .addIndices(2, 3)
            .addIndices(3, 0);

        // Roof
        meshBuilder
            .setColor(1.0, 0.0, 0.0)
            .addVertex(-0.75, 0.25, 0.0)  // #4
            .addVertex(0.75, 0.25, 0.0)   // #5
            .addVertex(0.0, 0.75, 0.0)    // #6
            .addIndices(4, 5)
            .addIndices(5, 6)
            .addIndices(6, 4);

        // Door
        meshBuilder
            .setColor(0.0, 1.0, 0.0)
            .addVertex(-0.15, -0.7, 0.0)   // #7
            .addVertex(0.15, -0.7, 0.0)    // #8
            .addVertex(0.15, -0.25, 0.0)   // #9
            .addVertex(-0.15, -0.25, 0.0)  // #10
            .addIndices(7, 8)
            .addIndices(8, 9)
            .addIndices(9, 10)
            .addIndices(10, 7);

        // Windows
        meshBuilder
            .setColor(0.0, 1.0, 1.0)
            .addVertex(-0.45, -0.15, 0.0)   // #11
            .addVertex(-0.2, -0.15, 0.0)    // #12
            .addVertex(-0.2, 0.10, 0.0)    // #13
            .addVertex(-0.45, 0.10, 0.0)    // #14
            .addIndices(11, 12)
            .addIndices(12, 13)
            .addIndices(13, 14)
            .addIndices(14, 11) 
            .addVertex(0.2, -0.15, 0.0)   // #15
            .addVertex(0.45, -0.15, 0.0)    // #16
            .addVertex(0.45, 0.10, 0.0)    // #17
            .addVertex(0.2, 0.10, 0.0)    // #18
            .addIndices(15, 16)
            .addIndices(16, 17)
            .addIndices(17, 18)
            .addIndices(18, 15);

        return meshBuilder.build();
    }

    interpolate(c0, c1, alpha) {
        return [
            c0[0] * (1.0-alpha) + c1[1] * alpha,
            c0[1] * (1.0-alpha) + c1[1] * alpha,
            c0[2] * (1.0-alpha) + c1[2] * alpha, 
            1.0
        ];
    }

    getColorFromAngle(angle) {
        angle = angle % 360;
        if (angle < 0) {
            angle += 360;
        }
        if (angle >= 0 && angle < 60) {
            return this.interpolate([1.0, 0.0, 0.0], [1.0, 0.0, 1.0], angle / 60);
        } else if (angle >= 60 && angle < 120) {
            return this.interpolate([1.0, 0.0, 1.0], [0.0, 0.0, 1.0], (angle - 60) / 60);
        } else if (angle >= 120 && angle < 180) {
            return this.interpolate([0.0, 0.0, 1.0], [0.0, 1.0, 1.0], (angle - 120) / 60);
        } else if (angle >= 180 && angle < 240) {
            return this.interpolate([0.0, 1.0, 1.0], [0.0, 1.0, 0.0], (angle - 180) / 60);
        } else if (angle >= 240 && angle < 300) {
            return this.interpolate([0.0, 1.0, 0.0], [1.0, 1.0, 0.0], (angle - 240) / 60);
        } else {
            return this.interpolate([1.0, 1.0, 0.0], [1.0, 0.0, 0.0], (angle - 300) / 60);
        }
    }

    createStarMesh(numSpikes) {
        let meshBuilder = new PosColMeshBuilder(this.gl);
        let majorRadius = 0.75;
        let minorRadius = 0.25;

        meshBuilder
            .setColor(1.0, 1.0, 1.0, 1.0)
            .addVertex(0.0, 0.0, 0.0);

        for (let spikeIndex = 0; spikeIndex < numSpikes; spikeIndex++) {
            let angle0 = (2*spikeIndex) * 360 / (2 * numSpikes);
            let color0 = this.getColorFromAngle(angle0);
            let position0 = [
                Math.cos(angle0 * Math.PI / 180.0) * majorRadius,
                Math.sin(angle0 * Math.PI / 180.0) * majorRadius,
                0.0,
            ];
            meshBuilder.setColor(...color0).addVertex(...position0);

            let angle1 = (2*spikeIndex + 1) * 360 / (2 * numSpikes);
            let color1 = this.getColorFromAngle(angle1);
            let position1 = [
                Math.cos(angle1 * Math.PI / 180.0) * minorRadius,
                Math.sin(angle1 * Math.PI / 180.0) * minorRadius,
                0.0,
            ];
            meshBuilder.setColor(...color1).addVertex(...position1);

            meshBuilder.addIndices(0, 1+2*spikeIndex, 1+2*spikeIndex+1);
            meshBuilder.addIndices(0, 1+2*spikeIndex+1, 1+(2*spikeIndex+2) % (2*numSpikes));
        }

        return meshBuilder.build();
    }

    updateWebGL() {
        let self = this;

        let centerX = this.centerXSlider.slider("value") / 1000.0;
        let centerY = this.centerYSlider.slider("value") / 1000.0;
        let scale = Math.pow(2, this.scaleSlider.slider("value") / 1000.0);

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Use the program.
        let meshId = parseInt($("#meshId").val());
        
        this.program.use(() => {
            self.program.uniform("center")?.set3Float(centerX, centerY, 0.0);
            self.program.uniform("scale")?.set1Float(scale);
            self.meshes[meshId].draw(self.program);
        });   
        
        window.requestAnimationFrame(() => self.updateWebGL());
    }

    async run() {
        let self = this;
        this.createUi();
        await this.createProgram();
        this.createMeshes();
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
