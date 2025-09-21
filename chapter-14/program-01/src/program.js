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
    gl.deleteShader(fragmentShader);
    throw new Error("An error occurred linking the program: " + infoLog);
}

export function useProgram(gl, program, code) {
    gl.useProgram(program);
    code();
    gl.useProgram(null);
}

export function setupVertexAttribute(gl, program, attributeName, buffer, size, stride, offset, type=null) {
    type = type || gl.FLOAT;
    let attributeLocation = gl.getAttribLocation(program, attributeName);    
    gl.enableVertexAttribArray(attributeLocation);
    bindBuffer(gl, gl.ARRAY_BUFFER, buffer, () => {
        gl.vertexAttribPointer(attributeLocation, size, type, false, stride, offset);
    });
}


export class GlAttribute {
    constructor(gl, program, index) {
        this.gl = gl;
        this.program = program;
        this.index = index;

        let info = gl.getActiveAttrib(program.glObject, index);
        this.name = info.name;
        this.size = info.size;
        this.type = info.type;
        this.location = gl.getAttribLocation(program.glObject, this.name);
        this.enabled = false;
    }

    setEnabled(enabled) {
        if (enabled) {
            this.gl.enableVertexAttribArray(this.location);
            this.enabled = true;
        } else {
            this.gl.glDisableVertexAttribArray(this.location);
            this.enabled = false;
        }
    }

    setup(buffer, size, stride, offset, type=null, normalized=false) {
        this.setEnabled(true);
        type = type || this.gl.FLOAT;
        let self = this;
        bindBuffer(this.gl, this.gl.ARRAY_BUFFER, buffer, () => {
            self.gl.vertexAttribPointer(self.location, size, type, normalized, stride, offset);
        });
    }    
}

export class GlUniform {
    constructor(gl, program, index) {
        this.gl = gl;
        this.program = program;
        
        let info = gl.getActiveUniform(program.glObject, index);
        this.name = info.name;
        this.type = info.type;
        this.size = info.size;
        this.location = gl.getUniformLocation(program.glObject, this.name);
    }

    set1Int(x) {
        this.gl.uniform1i(this.location, x);
    }

    set2Int(x, y) {
        this.gl.uniform2i(this.location, x, y);
    }
    
    set3Int(x, y, z) {
        this.gl.uniform3i(this.location, x, y, z);
    }

    set4Int(x, y, z, w) {
        this.gl.uniform4i(this.location, x, y, z, w);
    }

    set1Float(x) {
        this.gl.uniform1f(this.location, x);
    }

    set2Float(x, y) {
        this.gl.uniform2f(this.location, x, y);
    }
    
    set3Float(x, y, z) {
        this.gl.uniform3f(this.location, x, y, z);
    }

    set4Float(x, y, z, w) {
        this.gl.uniform4f(this.location, x, y, z, w);
    }    
}

export class GlProgram{
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl;
        this.glObject = createGlslProgram(gl, vertexShaderSource, fragmentShaderSource);

        this.attributes = new Map();
        let numAttributes = gl.getProgramParameter(this.glObject, gl.ACTIVE_ATTRIBUTES);
        for (let index = 0; index < numAttributes; index++) {
            let attribute = new GlAttribute(gl, this, index);
            this.attributes.set(attribute.name, attribute);
        }
        
        this.uniforms = new Map();        
        let numUniforms = gl.getProgramParameter(this.glObject, gl.ACTIVE_UNIFORMS);
        for (let index = 0; index < numUniforms; index++) {
            let uniform = new GlUniform(gl, this, index);
            this.uniforms.set(uniform.name, uniform);
        }        
    }

    use(code) {
        this.gl.useProgram(this.glObject);
        code();
        this.gl.useProgram(null);
    }    
}