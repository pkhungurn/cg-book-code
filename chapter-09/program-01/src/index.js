const $ = require('jquery');

async function loadText(url) {
    let fetchResult = await fetch(url);
    return fetchResult.text();
}

function createShader(gl, shaderType, shaderSource) {
    // Step 1: Create the shader.
    let shader = gl.createShader(shaderType);

    // Step 2: Set the shader source.
    gl.shaderSource(shader, shaderSource);

    // Step 3: Compile the shader.
    gl.compileShader(shader);

    // Step 4: Check for errors.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let infoLog = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("An error occurred compiling the shader: " + infoLog);
    } else {
        return shader;
    }
}

function createGlslProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // Step 1: Create a program object.
    let program = gl.createProgram();

    // Step 2: Create an attach the shaders.
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    gl.attachShader(program, vertexShader);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    gl.attachShader(program, fragmentShader);

    // Step 3: Link the program.
    gl.linkProgram(program);

    // Step 4: Validate the program.
    gl.validateProgram(program);

    // Step 4: Check for errors.
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let infoLog = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("An error occurred linking the program: " + infoLog);
    } else {
        return program;
    }
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

let canvas = $("#webglCanvas");
gl = canvas[0].getContext("webgl2");
if (!gl) {
    alert("Cannot get WebGL 2 context!");
} else {
    createPrograms(gl).then(programs => {
        window.requestAnimationFrame(() => updateWebGL(gl, programs));
    });    
}