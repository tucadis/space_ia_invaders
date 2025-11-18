/**
 * Renderer3D - Sistema de renderizado 3D para boss battles usando WebGL
 */
class Renderer3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.program = null;
        this.active = false;

        this.initWebGL();
    }

    initWebGL() {
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

            if (!this.gl) {
                console.warn('WebGL not supported, falling back to 2D');
                return;
            }

            this.setupShaders();
            this.setupGeometry();

            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        } catch (e) {
            console.warn('Error initializing WebGL:', e);
        }
    }

    setupShaders() {
        const vertexShaderSource = `
            attribute vec3 aPosition;
            attribute vec3 aColor;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying vec3 vColor;

            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
                vColor = aColor;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            varying vec3 vColor;
            uniform float uAlpha;

            void main() {
                gl_FragColor = vec4(vColor, uAlpha);
            }
        `;

        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize shader program:', this.gl.getProgramInfoLog(this.program));
        }

        this.gl.useProgram(this.program);

        // Obtener ubicaciones de atributos y uniforms
        this.locations = {
            aPosition: this.gl.getAttribLocation(this.program, 'aPosition'),
            aColor: this.gl.getAttribLocation(this.program, 'aColor'),
            uModelViewMatrix: this.gl.getUniformLocation(this.program, 'uModelViewMatrix'),
            uProjectionMatrix: this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
            uAlpha: this.gl.getUniformLocation(this.program, 'uAlpha')
        };
    }

    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    setupGeometry() {
        // Crear geometría de un cubo para el boss
        this.cubeVertices = new Float32Array([
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ]);

        this.cubeColors = new Float32Array([
            // Front face - Red
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.2, 0.0,
            1.0, 0.2, 0.0,

            // Back face - Dark Red
            0.6, 0.0, 0.0,
            0.6, 0.0, 0.0,
            0.6, 0.1, 0.0,
            0.6, 0.1, 0.0,

            // Top face - Orange
            1.0, 0.5, 0.0,
            1.0, 0.5, 0.0,
            1.0, 0.5, 0.0,
            1.0, 0.5, 0.0,

            // Bottom face - Dark Orange
            0.6, 0.3, 0.0,
            0.6, 0.3, 0.0,
            0.6, 0.3, 0.0,
            0.6, 0.3, 0.0,

            // Right face - Red-Orange
            1.0, 0.3, 0.0,
            1.0, 0.3, 0.0,
            1.0, 0.4, 0.0,
            1.0, 0.4, 0.0,

            // Left face - Red-Orange
            1.0, 0.3, 0.0,
            1.0, 0.3, 0.0,
            1.0, 0.4, 0.0,
            1.0, 0.4, 0.0
        ]);

        this.cubeIndices = new Uint16Array([
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ]);

        // Crear buffers
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.cubeVertices, this.gl.STATIC_DRAW);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.cubeColors, this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIndices, this.gl.STATIC_DRAW);
    }

    activate() {
        this.active = true;
        this.canvas.style.display = 'block';
        this.resize();
    }

    deactivate() {
        this.active = false;
        this.canvas.style.display = 'none';
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    render(boss, time) {
        if (!this.gl || !this.active) return;

        // Limpiar
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Configurar matrices
        const projectionMatrix = this.createPerspectiveMatrix(
            45 * Math.PI / 180,
            this.canvas.width / this.canvas.height,
            0.1,
            100.0
        );

        const modelViewMatrix = this.createModelViewMatrix(boss, time);

        // Usar programa
        this.gl.useProgram(this.program);

        // Configurar buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.locations.aPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.locations.aPosition);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.locations.aColor, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.locations.aColor);

        // Configurar uniforms
        this.gl.uniformMatrix4fv(this.locations.uProjectionMatrix, false, projectionMatrix);
        this.gl.uniformMatrix4fv(this.locations.uModelViewMatrix, false, modelViewMatrix);
        this.gl.uniform1f(this.locations.uAlpha, 0.8);

        // Dibujar
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    }

    createPerspectiveMatrix(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);

        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }

    createModelViewMatrix(boss, time) {
        const matrix = this.createIdentityMatrix();

        // Translación
        this.translate(matrix, [0, 0, -5]);

        // Rotación basada en el tiempo
        this.rotateY(matrix, time * 0.001);
        this.rotateX(matrix, Math.sin(time * 0.0005) * 0.3);

        // Escala
        this.scale(matrix, [1.5, 1.5, 1.5]);

        return matrix;
    }

    createIdentityMatrix() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    translate(matrix, vec) {
        const x = vec[0], y = vec[1], z = vec[2];
        matrix[12] += matrix[0] * x + matrix[4] * y + matrix[8] * z;
        matrix[13] += matrix[1] * x + matrix[5] * y + matrix[9] * z;
        matrix[14] += matrix[2] * x + matrix[6] * y + matrix[10] * z;
        matrix[15] += matrix[3] * x + matrix[7] * y + matrix[11] * z;
    }

    rotateX(matrix, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const mv1 = matrix[1], mv5 = matrix[5], mv9 = matrix[9];

        matrix[1] = matrix[1] * c - matrix[2] * s;
        matrix[5] = matrix[5] * c - matrix[6] * s;
        matrix[9] = matrix[9] * c - matrix[10] * s;

        matrix[2] = matrix[2] * c + mv1 * s;
        matrix[6] = matrix[6] * c + mv5 * s;
        matrix[10] = matrix[10] * c + mv9 * s;
    }

    rotateY(matrix, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const mv0 = matrix[0], mv4 = matrix[4], mv8 = matrix[8];

        matrix[0] = c * matrix[0] + s * matrix[2];
        matrix[4] = c * matrix[4] + s * matrix[6];
        matrix[8] = c * matrix[8] + s * matrix[10];

        matrix[2] = c * matrix[2] - s * mv0;
        matrix[6] = c * matrix[6] - s * mv4;
        matrix[10] = c * matrix[10] - s * mv8;
    }

    scale(matrix, vec) {
        const x = vec[0], y = vec[1], z = vec[2];
        matrix[0] *= x;
        matrix[1] *= x;
        matrix[2] *= x;
        matrix[3] *= x;
        matrix[4] *= y;
        matrix[5] *= y;
        matrix[6] *= y;
        matrix[7] *= y;
        matrix[8] *= z;
        matrix[9] *= z;
        matrix[10] *= z;
        matrix[11] *= z;
    }

    isSupported() {
        return this.gl !== null;
    }
}
