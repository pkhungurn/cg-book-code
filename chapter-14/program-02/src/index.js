const $ = require('jquery');
require("jquery-ui/ui/widgets/slider");
require('jquery-ui/themes/base/core.css');
require('jquery-ui/themes/base/slider.css');
require('jquery-ui/themes/base/theme.css');

import { GlProgram } from './program.js';
import { createVertexBuffer, createIndexBuffer } from './vertex-index-buffer.js';
import { drawElements } from './primitives.js'
import { PosColMesh, PosColMeshBuilder } from './pos-col-mesh.js';

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

    createBuffers() {
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

    getTypeName(gl, type) {        
        switch (type) {
            case gl.FLOAT:
                return "FLOAT";
            case gl.FLOAT_VEC2:
                return "FLOAT_VEC2";
            case gl.FLOAT_VEC3:
                return "FLOAT_VEC3";
            case gl.FLOAT_VEC4:
                return "FLOAT_VEC4";
            case gl.INT:
                return "INT";
            case gl.INT_VEC2:
                return "INT_VEC2";
            case gl.INT_VEC3:
                return "INT_VEC3";
            case gl.INT_VEC4:
                return "INT_VEC4";
            case gl.BOOL:
                return "BOOL";
            case gl.BOOL_VEC2:
                return "BOOL_VEC2";
            case gl.BOOL_VEC3:
                return "BOOL_VEC3";
            case gl.BOOL_VEC4:
                return "BOOL_VEC4";
            case gl.FLOAT_MAT2:
                return "FLOAT_MAT2";
            case gl.FLOAT_MAT3:
                return "FLOAT_MAT3";
            case gl.FLOAT_MAT4:
                return "FLOAT_MAT4";
            case gl.SAMPLER_2D:
                return "SAMPLER_2D";
            case gl.SAMPLER_CUBE:
                return "SAMPLER_CUBE";
            case gl.UNSIGNED_INT:
                return "UNSIGNED_INT";
            case gl.UNSIGNED_INT_VEC2:
                return "UNSIGNED_INT_VEC2";
            case gl.UNSIGNED_INT_VEC3:
                return "UNSIGNED_INT_VEC3";
            case gl.UNSIGNED_INT_VEC4:
                return "UNSIGNED_INT_VEC4";
            case gl.FLOAT_MAT2x3:
                return "FLOAT_MAT2x3";
            case gl.FLOAT_MAT2x4:
                return "FLOAT_MAT2x4";
            case gl.FLOAT_MAT3x2:
                return "FLOAT_MAT3x2";
            case gl.FLOAT_MAT3x4:
                return "FLOAT_MAT3x4";
            case gl.FLOAT_MAT4x2:
                return "FLOAT_MAT4x2";
            case gl.FLOAT_MAT4x3:
                return "FLOAT_MAT4x3";
            case gl.SAMPLER_3D:
                return "SAMPLER_3D";
            case gl.SAMPLER_2D_SHADOW:
                return "SAMPLER_2D_SHADOW";
            case gl.SAMPLER_2D_ARRAY:
                return "SAMPLER_2D_ARRAY";
            case gl.SAMPLER_2D_ARRAY_SHADOW:
                return "SAMPLER_2D_ARRAY_SHADOW";
            case gl.SAMPLER_CUBE_SHADOW:
                return "SAMPLER_CUBE_SHADOW";
            case gl.INT_SAMPLER_2D:
                return "INT_SAMPLER_2D";
            case gl.INT_SAMPLER_3D:
                return "INT_SAMPLER_3D";
            case gl.INT_SAMPLER_CUBE:
                return "INT_SAMPLER_CUBE";
            case gl.INT_SAMPLER_2D_ARRAY:
                return "INT_SAMPLER_2D_ARRAY";
            case gl.UNSIGNED_INT_SAMPLER_2D:
                return "UNSIGNED_INT_SAMPLER_2D";
            case gl.UNSIGNED_INT_SAMPLER_3D:
                return "UNSIGNED_INT_SAMPLER_3D";
            case gl.UNSIGNED_INT_SAMPLER_CUBE:
                return "UNSIGNED_INT_SAMPLER_CUBE";
            case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
                return "UNSIGNED_INT_SAMPLER_2D_ARRAY";                
            default:
                return "Unknown";
        }
    }

    displayProgramInfo() {
        let attributesDivHtml = `
            <table border='1' cellpadding='5'>
                <tr>
                    <td><b>Name</b></td>
                    <td><b>Size</b></td>
                    <td><b>Type</b></td>
        `;
        for (let name of this.program.attributes.keys()) {
            
            let attribute = this.program.attributes.get(name);
            attributesDivHtml += "<tr>";
            attributesDivHtml += `<td>${name}</td>`;
            attributesDivHtml += `<td>${attribute.size}</td>`;
            attributesDivHtml += `<td>${this.getTypeName(gl, attribute.type)}</td>`;
            attributesDivHtml += "</tr>";
        }
        attributesDivHtml += "</table>"
        $("#attributesDiv").html(attributesDivHtml);

        let uniformDivHtml = `
            <table border='1' cellpadding='5'>
                <tr>
                    <td><b>Name</b></td>
                    <td><b>Size</b></td>
                    <td><b>Type</b></td>
        `;
        for (let name of this.program.uniforms.keys()) {
            let uniform = this.program.uniforms.get(name);
            uniformDivHtml += "<tr>";
            uniformDivHtml += `<td>${name}</td>`;
            uniformDivHtml += `<td>${uniform.size}</td>`;
            uniformDivHtml += `<td>${this.getTypeName(gl, uniform.type)}</td>`;
            uniformDivHtml += "</tr>";
        }
        uniformDivHtml += "</table>"
        $("#uniformsDiv").html(uniformDivHtml);
    }

    async run() {
        let self = this;
        this.createUi();
        await this.createProgram();
        this.createBuffers();
        window.requestAnimationFrame(() => self.updateWebGL());
        this.displayProgramInfo();
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