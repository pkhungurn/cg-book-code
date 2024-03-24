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

function createVertexBuffer(gl) {
    // Step 1: Create an array containing the data.
    let vertexData = [
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0
    ];
    // Step 2: Create a Float32Array from the data.
    let vertexArray = new Float32Array(vertexData);
    // Step 3: Create a buffer object.
    let vertexBuffer = gl.createBuffer();
    // Step 4: Bind the buffer to the ARRAY_BUFFER target.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Step 5: Transfer the buffer data.
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    // Step 6: Unbind the buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vertexBuffer;
}

function createIndexBuffer(gl) {
    // Step 1: Create an array containing the data.
    let indexData = [
        0, 2, 3, 0, 1, 2,
    ]
    // Step 2: Create a Uint32Array (or Uint16Array) from the data.
    let indexArray = new Uint32Array(indexData);
    // Step 3: Create a buffer object.
    let indexBuffer = gl.createBuffer();
    // Step 4: Bind the buffer to the ELEMENT_ARRAY_BUFFER target.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // Step 5: Transfer the buffer data.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);
    // Step 6: Unbind the buffer.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return indexBuffer;
}

function updateWebGL(gl, program, vertexBuffer, indexBuffer) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ********************************
    // * Drawing triangles primitives *
    // ********************************
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
    let vertexBuffer = createVertexBuffer(gl);    
    let indexBuffer = createIndexBuffer(gl);
    createProgram(gl).then(program => updateWebGL(gl, program, vertexBuffer, indexBuffer));
}