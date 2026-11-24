// Draws the energy beam around a hero ring. hero_rings.js decides the beam's shape in each frame.
//
// The beam has three layers: a blurred amber corona, a golden plasma filament that's textured by
// fractal noise, and a hot white core. The corona and the core are as thick as the plasma, times
// the widths below.
const HERO_GLOW_WIDTH = 2.35;
const HERO_CORE_WIDTH = 0.36;

function createHeroBeam(ringEl, noiseSeed) {
  return createHeroGlBeam(ringEl, noiseSeed) || createHeroSvgBeam(ringEl, noiseSeed);
}

// The top and bottom of a layer of the beam, which the layer's gradient spans.
function heroBeamSpan(vertices, layerWidth) {
  let top = Infinity;
  let bottom = -Infinity;
  for (let i = 0; i < vertices.length; i += 12) {
    const y = vertices[i + 1];
    const reach = Math.abs(vertices[i + 3]) * vertices[i + 4] * layerWidth;
    top = Math.min(top, y - reach);
    bottom = Math.max(bottom, y + reach);
  }
  return [top, bottom];
}

// Draws the beam with WebGL, or returns null if WebGL isn't available.
//
// With SVG filters, the noise and the blurs are computed for every pixel in the ring's bounding
// box. Safari does that on the CPU, at a few frames per second. Here, they're computed on the GPU,
// and only for the pixels along the beam.
function createHeroGlBeam(ringEl, noiseSeed) {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { antialias: false, depth: false, stencil: false });
  if (!gl) return null;

  canvas.className = "pointer-events-none absolute";
  canvas.style.zIndex = "10";

  const TIGHT_BLUR = 2.2;
  const WIDE_BLUR = 6.5;
  const BLUR_PAIRS = 10;

  // Extrudes the beam's center line into a strip that reaches `uPad` past the edge of a layer.
  const stripVertexShader = `
    precision highp float;
    attribute vec4 aLine; // center, normal
    attribute vec2 aEdge; // half of the plasma's thickness, side
    uniform vec2 uOrigin, uSize;
    uniform float uWidth, uPad;
    varying vec2 vPos, vNormal, vUv;
    varying float vDistance, vHalf;
    void main() {
      vHalf = aEdge.x;
      vDistance = (vHalf * uWidth + uPad) * aEdge.y;
      vNormal = aLine.zw;
      vPos = aLine.xy + vNormal * vDistance;
      vec2 p = (vPos - uOrigin) / uSize;
      vUv = vec2(p.x, 1.0 - p.y);
      gl_Position = vec4(vUv * 2.0 - 1.0, 0.0, 1.0);
    }`;

  const beamFunctions = `
    precision highp float;
    varying vec2 vPos, vNormal, vUv;
    varying float vDistance, vHalf;
    uniform float uPixelRatio;

    // Fades from the front of the ring (bottom) to just past halfway toward the back (top).
    vec4 depthGradient(vec3 front, vec3 mid, vec2 topBottom, float y) {
      float t = (topBottom.y - y) / (topBottom.y - topBottom.x);
      float toMid = clamp(t / 0.45, 0.0, 1.0);
      float alpha = mix(1.0, 0.95, toMid) * (1.0 - clamp((t - 0.45) / 0.27, 0.0, 1.0));
      return vec4(mix(front, mid, toMid) * alpha, alpha);
    }

    // How much of a pixel is covered by a band.
    float coverage(float distance, float halfWidth) {
      float d = distance * uPixelRatio;
      float h = halfWidth * uPixelRatio;
      return clamp(d + h + 0.5, 0.0, 1.0) - clamp(d - h + 0.5, 0.0, 1.0);
    }`;

  // The corona, before it's blurred.
  const glowFragmentShader = `${beamFunctions}
    uniform vec2 uGlowSpan;
    void main() {
      gl_FragColor = depthGradient(vec3(1.0, 0.7216, 0.0), vec3(1.0, 0.5412, 0.0), uGlowSpan, vPos.y)
        * coverage(vDistance, vHalf * ${HERO_GLOW_WIDTH});
    }`;

  const blurFragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec2 uTexel;
    uniform float uCenterWeight;
    uniform vec2 uPairs[${BLUR_PAIRS}]; // offset, weight
    void main() {
      vec4 sum = texture2D(uTexture, vUv) * uCenterWeight;
      for (int i = 0; i < ${BLUR_PAIRS}; i++) {
        vec2 offset = uTexel * uPairs[i].x;
        sum += (texture2D(uTexture, vUv + offset) + texture2D(uTexture, vUv - offset)) * uPairs[i].y;
      }
      gl_FragColor = sum;
    }`;

  const coronaFragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTight, uWide;
    uniform float uOpacity;
    void main() {
      vec4 tight = texture2D(uTight, vUv);
      gl_FragColor = (tight + texture2D(uWide, vUv) * (1.0 - tight.a)) * uOpacity;
    }`;

  // The plasma and the core.
  const filamentFragmentShader = `${beamFunctions}
    uniform sampler2D uRedGreenLattice, uAlphaLattice;
    uniform vec2 uFrequency, uPlasmaSpan, uCoreSpan;
    uniform float uPlasmaOpacity, uCoreOpacity;

    vec3 cornerNoise(vec2 cell, vec2 toPoint) {
      vec2 uv = (cell + 0.5) / 256.0;
      vec4 redGreen = texture2D(uRedGreenLattice, uv) * 2.0 - 1.0;
      vec2 alpha = texture2D(uAlphaLattice, uv).ra * 2.0 - 1.0;
      return vec3(dot(redGreen.xy, toPoint), dot(redGreen.zw, toPoint), dot(alpha, toPoint));
    }

    // The red, green, and alpha of SVG's feTurbulence, with three octaves of fractalNoise.
    vec3 fractalNoise(vec2 point) {
      vec3 sum = vec3(0.0);
      float amplitude = 1.0;
      for (int octave = 0; octave < 3; octave++) {
        vec2 cell = floor(point);
        vec2 r = point - cell;
        vec2 s = r * r * (3.0 - 2.0 * r);
        sum += amplitude * mix(
          mix(cornerNoise(cell, r), cornerNoise(cell + vec2(1.0, 0.0), r - vec2(1.0, 0.0)), s.x),
          mix(cornerNoise(cell + vec2(0.0, 1.0), r - vec2(0.0, 1.0)), cornerNoise(cell + 1.0, r - 1.0), s.x),
          s.y);
        point *= 2.0;
        amplitude *= 0.5;
      }
      return clamp((sum + 1.0) * 0.5, 0.0, 1.0);
    }

    float gaussianEdge(float x) {
      return 1.0 / (1.0 + exp(-1.7 * x));
    }

    void main() {
      vec3 noise = fractalNoise(vPos * uFrequency);
      vec2 displacement = 2.2 * (noise.xy - 0.5);
      float d = vDistance + dot(vNormal, displacement);
      float grain = clamp(0.65 * noise.z + 0.55, 0.0, 1.0);

      // Blur the plasma a little, and draw the sharp plasma on top of that.
      vec4 plasma = depthGradient(
        vec3(1.0, 0.9294, 0.2941), vec3(1.0, 0.8157, 0.0), uPlasmaSpan, vPos.y + displacement.y) * grain;
      float blur = sqrt(0.55 * 0.55 + 0.0833 / (uPixelRatio * uPixelRatio));
      vec4 soft = plasma * max(0.0, gaussianEdge((d + vHalf) / blur) - gaussianEdge((d - vHalf) / blur));
      vec2 wholePixels = floor(displacement * uPixelRatio + 0.5) / uPixelRatio; // leaves a ragged edge
      plasma *= coverage(vDistance + dot(vNormal, wholePixels), vHalf);
      plasma = (plasma + soft * (1.0 - plasma.a)) * uPlasmaOpacity;

      vec4 core = depthGradient(vec3(1.0, 0.9922, 0.949), vec3(1.0, 0.9529, 0.6314), uCoreSpan, vPos.y)
        * coverage(vDistance, vHalf * ${HERO_CORE_WIDTH}) * uCoreOpacity;
      gl_FragColor = core + plasma * (1.0 - core.a);
    }`;

  // The gradients that SVG's feTurbulence picks for each point of its lattice with the given seed,
  // as one texture for red and green, and another for alpha.
  function createNoiseLattice(seed) {
    const size = 256;
    const random = () => {
      seed = 16807 * (seed % 127773) - 2836 * Math.floor(seed / 127773);
      if (seed <= 0) seed += 2147483647;
      return seed;
    };
    const gradients = [];
    for (let channel = 0; channel < 4; channel++) {
      gradients.push(Array.from({ length: size }, () => {
        const x = ((random() % (size + size)) - size) / size;
        const y = ((random() % (size + size)) - size) / size;
        const length = Math.hypot(x, y) || 1;
        return [x / length, y / length];
      }));
    }
    const order = Array.from({ length: size }, (_, i) => i);
    for (let i = size - 1; i > 0; i--) {
      const j = random() % size;
      [order[i], order[j]] = [order[j], order[i]];
    }

    const toByte = (value) => Math.round((value + 1) * 127.5);
    const redGreen = new Uint8Array(size * size * 4);
    const alpha = new Uint8Array(size * size * 2);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const point = order[(order[x] + y) % size];
        const i = y * size + x;
        redGreen[i * 4] = toByte(gradients[0][point][0]);
        redGreen[i * 4 + 1] = toByte(gradients[0][point][1]);
        redGreen[i * 4 + 2] = toByte(gradients[1][point][0]);
        redGreen[i * 4 + 3] = toByte(gradients[1][point][1]);
        alpha[i * 2] = toByte(gradients[3][point][0]);
        alpha[i * 2 + 1] = toByte(gradients[3][point][1]);
      }
    }
    return { size, redGreen, alpha };
  }

  function createProgram(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.bindAttribLocation(program, 0, "aLine");
    gl.bindAttribLocation(program, 1, "aEdge");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i).name.replace("[0]", "");
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    return { program, uniforms };
  }

  function createTexture(filter, wrap) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    return texture;
  }

  // Merges each pair of neighboring texels into one linearly filtered sample.
  function createBlurKernel(deviation) {
    const weights = Array.from({ length: BLUR_PAIRS * 2 + 1 }, (_, i) =>
      i <= Math.ceil(deviation * 3) ? Math.exp((-i * i) / (2 * deviation * deviation)) : 0
    );
    const total = weights[0] + 2 * weights.slice(1).reduce((sum, weight) => sum + weight, 0);
    const pairs = new Float32Array(BLUR_PAIRS * 2);
    for (let i = 0; i < BLUR_PAIRS; i++) {
      const near = weights[i * 2 + 1];
      const far = weights[i * 2 + 2];
      pairs[i * 2] = near + far > 0 ? i * 2 + 1 + far / (near + far) : 0;
      pairs[i * 2 + 1] = (near + far) / total;
    }
    return { centerWeight: weights[0] / total, pairs };
  }

  let programs;
  let vertexBuffer;
  let lattice;
  let blurs;

  // Creates everything that lives on the GPU. It's all lost whenever the GL context is.
  function setUp() {
    programs = {
      glow: createProgram(stripVertexShader, glowFragmentShader),
      blur: createProgram(stripVertexShader, blurFragmentShader),
      corona: createProgram(stripVertexShader, coronaFragmentShader),
      filament: createProgram(stripVertexShader, filamentFragmentShader),
    };
    if (Object.values(programs).includes(null)) return false;

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 24, 16);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const { size, redGreen, alpha } = createNoiseLattice(noiseSeed);
    lattice = { redGreen: createTexture(gl.NEAREST, gl.REPEAT) };
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, redGreen);
    lattice.alpha = createTexture(gl.NEAREST, gl.REPEAT);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, size, size, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, alpha);

    blurs = [TIGHT_BLUR, WIDE_BLUR].map((deviation) => ({
      deviation,
      targets: [0, 1].map(() => ({
        texture: createTexture(gl.LINEAR, gl.CLAMP_TO_EDGE),
        framebuffer: gl.createFramebuffer(),
      })),
    }));
    return true;
  }

  if (!setUp()) return null;

  ringEl.insertBefore(canvas, ringEl.firstChild);

  let bounds = null;
  let vertexCount = 0;

  // Fits the canvas to the given area around the center of the ring.
  //
  // The browser blurs a canvas that isn't on whole pixels. That's whole CSS pixels, unless those
  // aren't whole device pixels.
  function layOut(left, top, right, bottom) {
    const pixelRatio = window.devicePixelRatio || 1;
    const grid = Number.isInteger(pixelRatio) ? 1 : pixelRatio;
    const ringRect = ringEl.getBoundingClientRect();
    const centerX = ringRect.left + ringRect.width / 2 + window.scrollX;
    const originX = Math.floor((centerX + left) * grid) / grid - centerX;
    const originY = Math.floor(top * grid) / grid; // the browser moves the ring itself to a whole pixel
    const width = Math.ceil((right - originX) * grid) / grid;
    const height = Math.ceil((bottom - originY) * grid) / grid;
    const pixelWidth = Math.round(width * pixelRatio);
    const pixelHeight = Math.round(height * pixelRatio);

    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.left = `${ringRect.width / 2 + originX}px`;
    canvas.style.top = `${originY}px`;
    bounds = { originX, originY, width, height, pixelRatio };
    sizeBlurs();
  }

  // A blur hides detail, so blurs are drawn with fewer pixels than the canvas.
  function sizeBlurs() {
    for (const blur of blurs) {
      const pixelRatio = blur.deviation === WIDE_BLUR ? 1 : Math.min(2, bounds.pixelRatio);
      const width = Math.ceil(bounds.width * pixelRatio);
      const height = Math.ceil(bounds.height * pixelRatio);
      blur.pixelRatio = pixelRatio;
      if (blur.width === width && blur.height === height) continue;

      blur.width = width;
      blur.height = height;
      blur.kernelX = createBlurKernel((blur.deviation * width) / bounds.width);
      blur.kernelY = createBlurKernel((blur.deviation * height) / bounds.height);
      for (const { texture, framebuffer } of blur.targets) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      }
    }
  }

  function bindTexture(unit, texture, uniform) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniform, unit);
  }

  function startLayer({ program, uniforms }, layerWidth, pad) {
    gl.useProgram(program);
    gl.uniform2f(uniforms.uOrigin, bounds.originX, bounds.originY);
    gl.uniform2f(uniforms.uSize, bounds.width, bounds.height);
    gl.uniform1f(uniforms.uWidth, layerWidth);
    gl.uniform1f(uniforms.uPad, pad);
    return uniforms;
  }

  function startTarget(framebuffer, width, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function drawStrip() {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
  }

  // Draws the blurred corona into `blur.targets[0]`.
  function drawBlur(blur, glowSpan) {
    const [first, second] = blur.targets;
    const reach = blur.deviation * 3 + 2;

    startTarget(first.framebuffer, blur.width, blur.height);
    const glow = startLayer(programs.glow, HERO_GLOW_WIDTH, 2 / blur.pixelRatio);
    gl.uniform1f(glow.uPixelRatio, blur.pixelRatio);
    gl.uniform2fv(glow.uGlowSpan, glowSpan);
    drawStrip();

    for (const [target, source, kernel, texelX, texelY] of [
      [second, first, blur.kernelX, 1 / blur.width, 0],
      [first, second, blur.kernelY, 0, 1 / blur.height],
    ]) {
      startTarget(target.framebuffer, blur.width, blur.height);
      const uniforms = startLayer(programs.blur, HERO_GLOW_WIDTH, reach);
      bindTexture(0, source.texture, uniforms.uTexture);
      gl.uniform2f(uniforms.uTexel, texelX, texelY);
      gl.uniform1f(uniforms.uCenterWeight, kernel.centerWeight);
      gl.uniform2fv(uniforms.uPairs, kernel.pairs);
      drawStrip();
    }
  }

  function draw(beam) {
    if (gl.isContextLost() || !bounds) return;

    gl.bufferData(gl.ARRAY_BUFFER, beam.vertices, gl.DYNAMIC_DRAW);
    vertexCount = beam.vertices.length / 6;

    gl.disable(gl.BLEND);
    const [tight, wide] = blurs;
    const glowSpan = heroBeamSpan(beam.vertices, HERO_GLOW_WIDTH);
    drawBlur(tight, glowSpan);
    drawBlur(wide, glowSpan);

    startTarget(null, canvas.width, canvas.height);
    const corona = startLayer(programs.corona, HERO_GLOW_WIDTH, WIDE_BLUR * 3);
    bindTexture(0, tight.targets[0].texture, corona.uTight);
    bindTexture(1, wide.targets[0].texture, corona.uWide);
    gl.uniform1f(corona.uOpacity, beam.glowOpacity);
    drawStrip();

    gl.enable(gl.BLEND);
    const filament = startLayer(programs.filament, 1, 3.5);
    bindTexture(0, lattice.redGreen, filament.uRedGreenLattice);
    bindTexture(1, lattice.alpha, filament.uAlphaLattice);
    gl.uniform1f(filament.uPixelRatio, bounds.pixelRatio);
    gl.uniform2fv(filament.uFrequency, beam.noiseFrequency);
    gl.uniform2fv(filament.uPlasmaSpan, heroBeamSpan(beam.vertices, 1));
    gl.uniform2fv(filament.uCoreSpan, heroBeamSpan(beam.vertices, HERO_CORE_WIDTH));
    gl.uniform1f(filament.uPlasmaOpacity, beam.plasmaOpacity);
    gl.uniform1f(filament.uCoreOpacity, beam.coreOpacity);
    drawStrip();
  }

  // Mobile browsers take the GPU away from pages in the background.
  canvas.addEventListener("webglcontextlost", (event) => event.preventDefault());
  canvas.addEventListener("webglcontextrestored", () => {
    if (setUp() && bounds) sizeBlurs();
  });

  function setVisible(isVisible) {
    canvas.style.visibility = isVisible ? "" : "hidden";
  }

  return { layOut, draw, setVisible };
}

