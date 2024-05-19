const $ = require('jquery');
import { createGlslProgram } from './program';
import { createVertexBuffer } from './vertex-buffer';
import { createIndexBuffer } from './index-buffer';

async function loadText(url) {
    let fetchResult = await fetch(url);
    return fetchResult.text();
}

async function createProgram(gl) {
    let vertexShaderSource = await loadText("vertex-shader.vert");
    let fragmentShaderSource = await loadText("fragment-shader.frag");    
    return createGlslProgram(gl, vertexShaderSource, fragmentShaderSource);
}

function updateWebGL(gl, program, vertexBuffer, indexBuffer) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // *****************************************************
    // * Drawing triangle primitives using an index buffer *
    // *****************************************************
    // Step 1: Use the program.
    gl.useProgram(program);
    // Step 2: Get location of the attribute we want to assign with the data from the vertex buffer.
    let positionLocation = gl.getAttribLocation(program, "position");
    // Step 3: Enable the attribute.
    gl.enableVertexAttribArray(positionLocation);
    // Step 4: Bind the buffer we want to use.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Step 5: Assign the attribute to the bound buffer.
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 3 * 4, 0);
    // Step 6: Unbind the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Step 7: Bind the index buffer.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // Step 8: Draw with drawElements.
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    // Step 9: Unbind the indexbuffer.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Step 10: Unuse the program.
    gl.useProgram(null);

    window.requestAnimationFrame(() => updateWebGL(gl, program, vertexBuffer, indexBuffer));
}

let canvas = $("#webglCanvas");
let gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {

    // **************************
    // * Creating vertex buffer *
    // **************************    
    let vertexData = new Float32Array([
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0
    ]);
    let vertexBuffer = createVertexBuffer(gl, vertexData);

    // *************************
    // * Creating index buffer *
    // *************************    
    let indexData = new Int32Array([
        0, 1, 2,
        0, 2, 3
    ]);
    let indexBuffer = createIndexBuffer(gl, indexData);

    createProgram(gl).then(program => updateWebGL(gl, program, vertexBuffer, indexBuffer));
}