function createIndexBuffer(gl, indexData) {
    // Step 1: Create a buffer object.
    let indexBuffer = gl.createBuffer();

    // Step 2: Bind the buffer to the ELEMENT_ARRAY_BUFFER target.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Step 3: Transfer the buffer data.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    // Step 4: Unbind the buffer.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Step 5: Return the buffer.
    return indexBuffer;
}

exports.createIndexBuffer = createIndexBuffer;