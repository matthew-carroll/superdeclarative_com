// 3D Perspective Orbiting Icon Rings
(function initHeroOrbitRings() {
  const ringElements = Array.from(document.querySelectorAll(".hero-orbit-ring"));
  if (ringElements.length === 0) return;

  const BEAM_STEPS = 128;

  const rings = ringElements.map((ringEl, ringIndex) => {
    const icons = Array.from(ringEl.querySelectorAll(".hero-ring-icon"));
    const tilt = parseFloat(ringEl.dataset.ringTilt || "0.22");
    const speed = parseFloat(ringEl.dataset.ringSpeed || "0.35"); // radians per second
    const phaseOffset = parseFloat(ringEl.dataset.ringPhase || "0");
    const useFog = ringEl.dataset.ringFog !== "false";

    const centerPhone = ringEl.querySelector("#heroCenterPhoneSlide"); // Safari ignores filters inside an SVG

    return {
      ringEl,
      icons,
      centerPhone,
      tilt,
      speed,
      phaseOffset,
      useFog,
      ringIndex,
      beam: createHeroBeam(ringEl, 17 + ringIndex * 31),
      basePts: [],
      beamVertices: new Float32Array((BEAM_STEPS + 1) * 2 * 6),
      width: ringEl.clientWidth,
      lastRx: 0,
      lastMaxRx: 0,
    };
  });

  const perspectiveStrength = 0.28; // Depth foreshortening factor
  const baseScale = 0.84;
  const fogBgNorm = 20 / 255; // #141417 background luminance (~0.0784)
  const energySubtitleEl = document.getElementById("heroEnergySubtitle");
  const mainTitleEl = document.getElementById("heroMainTitle");
  const characterWrapEl = document.getElementById("heroCharacterWrap");
  const centerPhoneSlideEl = document.getElementById("heroCenterPhoneSlide");
  const heroEl = document.getElementById("hero");
  const ring1El = document.getElementById("heroRing1");
  const ring2El = document.getElementById("heroRing2");
  const ring3El = document.getElementById("heroRing3");
  const headingBlockEl = document.getElementById("heroHeadingBlock");
  const centerPhoneEl = document.getElementById("heroCenterPhone");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function stageProgress(elapsed, start, duration) {
    if (elapsed <= start) return 0;
    if (elapsed >= start + duration) return 1;
    return (elapsed - start) / duration;
  }

  // Choreographed entrance timeline (in seconds):
  // 1. Character fades and slides up at the bottom
  // 2. Bottom ring (ring 1) starts at half diameter, icons scale up & ring/icons fade in
  // 3. Middle ring (ring 2) enters the same way
  // 4. Top ring (ring 3) enters the same way
  // 5. Center iPhone slides up into place out of the darkness (through its bottom mask)
  // 6. "App Development" slides up and fades in
  // 7. "AI-Infused" slides up and fades in
  const introTimeline = {
    character: { start: 0.08, duration: 0.72 },
    ring0:     { start: 0.46, duration: 0.72 }, // heroRing1 (bottom ring starts while character is still sliding up)
    ring1:     { start: 0.72, duration: 0.70 }, // heroRing2 (middle ring overlaps bottom ring)
    ring2:     { start: 0.98, duration: 0.66 }, // heroRing3 (top ring overlaps middle ring)
    phone:     { start: 1.18, duration: 0.75 }, // phone starts rising while top ring is still expanding
    title:     { start: 1.81, duration: 0.58 },
    subtitle:  { start: 2.28, duration: 0.55 },
  };

  // Dynamically distribute the vertical column (heading -> phone -> ring3 -> ring2 -> ring1 -> character)
  // proportionally to available viewport height and intrinsic heading height on screens < 1200px.
  function updateProportionalColumnLayout() {
    if (!heroEl || !ring1El || !ring2El || !ring3El || !headingBlockEl || !centerPhoneEl) return;

    if (window.innerWidth >= 1200) {
      ring1El.style.top = "";
      ring2El.style.top = "";
      ring3El.style.top = "";
      headingBlockEl.style.bottom = "";
      centerPhoneEl.style.top = "";
      return;
    }

    const H = heroEl.clientHeight;
    const headingH = headingBlockEl.offsetHeight || 96;

    // Ideal baseline at H = 956px (iPhone 16 Pro Max) with single-line heading (~96px):
    // - Heading top padding: ~102px
    // - Heading bottom to Ring 3 center: 245px (phone center is at -50px above Ring 3)
    // - Ring 3 center to Ring 2 center: 110px
    // - Ring 2 center to Ring 1 center: 150px
    // - Ring 1 center to bottom of hero (character): 253px
    // Total ideal gaps (excluding intrinsic headingH) = 102 + 245 + 110 + 150 + 253 = 860px.
    const availableForGaps = Math.max(480, H - headingH);
    const idealTotalGaps = 860;
    const delta = availableForGaps - idealTotalGaps;

    // Distribute expansion/contraction proportionally using elasticity weights:
    // Top padding & outer gaps absorb slightly more compression on shorter screens or 2-line wraps,
    // while internal ring/phone gaps scale smoothly to preserve the 3D stack proportions.
    const topPad = Math.max(32, 102 + delta * 0.28);
    const headingToRing3 = Math.max(190, 245 + delta * 0.20);
    const ring3ToRing2 = Math.max(82, 110 + delta * 0.14);
    const ring2ToRing1 = Math.max(112, 150 + delta * 0.18);

    // On phones, the heading sits below the logo instead of beside it. Where the top padding is compressed,
    // push everything but the character down to make room for the logo, by up to 50px. Very short screens
    // only push down until ring 1's front icons (120px below its center) reach the bottom of the hero, but
    // always enough to clear the logo.
    let pushDown = 0;
    if (window.innerWidth < 640) {
      const ring1Bottom = topPad + headingH + headingToRing3 + ring3ToRing2 + ring2ToRing1 + 120;
      pushDown = Math.max(0, Math.min(50, 102 - topPad, Math.max(16, H - ring1Bottom)));
    }

    const ring3Top = topPad + pushDown + headingH + headingToRing3;
    const ring2Top = ring3Top + ring3ToRing2;
    const ring1Top = ring2Top + ring2ToRing1;
    const phoneOffset = -50 * (headingToRing3 / 245);

    headingBlockEl.style.bottom = `${headingToRing3.toFixed(1)}px`;
    centerPhoneEl.style.top = `${phoneOffset.toFixed(1)}px`;
    ring3El.style.top = `${ring3Top.toFixed(1)}px`;
    ring2El.style.top = `${ring2Top.toFixed(1)}px`;
    ring1El.style.top = `${ring1Top.toFixed(1)}px`;
  }

  updateProportionalColumnLayout();
  window.addEventListener("resize", () => {
    updateProportionalColumnLayout();
    for (const ring of rings) {
      ring.lastRx = 0; // recompute the ring in the next frame
    }
  });

  // Reading a ring's width in every frame would force a layout in every frame.
  const ringSizes = new ResizeObserver(() => {
    for (const ring of rings) {
      ring.width = ring.ringEl.clientWidth;
    }
  });
  for (const ring of rings) {
    ringSizes.observe(ring.ringEl);
  }

  // Precompute base perspective oval geometry & unit normals whenever dimensions change
  function computeRingBaseGeometry(ring, rx, ry, radiusRatio) {
    const steps = BEAM_STEPS;
    const raw = [];
    for (let k = 0; k < steps; k++) {
      const theta = (k * 2 * Math.PI) / steps;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const depthNorm = sinT * radiusRatio;
      const persp = 1 / (1 - perspectiveStrength * depthNorm);
      const x = rx * cosT * persp * (1 - perspectiveStrength * perspectiveStrength);
      const y = ry * sinT * persp;
      raw.push({ x, y, theta, sinT });
    }

    const basePts = [];
    for (let k = 0; k < steps; k++) {
      const prev = raw[(k - 1 + steps) % steps];
      const curr = raw[k];
      const next = raw[(k + 1) % steps];
      const tx = next.x - prev.x;
      const ty = next.y - prev.y;
      const len = Math.hypot(tx, ty) || 1;
      basePts.push({
        x: curr.x,
        y: curr.y,
        theta: curr.theta,
        sinT: curr.sinT,
        nx: ty / len,
        ny: -tx / len,
      });
    }
    ring.basePts = basePts;
  }

  // Gives a ring's beam the area that the beam can reach, including its glow, during and after its entrance
  function layOutBeam(ring) {
    const glowReach = 28;
    const xs = ring.basePts.map((p) => p.x);
    const ys = ring.basePts.map((p) => p.y);
    const front = Math.max(...ys);
    const back = Math.min(...ys);
    const visibleX = Math.min(Math.max(...xs), heroEl.clientWidth / 2); // the hero clips its rings

    ring.beam.layOut(
      -visibleX - glowReach,
      front - (front - back) * 0.73 - glowReach, // the beam fades out toward the back of the ring
      visibleX + glowReach,
      Math.max(front, front * 0.5 + 72) + glowReach, // the beam enters from below, at half of its size
    );
  }

  // Deterministic pseudo-noise helper for realistic unstable neon voltage dips/sputters
  function neonInstability(t, seed) {
    // Mostly steady at ~1.0, with a subtle warm hum and occasional brief voltage drop sputters
    const slowHum = 0.97 + 0.03 * Math.sin(t * 2.4 + seed);

    // Construct two incommensurate sputter windows so every ~1.5-3s the neon briefly dips/sputters
    const w1 = Math.sin(t * 1.85 + seed * 1.7) * Math.sin(t * 3.1 - seed * 0.9);
    const w2 = Math.sin(t * 2.95 - seed * 2.3) * Math.cos(t * 4.4 + seed * 1.1);

    let dip = 0;
    if (w1 > 0.72) {
      // Quick double-sputter dip inside the window
      const rapid = 0.5 + 0.5 * Math.sin(t * 46.0 + seed * 5.0);
      dip += ((w1 - 0.72) / 0.28) * (0.14 + 0.16 * rapid);
    }
    if (w2 > 0.78) {
      const rapid2 = 0.5 + 0.5 * Math.cos(t * 58.0 - seed * 3.0);
      dip += ((w2 - 0.78) / 0.22) * (0.10 + 0.14 * rapid2);
    }

    return Math.max(0.68, slowHum - Math.min(0.28, dip));
  }

  // Animate traveling plasma wave packets, filament thickness ripple, and unstable neon flicker
  function updateEnergyBeamFrame(ring, timeSec, radiusScale, introOpacity, slideYOffset) {
    const pts = ring.basePts;
    const steps = pts.length;
    if (steps === 0) return;

    const seedOffset = ring.ringIndex * 2.17;
    const flowPhase = timeSec * ring.speed * 4.5 + seedOffset;

    // Unstable neon light pattern (steady baseline with brief realistic voltage sputters)
    const flicker = neonInstability(timeSec, seedOffset);
    ring.currentFlicker = flicker;
    ring.currentFlowPhase = flowPhase;

    const { beam, beamVertices } = ring;
    beam.setVisible(introOpacity > 0.001);
    if (introOpacity <= 0.001) return;

    const minThickness = 1.1; // back of the ring (sinT = -1)
    const maxThickness = 3.8; // front of the ring (sinT = +1)
    let v = 0;

    for (let k = 0; k < steps; k++) {
      const p = pts[k];
      const frontWeight = (p.sinT + 1) / 2; // 0 at back, 1 at front
      const baseW = minThickness + frontWeight * (maxThickness - minThickness);

      // Travelling plasma packets & micro-filament ripple along the ring
      const wave1 = Math.sin(p.theta * 5 - flowPhase);
      const wave2 = Math.sin(p.theta * 11 - flowPhase * 1.65 + 1.3);
      const wave3 = Math.cos(p.theta * 19 + timeSec * 9.5 + seedOffset);
      const packetSurge = 1 + (0.24 * wave1 + 0.14 * wave2 + 0.08 * wave3) * (0.35 + 0.65 * frontWeight);

      // Subtle normal jitter so the beam subtly arcs/vibrates
      const jitter = (0.35 * wave2 + 0.25 * wave3) * frontWeight;
      const cx = p.x * radiusScale + p.nx * jitter;
      const cy = p.y * radiusScale + p.ny * jitter + slideYOffset;

      const halfPlasma = (baseW * packetSurge) / 2;
      for (const side of [1, -1]) {
        beamVertices[v++] = cx;
        beamVertices[v++] = cy;
        beamVertices[v++] = p.nx;
        beamVertices[v++] = p.ny;
        beamVertices[v++] = halfPlasma;
        beamVertices[v++] = side;
      }
    }
    beamVertices.copyWithin(v, 0, 12); // close the loop

    beam.draw({
      vertices: beamVertices,
      glowOpacity: Math.min(1, flicker * 0.72) * introOpacity,
      plasmaOpacity: Math.min(1, flicker * 0.96) * introOpacity,
      coreOpacity: Math.min(1, 0.65 + (flicker - 0.85) * 2.2) * introOpacity,
      // Subtly shift fractal noise frequency for living internal plasma texture
      noiseFrequency: [
        0.042 + 0.006 * Math.sin(timeSec * 3.1 + seedOffset),
        0.088 + 0.012 * Math.cos(timeSec * 4.7 + seedOffset),
      ],
    });
  }

  let frameRequest = null;

  function renderRings(now) {
    const elapsedSeconds = (now - startTime) / 1000;

    // Step 1: Fade and slide up the character at the bottom
    if (characterWrapEl) {
      const pChar = easeOutCubic(
        stageProgress(elapsedSeconds, introTimeline.character.start, introTimeline.character.duration)
      );
      const charY = (1 - pChar) * 64;
      characterWrapEl.style.opacity = pChar.toFixed(3);
      characterWrapEl.style.transform = `translate3d(-50%, ${charY.toFixed(2)}px, 0)`;
    }

    // Step 5: Slide the center phone up into place out of the darkness (through its bottom mask)
    if (centerPhoneSlideEl) {
      const pPhone = easeOutQuart(
        stageProgress(elapsedSeconds, introTimeline.phone.start, introTimeline.phone.duration)
      );
      const phoneY = (1 - pPhone) * 145;
      const phoneOpacity = easeOutCubic(
        stageProgress(elapsedSeconds, introTimeline.phone.start, introTimeline.phone.duration * 0.65)
      );
      centerPhoneSlideEl.style.opacity = phoneOpacity.toFixed(3);
      centerPhoneSlideEl.style.transform = `translate3d(0, ${phoneY.toFixed(2)}px, 0)`;
    }

    // Step 6: "App Development" slides up and fades in
    if (mainTitleEl) {
      const pTitle = easeOutCubic(
        stageProgress(elapsedSeconds, introTimeline.title.start, introTimeline.title.duration)
      );
      const titleY = (1 - pTitle) * 24;
      mainTitleEl.style.opacity = pTitle.toFixed(3);
      mainTitleEl.style.transform = `translate3d(0, ${titleY.toFixed(2)}px, 0)`;
    }

    // Step 7: Cycling yellow energy subtitle ("AI Infused" -> "Human Centered" -> "Thoroughly Tested")
    // Slides up and fades in on entrance, holds, then cycles with a smooth slide-up + fade transition.
    if (energySubtitleEl) {
      const phrases = ["AI Infused", "Human Centered", "Thoroughly Tested"];
      const introStart = introTimeline.subtitle.start;
      const introDur = introTimeline.subtitle.duration;

      let visibility = 0;
      let subY = 20;
      let phraseIndex = 0;

      if (elapsedSeconds > introStart) {
        const firstDoneTime = introStart + introDur;
        if (elapsedSeconds <= firstDoneTime) {
          const pSub = easeOutCubic(stageProgress(elapsedSeconds, introStart, introDur));
          visibility = pSub;
          subY = (1 - pSub) * 20;
          phraseIndex = 0;
        } else {
          const holdDur = 2.4;
          const exitDur = 0.32;
          const enterDur = 0.42;
          const cycleDur = holdDur + exitDur + enterDur;

          const cycleElapsed = elapsedSeconds - firstDoneTime;
          const cycleNum = Math.floor(cycleElapsed / cycleDur);
          const tInCycle = cycleElapsed - cycleNum * cycleDur;

          if (tInCycle < holdDur) {
            phraseIndex = cycleNum % phrases.length;
            visibility = 1;
            subY = 0;
          } else if (tInCycle < holdDur + exitDur) {
            phraseIndex = cycleNum % phrases.length;
            const pOut = Math.pow((tInCycle - holdDur) / exitDur, 2);
            visibility = 1 - pOut;
            subY = -pOut * 14;
          } else {
            phraseIndex = (cycleNum + 1) % phrases.length;
            const pIn = easeOutCubic((tInCycle - holdDur - exitDur) / enterDur);
            visibility = pIn;
            subY = (1 - pIn) * 18;
          }
        }
      }

      if (energySubtitleEl.textContent !== phrases[phraseIndex]) {
        energySubtitleEl.textContent = phrases[phraseIndex];
      }

      const subFlicker = neonInstability(elapsedSeconds, 1.37);
      const microShimmer = 0.03 * Math.sin(elapsedSeconds * 31.7);
      const intensity = Math.max(0.65, Math.min(1.05, subFlicker + microShimmer));
      const glowAlpha1 = (intensity * 0.65 * visibility).toFixed(3);
      const glowAlpha2 = (intensity * 0.35 * visibility).toFixed(3);
      energySubtitleEl.style.opacity = ((0.72 + intensity * 0.28) * visibility).toFixed(3);
      energySubtitleEl.style.transform = `translate3d(0, ${subY.toFixed(2)}px, 0)`;
      energySubtitleEl.style.filter = `brightness(${(0.85 + intensity * 0.22).toFixed(3)})`;
      energySubtitleEl.style.textShadow = `0 0 10px rgba(255, 237, 75, ${glowAlpha1}), 0 0 24px rgba(255, 184, 0, ${glowAlpha2})`;
    }

    let maxRx = 1;
    for (const ring of rings) {
      const rx = ring.width / 2;
      if (rx > maxRx) maxRx = rx;
    }

    for (const ring of rings) {
      const rx = ring.width / 2;
      const ry = rx * ring.tilt;
      const radiusRatio = rx / maxRx;

      if (rx !== ring.lastRx || maxRx !== ring.lastMaxRx) {
        computeRingBaseGeometry(ring, rx, ry, radiusRatio);
        ring.lastRx = rx;
        ring.lastMaxRx = maxRx;
        layOutBeam(ring);
      }

      // Steps 2, 3, 4: Ring entrance (starts at half diameter, slides up into place, icons scale up & ring/icons fade in)
      const ringStage = introTimeline[`ring${ring.ringIndex}`] || { start: 0, duration: 0.6 };
      const ringRawP = stageProgress(elapsedSeconds, ringStage.start, ringStage.duration);
      const ringEaseP = easeOutCubic(ringRawP);
      const radiusScale = 0.5 + 0.5 * ringEaseP; // starts at 50% diameter -> 100%
      const ringIntroOpacity = ringEaseP;
      const iconIntroScale = 0.35 + 0.65 * ringEaseP; // icons scale up as the ring expands
      const ringSlideY = (1 - ringEaseP) * 72; // slides up 72px into its final location

      updateEnergyBeamFrame(ring, elapsedSeconds, radiusScale, ringIntroOpacity, ringSlideY);

      // Apply the ring's ambient yellow neon reflection to any center phone inside the ring
      if (ring.centerPhone) {
        const ringNeon = ring.currentFlicker || 0.96;
        const phoneSepia = 0.58 + (ringNeon - 0.85) * 0.45;
        const phoneSaturate = 2.1 + (ringNeon - 0.85) * 1.5;
        ring.centerPhone.style.filter = `brightness(${ringNeon.toFixed(3)}) sepia(${phoneSepia.toFixed(3)}) hue-rotate(8deg) saturate(${phoneSaturate.toFixed(2)})`;
      }

      const count = ring.icons.length;
      if (count === 0) continue;

      if (ringIntroOpacity <= 0.001) {
        for (let i = 0; i < count; i++) {
          ring.icons[i].style.opacity = "0";
        }
        continue;
      }

      // With reduced motion, the ring holds still with a gap at its front and center, so that
      // no icon covers the character. The energy still flows and flickers.
      const baseAngle = reducedMotion.matches
        ? Math.PI / 2 + Math.PI / count
        : ring.phaseOffset + elapsedSeconds * ring.speed;

      for (let i = 0; i < count; i++) {
        const theta = baseAngle + (i * 2 * Math.PI) / count;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta); // +1 = closest to camera (bottom of oval), -1 = farthest (top of oval)
        const depthNorm = sinT * radiusRatio;

        // Perspective projection factor based on true 3D depth (depthNorm)
        const persp = 1 / (1 - perspectiveStrength * depthNorm);
        const x = rx * radiusScale * cosT * persp * (1 - perspectiveStrength * perspectiveStrength);
        const y = ry * radiusScale * sinT * persp + ringSlideY;
        const scale = baseScale * persp * iconIntroScale;

        const icon = ring.icons[i];
        icon.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

        // Distance along ring from front (farness = 0 at sinT = +1) to back (farness = 1 at sinT = -1)
        const farness = (1 - sinT) / 2;

        // In the back 30% of the ring (farness >= 0.70), icons fully disappear into the fog
        if (ring.useFog && farness >= 0.70) {
          icon.style.opacity = "0";
          continue;
        }

        // Ambient yellow light reflection:
        // Every icon starts with a permanent golden-yellow base tint (since yellow energy is the sole light source),
        // modulated gently by the ring's shared unstable neon flicker and a subtle spatial ripple along the ring.
        const ringNeon = ring.currentFlicker || 0.96;
        const spatialWave = 0.04 * Math.sin(theta * 3 - (ring.currentFlowPhase || 0) * 0.5);
        const ambientLight = Math.max(0.68, Math.min(1.06, ringNeon + spatialWave));

        // Base yellow tint stays consistently golden-yellow, flickering subtly in intensity with the neon instability
        const baseSepia = 0.62 + (ambientLight - 0.85) * 0.45; // steady warm yellow base (~0.55 - 0.72)
        const baseSaturate = 2.25 + (ambientLight - 0.85) * 1.6; // steady golden saturation (~2.0 - 2.6)

        if (ring.useFog) {
          // Ramp opaque fog from 0 at the front (farness = 0) to full fog by farness = 0.70 (start of back 30%)
          const normalizedFogDist = Math.min(1, farness / 0.70);
          const fogCurve = Math.pow(normalizedFogDist, 1.35);
          const fogAmount = fogCurve * 0.94; // mixes RGB almost completely to #141417 by farness = 0.70

          const contrast = 1 - 2 * fogBgNorm * fogAmount;
          const brightness = ((1 - fogAmount) / contrast) * ambientLight;

          // Keep icon 100% opaque across the front/sides so icons never show through each other,
          // then smoothly feather opacity to 0 over the final transition zone (farness 0.52 -> 0.70)
          // where the icon is already dark fog-colored, so it disappears completely at farness = 0.70.
          let opacity = 1;
          if (farness > 0.52) {
            const fadeT = (farness - 0.52) / (0.70 - 0.52);
            opacity = Math.max(0, 1 - fadeT * fadeT * (3 - 2 * fadeT));
          }

          icon.style.opacity = (opacity * ringIntroOpacity).toFixed(3);
          icon.style.filter = `brightness(${brightness.toFixed(3)}) contrast(${contrast.toFixed(3)}) sepia(${baseSepia.toFixed(3)}) hue-rotate(8deg) saturate(${baseSaturate.toFixed(2)})`;
        } else {
          icon.style.opacity = ringIntroOpacity.toFixed(3);
          icon.style.filter = `brightness(${ambientLight.toFixed(3)}) sepia(${baseSepia.toFixed(3)}) hue-rotate(8deg) saturate(${baseSaturate.toFixed(2)})`;
        }

        icon.style.zIndex = String(Math.round(100 + depthNorm * 50));
      }
    }

    frameRequest = requestAnimationFrame(renderRings);
  }

  // Stop drawing while the hero is off screen. Every frame is drawn from the elapsed
  // time alone, so it picks up exactly where it would have been.
  new IntersectionObserver((entries) => {
    const isVisible = entries[entries.length - 1].isIntersecting;
    if (isVisible && frameRequest === null) {
      frameRequest = requestAnimationFrame(renderRings);
    } else if (!isVisible && frameRequest !== null) {
      cancelAnimationFrame(frameRequest);
      frameRequest = null;
    }
  }, { rootMargin: "100px" }).observe(heroEl);

  frameRequest = requestAnimationFrame(renderRings);
})();
