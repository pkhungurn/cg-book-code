import { createIndexBuffer, createVertexBuffer } from "./vertex-index-buffer.js";
import { drawElements } from "./primitives.js";


export class PosColMesh {
  constructor(gl, positionData, colorData, indexData, primitiveType=null) {
    if (primitiveType === null) {
      primitiveType = gl.TRIANGLES;
    }

    if (primitiveType != gl.POINTS && primitiveType != gl.LINES && primitiveType != gl.TRIANGLES) {
      throw Error(`Primitive type ${primitiveType} is not supported.`);      
    }
      
    this.gl = gl;
    this.positionBuffer = createVertexBuffer(this.gl, new Float32Array(positionData));
    this.colorBuffer = createVertexBuffer(this.gl, new Float32Array(colorData));
    this.indexBuffer = createIndexBuffer(this.gl, new Int32Array(indexData));    
    
    this.numVertices = Math.floor(positionData.length / 3);
    this.numIndices = indexData.length;
  }

  setupVertexAttributes(program, vertPositionName="vert_position", vertColorName="vert_color") {
    program.attribute(vertPositionName)?.setup(this.positionBuffer, 3, 4*3, 0);
    program.attribute(vertColorName)?.setup(this.colorBuffer, 4, 4*4, 0);
  }

  drawElements(mode=null, count=null, offset=0) {
    if (mode === null) {
      mode = this.primitiveType;
    }
    if (count === null) {
      count = this.numIndices;
    }    
    drawElements(this.gl, this.indexBuffer, mode, count, offset);
  }

  draw(program, vertPositionName="vert_position", vertColorName="vert_color", mode=null, count=null, offset=0) {
    this.setupVertexAttributes(program, vertPositionName, vertColorName);
    this.drawElements(mode, count, offset);
  }
}

export class PosColMeshBuilder {
  constructor(gl) {
    this.gl = gl;
    this.positionData = [];
    this.colorData = [];
    this.indexData = [];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.primitiveType = gl.TRIANGLES;
  }

  setPrimitiveType(primitiveType) {
    if (primitiveType != gl.POINTS && primitiveType != gl.LINES && primitiveType != gl.TRIANGLES) {
      throw Error(`Primitive type ${primitiveType} is not supported.`);      
    }
    this.primitiveType = primitiveType;
    return this;
  }

  setColor(r, g, b, a) {
    this.color = [r, g, b, a];
    return this;
  }
  
  addVertex(x, y, z) {
    this.positionData.push(x);
    this.positionData.push(y);
    this.positionData.push(z);
    this.colorData.push(...this.color);
    return this;
  }

  addIndex(index) {
    this.indexData.push(index);
    return this;
  }

  addIndices(...indices) {
    this.indexData.push(...indices);
    return this;
  }

  build() {
    return new PosColMesh(this.gl, this.positionData, this.colorData, this.indexData, this.primitiveType);
  }
}