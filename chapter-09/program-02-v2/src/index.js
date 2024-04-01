const $ = require('jquery');
import { createGlslProgram } from './program';

async function loadText(url) {
    let fetchResult = await fetch(url);
    return fetchResult.text();
}

async function createProgram(gl) {
    let vertexShaderSource = await loadText("vertex-shader.vert");
    let fragmentShaderSource = await loadText("fragment-shader.frag");    
    return createGlslProgram(gl, vertexShaderSource, fragmentShaderSource);
}

function updateWebGL(gl, program, vertexBuffer) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // *******************************
    // * Drawing triangle primitives *
    // *******************************
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
    // Step 7: Draw.
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // Step 8: Unuse the program.
    gl.useProgram(null);

    window.requestAnimationFrame(() => updateWebGL(gl, program, vertexBuffer));
}

let canvas = $("#webglCanvas");
let gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
 
    // **************************
    // * Creating vertex buffer *
    // **************************
    // Step 1: Create a typed array containing the data.
    let vertexData = new Float32Array([
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0
    ]);
    // Step 2: Create a buffer object.
    let vertexBuffer = gl.createBuffer();
    // Step 3: Bind the buffer to the ARRAY_BUFFER target.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Step 4: Transfer the buffer data.
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    // Step 5: Unbind the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    createProgram(gl).then(program => updateWebGL(gl, program, vertexBuffer));
}