// Draws the beam with SVG filters.
function createHeroSvgBeam(ringEl, noiseSeed) {
  const trackSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  trackSvg.setAttribute("class", "pointer-events-none absolute top-0 left-1/2 overflow-visible");
  trackSvg.style.width = "1px";
  trackSvg.style.height = "1px";
  trackSvg.style.zIndex = "10";

  const uid = `${ringEl.id}-${Math.random().toString(36).slice(2, 7)}`;
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  // Helper to create vertical front-to-back fade gradient (fades out just past halfway toward the back)
  function createDepthGradient(id, frontColor, midColor) {
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", id);
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "1"); // front (bottom of oval)
    grad.setAttribute("x2", "0");
    grad.setAttribute("y2", "0"); // back (top of oval)
    const stops = [
      { offset: "0%", color: frontColor, opacity: "1" },
      { offset: "45%", color: midColor, opacity: "0.95" },
      { offset: "72%", color: midColor, opacity: "0" },
      { offset: "100%", color: midColor, opacity: "0" },
    ];
    for (const s of stops) {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", s.offset);
      stop.setAttribute("stop-color", s.color);
      stop.setAttribute("stop-opacity", s.opacity);
      grad.appendChild(stop);
    }
    return grad;
  }

  const glowGradId = `beamGlowGrad-${uid}`;
  const plasmaGradId = `beamPlasmaGrad-${uid}`;
  const coreGradId = `beamCoreGrad-${uid}`;
  defs.appendChild(createDepthGradient(glowGradId, "#FFB800", "#FF8A00"));
  defs.appendChild(createDepthGradient(plasmaGradId, "#FFED4B", "#FFD000"));
  defs.appendChild(createDepthGradient(coreGradId, "#FFFDF2", "#FFF3A1"));

  // Dual-stage bloom filter for the outer energy corona
  const glowFilterId = `beamGlowFilter-${uid}`;
  const glowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  glowFilter.setAttribute("id", glowFilterId);
  glowFilter.setAttribute("filterUnits", "userSpaceOnUse");
  glowFilter.innerHTML = `
    <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="tightBloom" />
    <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="wideBloom" />
    <feMerge>
      <feMergeNode in="wideBloom" />
      <feMergeNode in="tightBloom" />
    </feMerge>
  `;
  defs.appendChild(glowFilter);

  // Procedural fractal plasma texture & micro-displacement filter for the main filament
  const plasmaFilterId = `beamPlasmaFilter-${uid}`;
  const plasmaFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  plasmaFilter.setAttribute("id", plasmaFilterId);
  plasmaFilter.setAttribute("filterUnits", "userSpaceOnUse");
  plasmaFilter.innerHTML = `
    <feTurbulence type="fractalNoise" baseFrequency="0.045 0.09" numOctaves="3" seed="${noiseSeed}" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
    <feComponentTransfer in="noise" result="grainAlpha">
      <feFuncA type="linear" slope="0.65" intercept="0.55" />
    </feComponentTransfer>
    <feComposite in="displaced" in2="grainAlpha" operator="in" result="texturedPlasma" />
    <feGaussianBlur in="texturedPlasma" stdDeviation="0.55" result="softPlasma" />
    <feMerge>
      <feMergeNode in="softPlasma" />
      <feMergeNode in="texturedPlasma" />
    </feMerge>
  `;
  defs.appendChild(plasmaFilter);
  const turbulenceEl = plasmaFilter.querySelector("feTurbulence");

  trackSvg.appendChild(defs);

  // Layer 1: Outer Amber/Gold Corona Bloom
  const glowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  glowPath.setAttribute("fill", `url(#${glowGradId})`);
  glowPath.setAttribute("fill-rule", "evenodd");
  glowPath.setAttribute("filter", `url(#${glowFilterId})`);
  trackSvg.appendChild(glowPath);

  // Layer 2: Textured Golden-Yellow Plasma Filament
  const trackPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  trackPath.setAttribute("fill", `url(#${plasmaGradId})`);
  trackPath.setAttribute("fill-rule", "evenodd");
  trackPath.setAttribute("filter", `url(#${plasmaFilterId})`);
  trackSvg.appendChild(trackPath);

  // Layer 3: Incandescent Hot White-Gold Inner Core
  const corePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  corePath.setAttribute("fill", `url(#${coreGradId})`);
  corePath.setAttribute("fill-rule", "evenodd");
  trackSvg.appendChild(corePath);

  ringEl.insertBefore(trackSvg, ringEl.firstChild);

  // Filters cost as much as the area that they cover.
  function layOut(left, top, right, bottom) {
    for (const filter of [glowFilter, plasmaFilter]) {
      filter.setAttribute("x", left);
      filter.setAttribute("y", top);
      filter.setAttribute("width", right - left);
      filter.setAttribute("height", bottom - top);
    }
  }

  function outline(vertices, layerWidth) {
    const edges = [[], []];
    for (let i = 0; i < vertices.length - 12; i += 6) {
      const reach = vertices[i + 4] * vertices[i + 5] * layerWidth;
      const x = vertices[i] + vertices[i + 2] * reach;
      const y = vertices[i + 1] + vertices[i + 3] * reach;
      edges[(i / 6) % 2].push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return edges.map((points) => `M ${points.join(" L ")} Z`).join(" ");
  }

  function draw(beam) {
    glowPath.setAttribute("d", outline(beam.vertices, HERO_GLOW_WIDTH));
    trackPath.setAttribute("d", outline(beam.vertices, 1));
    corePath.setAttribute("d", outline(beam.vertices, HERO_CORE_WIDTH));
    glowPath.style.opacity = beam.glowOpacity.toFixed(3);
    trackPath.style.opacity = beam.plasmaOpacity.toFixed(3);
    corePath.style.opacity = beam.coreOpacity.toFixed(3);
    turbulenceEl.setAttribute("baseFrequency", beam.noiseFrequency.map((f) => f.toFixed(4)).join(" "));
  }

  function setVisible(isVisible) {
    trackSvg.style.visibility = isVisible ? "" : "hidden";
  }

  return { layOut, draw, setVisible };
}
