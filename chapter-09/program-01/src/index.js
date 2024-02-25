const $ = require('jquery');
import { createGlslProgram } from './program';

async function loadText(url) {
    let fetchResult = await fetch(url);
    return fetchResult.text();
}

async function createPrograms(gl) {
    let vertexShaderSource = await loadText("vertex-shader.vert");
    let fragmentShader0Source = await loadText("fragment-shader-0.frag");
    let fragmentShader1Source = await loadText("fragment-shader-1.frag");

    let program0 = createGlslProgram(gl, vertexShaderSource, fragmentShader0Source);
    program0.name = "program0";

    let program1 = createGlslProgram(gl, vertexShaderSource, fragmentShader1Source);
    program1.name = "program1";

    lastProgram = program0;

    return [program0, program1];
}

let lastProgram = null;

function reportCurrentProgram(gl) {
    // Get the program being used.
    let currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
    if (currentProgram != lastProgram) {
        if (!currentProgram) {
            alert("Currently not using any program.");
        } else {
            alert("Program changed to \"" + currentProgram.name + "\".");
        }

    }
    lastProgram = currentProgram;
}
 
function updateWebGL(gl, programs) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use the program.
    let programName = $("#programName").val();
    if (programName == "program0") {
        gl.useProgram(programs[0]);
    } else if (programName == "program1") {
        gl.useProgram(programs[1]);
    } else {
        gl.useProgram(null)
    }
    reportCurrentProgram(gl);

    window.requestAnimationFrame(() => updateWebGL(gl, programs));
}

let canvas = $("#webglCanvas");
let gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
    createPrograms(gl).then(programs => {
        window.requestAnimationFrame(() => updateWebGL(gl, programs));
    });    
}