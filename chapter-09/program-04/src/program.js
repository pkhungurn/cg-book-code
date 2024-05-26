import { bindBuffer } from "./vertex-index-buffer.js";

export function createShader(gl, shaderType, sourceCode) {
    // Step 1: Create the shader.
    let shader = gl.createShader(shaderType);

    // Step 2: Set the shader source.
    gl.shaderSource(shader, sourceCode);

    // Step 3: Compile the shader.
    gl.compileShader(shader);

    // Step 4: Check for errors.
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    // Step 5: Clean up if there are errors.
    let infoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("An error occurred compiling the shader: " + infoLog);
}

export function createGlslProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // Step 1: Create a program object.
    let program = gl.createProgram();

    // Step 2: Create an attach the shaders.
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    gl.attachShader(program, vertexShader);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, fragmentShader);

    // Step 3: Link the program.
    gl.linkProgram(program);

    // Step 4: Validate the program.
    gl.validateProgram(program);

    // Step 5: Check for errors.
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {        
        return program;
    }

    // Step 6: Clean up if there are errors.
    let infoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShaer(fragmentShader);
    throw new Error("An error occurred linking the program: " + infoLog);
}

export function useProgram(gl, program, code) {
    gl.useProgram(program);
    code();
    gl.useProgram(null);
}

export function setupVertexAttribute(gl, program, attributeName, buffer, size, stride, offset, type=null) {
    type = type || gl.FLOAT;
    console.log(program);       
    let attributeLocation = gl.getAttribLocation(program, attributeName);    
    gl.enableVertexAttribArray(attributeLocation);
    bindBuffer(gl, gl.ARRAY_BUFFER, buffer, () => {
        gl.vertexAttribPointer(attributeLocation, size, type, false, stride, offset);
    });
}