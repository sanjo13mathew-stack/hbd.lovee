/* ==========================================================================
   ROMANTIC BIRTHDAY SURPRISE CONTROLLER (MOBILE READY)
   Pointer Events API + Auto-Audio Unlock + Performance Throttling
   ========================================================================== */
(function () {
  'use strict';

  // DOM Elements
  const birthdayApp = document.getElementById('birthdayApp');
  const scenePull = document.getElementById('scenePull');
  const sceneReveal = document.getElementById('sceneReveal');
  const sceneTree = document.getElementById('sceneTree');

  // Scene 1 Elements
  const mainHeart = document.getElementById('mainHeart');
  const glowAura = document.getElementById('glowAura');
  const pullHandle = document.getElementById('pullHandle');
  const pullString = document.getElementById('pullString');

  // Scene 2 Elements
  const wishText = document.getElementById('wishText');
  const wordHappy = document.getElementById('wordHappy');
  const wordBirthday = document.getElementById('wordBirthday');
  const wordLover = document.getElementById('wordLover');

  // Scene 3 & 4 Elements
  const treeHint = document.getElementById('treeHint');
  const treeContainer = document.getElementById('treeContainer');
  const treeCanvas = document.getElementById('treeCanvas');
  const treeCtx = treeCanvas.getContext('2d');
  const finalMessage = document.getElementById('finalMessage');
  const replayBtn = document.getElementById('replayBtn');

  // Background Canvas
  const bgCanvas = document.getElementById('particleCanvas');
  const bgCtx = bgCanvas.getContext('2d');

  // Mobile Device Flag
  const isMobile = window.innerWidth <= 600 || 'ontouchstart' in window;

  /* ==========================================================================
     SYNTHESIZED ROMANTIC SOUND EFFECTS (MOBILE AUTO-UNLOCK)
     ========================================================================== */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  // Global mobile audio unlock on first touch
  window.addEventListener('touchstart', initAudio, { once: true, passive: true });
  window.addEventListener('pointerdown', initAudio, { once: true, passive: true });

  function playHeartbeatSound(pitch = 70) {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.16);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {}
  }

  function playRomanticChime(freq = 528, delay = 0) {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.1);
    } catch (_) {}
  }

  function playMagicBurstChord() {
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      playRomanticChime(f, idx * 0.08);
    });
  }

  /* ==========================================================================
     MOBILE-SAFE HIGH-DPI CANVAS SIZING
     ========================================================================== */
  let width = (bgCanvas.width = window.innerWidth);
  let height = (bgCanvas.height = window.innerHeight);

  function resizeCanvases() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;

    if (treeContainer && treeCanvas) {
      const rect = treeContainer.getBoundingClientRect();
      // Cap DPR to 2 to prevent mobile GPU battery drain
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      treeCanvas.width = rect.width * dpr;
      treeCanvas.height = rect.height * dpr;
      treeCtx.scale(dpr, dpr);
    }
  }

  window.addEventListener('resize', resizeCanvases);

  /* ==========================================================================
     AMBIENT ENGINE: BOKEH + FIREFLIES + 3D PETALS
     ========================================================================== */
  let bokehOrbs = [];
  let fireflies = [];
  let ambientPetals = [];
  let burstParticles = [];
  let cursorTrails = [];

  class BokehOrb {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 40;
      this.radius = Math.random() * 35 + 20;
      this.speedY = -(Math.random() * 0.3 + 0.12);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.alpha = Math.random() * 0.2 + 0.06;
      this.color = Math.random() > 0.5 ? '255, 182, 193' : '255, 230, 180';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -50) this.reset(false);
    }
    draw(ctx) {
      ctx.save();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
      grad.addColorStop(0.7, `rgba(${this.color}, ${this.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${this.color}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Firefly {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.pulseSpeed = Math.random() * 0.04 + 0.02;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw(ctx) {
      const alpha = (Math.sin(this.pulsePhase) + 1) / 2 * 0.65 + 0.2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 150, ${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 215, 100, 0.85)';
      ctx.fill();
      ctx.restore();
    }
  }

  class FallingPetal {
    constructor(layer = 'fg') {
      this.layer = layer;
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      const isBg = this.layer === 'bg';
      this.size = isBg ? Math.random() * 4 + 3 : Math.random() * 7 + 5;
      this.speedY = isBg ? Math.random() * 0.45 + 0.2 : Math.random() * 0.75 + 0.4;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.swingOffset = Math.random() * Math.PI * 2;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      this.alpha = isBg ? Math.random() * 0.3 + 0.15 : Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.45 ? '#ff758f' : '#ffb3c1';
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015 + this.swingOffset) * 0.7 + this.speedX;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20) this.reset(false);
      if (this.x > width + 20) this.x = -20;
      if (this.x < -20) this.x = width + 20;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.sin(this.flip), 1);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.layer === 'fg' ? 6 : 2;
      ctx.shadowColor = 'rgba(255, 117, 143, 0.4)';

      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.6, this.size * 0.8, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.6, -this.size * 0.8, -this.size * 0.6, 0, -this.size);
      ctx.fill();

      ctx.restore();
    }
  }

  class BurstParticle {
    constructor(x, y, customHue = null) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = Math.random() * 10 + 5;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.012;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.12;
      this.isHeart = Math.random() > 0.3;
      this.color = customHue || (Math.random() > 0.35 ? '#ff2a6d' : '#ffe066');
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.06;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.alpha -= this.decay;
      this.rotation += this.rotSpeed;
    }
    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;

      if (this.isHeart) {
        const s = this.size / 14;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-5 * s, -8 * s, -14 * s, 0, 0, 12 * s);
        ctx.bezierCurveTo(14 * s, 0, 5 * s, -8 * s, 0, 0);
        ctx.fill();
      } else {
        const r = this.size * 0.55;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          ctx.lineTo(
            Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.28),
            Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.28)
          );
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Optimize counts for mobile
  const bokehCount = isMobile ? 10 : 18;
  const fireflyCount = isMobile ? 20 : 35;
  const petalBgCount = isMobile ? 10 : 18;
  const petalFgCount = isMobile ? 14 : 24;

  for (let i = 0; i < bokehCount; i++) bokehOrbs.push(new BokehOrb());
  for (let i = 0; i < fireflyCount; i++) fireflies.push(new Firefly());
  for (let i = 0; i < petalBgCount; i++) ambientPetals.push(new FallingPetal('bg'));
  for (let i = 0; i < petalFgCount; i++) ambientPetals.push(new FallingPetal('fg'));

  function spawnCursorSparkle(x, y) {
    if (cursorTrails.length > (isMobile ? 12 : 25)) return;
    cursorTrails.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      size: Math.random() * 3.5 + 2,
      alpha: 0.9,
      color: Math.random() > 0.4 ? '#ff758f' : '#ffd166',
    });
  }

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || isDragging) {
      spawnCursorSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });

  function loopGlobalParticles() {
    bgCtx.clearRect(0, 0, width, height);

    for (let orb of bokehOrbs) {
      orb.update();
      orb.draw(bgCtx);
    }

    for (let ff of fireflies) {
      ff.update();
      ff.draw(bgCtx);
    }

    for (let petal of ambientPetals) {
      petal.update();
      petal.draw(bgCtx);
    }

    for (let i = cursorTrails.length - 1; i >= 0; i--) {
      const sp = cursorTrails[i];
      sp.alpha -= 0.04;
      sp.size *= 0.95;
      if (sp.alpha <= 0) {
        cursorTrails.splice(i, 1);
      } else {
        bgCtx.save();
        bgCtx.beginPath();
        bgCtx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        bgCtx.fillStyle = sp.color;
        bgCtx.globalAlpha = sp.alpha;
        bgCtx.shadowBlur = 6;
        bgCtx.shadowColor = sp.color;
        bgCtx.fill();
        bgCtx.restore();
      }
    }

    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const bp = burstParticles[i];
      bp.update();
      bp.draw(bgCtx);
      if (bp.alpha <= 0) burstParticles.splice(i, 1);
    }

    requestAnimationFrame(loopGlobalParticles);
  }
  loopGlobalParticles();

  /* ==========================================================================
     SILKY MOBILE POINTER CAPTURE DRAG SYSTEM
     ========================================================================== */
  let isDragging = false;
  let activePointerId = null;
  let startY = 0;
  let currentY = 0;
  const maxPull = isMobile ? 100 : 115;
  const triggerThreshold = isMobile ? 68 : 80;
  let hasTriggered = false;
  let lastHeartbeatTime = 0;

  function onPointerDown(e) {
    if (hasTriggered) return;
    initAudio();
    playHeartbeatSound(85);
    
    isDragging = true;
    activePointerId = e.pointerId;
    pullHandle.setPointerCapture(e.pointerId);
    
    startY = e.clientY;
    currentY = 0;
    pullHandle.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging || e.pointerId !== activePointerId || hasTriggered) return;
    
    const delta = Math.max(0, Math.min(maxPull, e.clientY - startY));
    currentY = delta;
    const progress = currentY / maxPull;

    pullHandle.style.transform = `translate(-50%, ${currentY}px)`;

    const curveMidX = 100 + (Math.random() - 0.5) * (progress * 6);
    const curveMidY = 10 + currentY * 0.55;
    const endY = 10 + currentY;
    pullString.setAttribute('d', `M 100 10 Q ${curveMidX} ${curveMidY} 100 ${endY}`);

    const heartScale = 1 + progress * 0.32;
    mainHeart.style.transform = `scale(${heartScale})`;
    glowAura.style.transform = `scale(${0.85 + progress * 1.05})`;
    glowAura.style.opacity = `${0.7 + progress * 0.3}`;

    const now = Date.now();
    const interval = Math.max(220, 650 - progress * 430);
    if (now - lastHeartbeatTime > interval) {
      playHeartbeatSound(70 + progress * 40);
      lastHeartbeatTime = now;
    }

    if (Math.random() > 0.6) {
      const rect = pullHandle.getBoundingClientRect();
      burstParticles.push(
        new BurstParticle(rect.left + rect.width / 2, rect.top + rect.height / 2)
      );
    }
  }

  function onPointerUp(e) {
    if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
    isDragging = false;
    
    try {
      if (pullHandle.hasPointerCapture(e.pointerId)) {
        pullHandle.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    activePointerId = null;

    if (currentY >= triggerThreshold) {
      triggerRomanticSurprise();
    } else {
      pullHandle.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      pullHandle.style.transform = `translate(-50%, 0px)`;
      pullString.setAttribute('d', `M 100 10 Q 100 10 100 10`);

      mainHeart.style.transform = 'scale(1)';
      glowAura.style.transform = 'scale(0.85)';
      glowAura.style.opacity = '0.75';
    }
  }

  pullHandle.addEventListener('pointerdown', onPointerDown);
  pullHandle.addEventListener('pointermove', onPointerMove);
  pullHandle.addEventListener('pointerup', onPointerUp);
  pullHandle.addEventListener('pointercancel', onPointerUp);

  // Tap Fallback on Heart
  mainHeart.addEventListener('click', () => {
    initAudio();
    if (!hasTriggered) triggerRomanticSurprise();
  });

  /* ==========================================================================
     SURPRISE TRIGGER & TRANSITION SEQUENCE
     ========================================================================== */
  function triggerRomanticSurprise() {
    if (hasTriggered) return;
    hasTriggered = true;

    initAudio();
    playMagicBurstChord();

    pullHandle.style.transition = 'transform 0.25s ease-in';
    pullHandle.style.transform = `translate(-50%, 0px)`;
    pullString.setAttribute('d', `M 100 10 Q 100 10 100 10`);

    mainHeart.style.transform = 'scale(1.4)';
    glowAura.style.transform = 'scale(2.6)';
    glowAura.style.opacity = '1';

    const heartRect = mainHeart.getBoundingClientRect();
    const centerX = heartRect.left + heartRect.width / 2;
    const centerY = heartRect.top + heartRect.height / 2;
    const burstCount = isMobile ? 55 : 85;
    for (let i = 0; i < burstCount; i++) {
      burstParticles.push(new BurstParticle(centerX, centerY));
    }

    setTimeout(() => {
      scenePull.classList.remove('active');
      birthdayApp.classList.add('theme-magenta');
      sceneReveal.classList.add('active');

      setTimeout(() => wordHappy.classList.add('show'), 350);
      setTimeout(() => wordBirthday.classList.add('show'), 950);
      setTimeout(() => wordLover.classList.add('show'), 1550);

      setTimeout(() => playRomanticChime(528), 400);
      setTimeout(() => playRomanticChime(659.25), 1000);
      setTimeout(() => playRomanticChime(783.99), 1600);

      setTimeout(() => {
        sceneReveal.classList.remove('active');
        birthdayApp.classList.remove('theme-magenta');
        sceneTree.classList.add('active');

        setTimeout(() => {
          treeHint.classList.add('show');
          startRomanticTreeAnimation();
        }, 500);
      }, 4000);
    }, 600);
  }

  /* ==========================================================================
     HEART-SCULPTED TREE ARCHITECTURE (MOBILE OPTIMIZED)
     ========================================================================== */
  let treeAnimId = null;
  let treeBranches = [];
  let treeBlossoms = [];
  let isTreeGrowing = false;

  function getHeartPoint(t, scale, centerX, centerY) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {
      x: centerX + x * scale,
      y: centerY + y * scale,
    };
  }

  function generateDenseHeartBlossoms(count, centerX, centerY, scale) {
    const list = [];
    const colorPalette = [
      '#ff2a6d', '#ff4d7e', '#ff758f', '#ff99ac', '#ffccd5', '#ffd166', '#fff0f3', '#ff0054'
    ];

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const rRatio = Math.pow(Math.random(), 0.72);
      const rScale = rRatio * scale;
      const p = getHeartPoint(t, rScale, centerX, centerY);

      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;

      const types = ['sakura5', 'roseBud', 'goldSpark', 'miniHeart', 'peachOrb'];
      const type = types[Math.floor(Math.random() * types.length)];
      const maxRadius = Math.random() * 6.5 + (isMobile ? 3.5 : 4.5);
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      list.push({
        x: p.x + jitterX,
        y: p.y + jitterY,
        type: type,
        maxRadius: maxRadius,
        currentRadius: 0,
        color: color,
        growthDelay: Math.random() * 200 + 40,
        rotation: Math.random() * Math.PI * 2,
        swayOffset: Math.random() * Math.PI * 2,
        isFairyLight: Math.random() > 0.85,
      });
    }
    return list;
  }

  class CurvedBranch {
    constructor(startX, startY, ctrlX, ctrlY, endX, endY, startWidth, endWidth, delay = 0) {
      this.startX = startX;
      this.startY = startY;
      this.ctrlX = ctrlX;
      this.ctrlY = ctrlY;
      this.endX = endX;
      this.endY = endY;
      this.startWidth = startWidth;
      this.endWidth = endWidth;
      this.delay = delay;
      this.progress = 0;
      this.growthSpeed = Math.random() * 0.018 + 0.024;
      this.finished = false;
    }

    update(frameCount) {
      if (frameCount < this.delay) return;
      if (this.progress < 1) {
        this.progress += this.growthSpeed;
        if (this.progress >= 1) {
          this.progress = 1;
          this.finished = true;
        }
      }
    }

    draw(ctx) {
      if (this.progress <= 0) return;

      const t = this.progress;
      const curEndX = Math.pow(1 - t, 2) * this.startX + 2 * (1 - t) * t * this.ctrlX + Math.pow(t, 2) * this.endX;
      const curEndY = Math.pow(1 - t, 2) * this.startY + 2 * (1 - t) * t * this.ctrlY + Math.pow(t, 2) * this.endY;
      const curCtrlX = (1 - t) * this.startX + t * this.ctrlX;
      const curCtrlY = (1 - t) * this.startY + t * this.ctrlY;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.quadraticCurveTo(curCtrlX, curCtrlY, curEndX, curEndY);

      const grad = ctx.createLinearGradient(this.startX, this.startY, this.endX, this.endY);
      grad.addColorStop(0, '#3a1f18');
      grad.addColorStop(1, '#562b22');

      ctx.strokeStyle = grad;
      ctx.lineWidth = this.startWidth * (1 - t * 0.45);
      ctx.lineCap = 'round';
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(58, 31, 24, 0.35)';
      ctx.stroke();
      ctx.restore();
    }
  }

  function buildHeartSculptedBranches(trunkX, trunkY, crownCenterX, crownCenterY, scale) {
    const branches = [];

    // Intertwined Trunks
    branches.push(new CurvedBranch(trunkX - 6, trunkY, trunkX - 10, trunkY - 38, trunkX - 5, trunkY - 68, 9, 6.5, 0));
    branches.push(new CurvedBranch(trunkX + 6, trunkY, trunkX + 10, trunkY - 38, trunkX + 5, trunkY - 68, 9, 6.5, 0));
    branches.push(new CurvedBranch(trunkX - 5, trunkY - 68, trunkX, trunkY - 95, trunkX, trunkY - 118, 7.5, 5, 18));

    // Left Atrium Sweeps
    const leftPeak = getHeartPoint(-Math.PI * 0.65, scale * 0.85, crownCenterX, crownCenterY);
    const leftCleft = getHeartPoint(-Math.PI * 0.25, scale * 0.7, crownCenterX, crownCenterY);
    const leftOuter = getHeartPoint(-Math.PI * 0.85, scale * 0.78, crownCenterX, crownCenterY);

    branches.push(new CurvedBranch(trunkX, trunkY - 118, trunkX - scale * 7, trunkY - 130, leftPeak.x, leftPeak.y, 6, 3, 35));
    branches.push(new CurvedBranch(trunkX - scale * 4, trunkY - 125, trunkX - scale * 10, leftOuter.y + 16, leftOuter.x, leftOuter.y, 4.5, 2, 50));
    branches.push(new CurvedBranch(leftPeak.x, leftPeak.y, leftPeak.x + 12, leftPeak.y - 16, leftCleft.x, leftCleft.y, 3, 1.2, 70));

    // Right Atrium Sweeps
    const rightPeak = getHeartPoint(Math.PI * 0.65, scale * 0.85, crownCenterX, crownCenterY);
    const rightCleft = getHeartPoint(Math.PI * 0.25, scale * 0.7, crownCenterX, crownCenterY);
    const rightOuter = getHeartPoint(Math.PI * 0.85, scale * 0.78, crownCenterX, crownCenterY);

    branches.push(new CurvedBranch(trunkX, trunkY - 118, trunkX + scale * 7, trunkY - 130, rightPeak.x, rightPeak.y, 6, 3, 35));
    branches.push(new CurvedBranch(trunkX + scale * 4, trunkY - 125, trunkX + scale * 10, rightOuter.y + 16, rightOuter.x, rightOuter.y, 4.5, 2, 50));
    branches.push(new CurvedBranch(rightPeak.x, rightPeak.y, rightPeak.x - 12, rightPeak.y - 16, rightCleft.x, rightCleft.y, 3, 1.2, 70));

    // Center Top Cleft
    const centerDip = getHeartPoint(0, scale * 0.55, crownCenterX, crownCenterY);
    branches.push(new CurvedBranch(trunkX, trunkY - 118, trunkX, centerDip.y + 20, centerDip.x, centerDip.y, 4, 1.5, 45));

    // Sub-branches
    const subCount = isMobile ? 8 : 12;
    for (let i = 0; i < subCount; i++) {
      const isLeft = i % 2 === 0;
      const t = (isLeft ? -1 : 1) * (0.3 + Math.random() * 2.2);
      const target = getHeartPoint(t, scale * (0.4 + Math.random() * 0.45), crownCenterX, crownCenterY);
      const startBaseX = trunkX + (isLeft ? -1 : 1) * (Math.random() * 20);
      const startBaseY = trunkY - (75 + Math.random() * 45);

      branches.push(
        new CurvedBranch(
          startBaseX,
          startBaseY,
          (startBaseX + target.x) / 2 + (Math.random() - 0.5) * 12,
          (startBaseY + target.y) / 2,
          target.x,
          target.y,
          2.5,
          1.0,
          55 + i * 4
        )
      );
    }

    return branches;
  }

  function startRomanticTreeAnimation() {
    if (isTreeGrowing) return;
    isTreeGrowing = true;

    resizeCanvases();

    const rect = treeContainer.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;

    const trunkX = cWidth / 2;
    const trunkY = cHeight - (isMobile ? 8 : 12);
    const crownCenterX = cWidth / 2;
    const crownCenterY = cHeight * (isMobile ? 0.35 : 0.38);
    const crownScale = Math.min(cWidth, cHeight) / (isMobile ? 48 : 44);

    treeBranches = buildHeartSculptedBranches(trunkX, trunkY, crownCenterX, crownCenterY, crownScale);
    
    // Performance adjusted blossom count
    const blossomCount = isMobile ? 480 : 750;
    treeBlossoms = generateDenseHeartBlossoms(blossomCount, crownCenterX, crownCenterY, crownScale);

    let frameCount = 0;
    let blossomsCompleted = 0;
    let hasPlayedChimeBloom = false;

    function renderTree() {
      const rect = treeContainer.getBoundingClientRect();
      treeCtx.clearRect(0, 0, rect.width, rect.height);
      frameCount++;

      for (let branch of treeBranches) {
        branch.update(frameCount);
        branch.draw(treeCtx);
      }

      if (frameCount === 65 && !hasPlayedChimeBloom) {
        hasPlayedChimeBloom = true;
        playRomanticChime(587.33);
        setTimeout(() => playRomanticChime(783.99), 350);
        setTimeout(() => playRomanticChime(1046.5), 700);
      }

      blossomsCompleted = 0;

      for (let b of treeBlossoms) {
        if (frameCount > b.growthDelay) {
          if (b.currentRadius < b.maxRadius) {
            b.currentRadius += 0.34;
          } else {
            blossomsCompleted++;
          }

          const swayX = Math.sin(frameCount * 0.035 + b.swayOffset) * 1.2;
          const swayY = Math.cos(frameCount * 0.035 + b.swayOffset) * 0.8;

          treeCtx.save();
          treeCtx.translate(b.x + swayX, b.y + swayY);
          treeCtx.rotate(b.rotation);

          if (b.type === 'sakura5') {
            treeCtx.fillStyle = b.color;
            const petals = 5;
            for (let p = 0; p < petals; p++) {
              treeCtx.beginPath();
              const angle = (p * Math.PI * 2) / petals;
              const px = Math.cos(angle) * (b.currentRadius * 0.62);
              const py = Math.sin(angle) * (b.currentRadius * 0.62);
              treeCtx.arc(px, py, b.currentRadius * 0.48, 0, Math.PI * 2);
              treeCtx.fill();
            }
            treeCtx.beginPath();
            treeCtx.arc(0, 0, b.currentRadius * 0.25, 0, Math.PI * 2);
            treeCtx.fillStyle = '#fff085';
            treeCtx.fill();
          } else if (b.type === 'miniHeart') {
            const s = b.currentRadius / 10;
            treeCtx.fillStyle = b.color;
            treeCtx.beginPath();
            treeCtx.moveTo(0, 0);
            treeCtx.bezierCurveTo(-4.5 * s, -6.5 * s, -11 * s, 0, 0, 10 * s);
            treeCtx.bezierCurveTo(11 * s, 0, 4.5 * s, -6.5 * s, 0, 0);
            treeCtx.shadowBlur = 6;
            treeCtx.shadowColor = 'rgba(255, 42, 109, 0.5)';
            treeCtx.fill();
          } else if (b.type === 'roseBud') {
            treeCtx.fillStyle = b.color;
            treeCtx.beginPath();
            treeCtx.arc(0, 0, b.currentRadius * 0.65, 0, Math.PI * 2);
            treeCtx.fill();
            treeCtx.beginPath();
            treeCtx.arc(b.currentRadius * 0.2, -b.currentRadius * 0.15, b.currentRadius * 0.38, 0, Math.PI * 2);
            treeCtx.fillStyle = '#ffffff';
            treeCtx.globalAlpha = 0.35;
            treeCtx.fill();
          } else {
            treeCtx.beginPath();
            treeCtx.arc(0, 0, b.currentRadius * 0.55, 0, Math.PI * 2);
            treeCtx.fillStyle = b.color;
            treeCtx.shadowBlur = 8;
            treeCtx.shadowColor = b.color;
            treeCtx.fill();
          }

          if (b.isFairyLight && b.currentRadius >= b.maxRadius * 0.8) {
            const twinkle = (Math.sin(frameCount * 0.08 + b.swayOffset * 2) + 1) / 2;
            treeCtx.beginPath();
            treeCtx.arc(0, 0, 2.2 * twinkle + 1, 0, Math.PI * 2);
            treeCtx.fillStyle = '#ffffff';
            treeCtx.shadowBlur = 10;
            treeCtx.shadowColor = '#ffe066';
            treeCtx.fill();
          }

          treeCtx.restore();
        }
      }

      if (blossomsCompleted > treeBlossoms.length * 0.8) {
        finalMessage.classList.add('show');
      }

      treeAnimId = requestAnimationFrame(renderTree);
    }

    renderTree();
  }

  // Mobile Tap for Extra Shower
  sceneTree.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#replayBtn')) return;
    initAudio();
    playRomanticChime(Math.random() * 300 + 520);
    const count = isMobile ? 10 : 16;
    for (let i = 0; i < count; i++) {
      burstParticles.push(new BurstParticle(e.clientX, e.clientY));
    }
  });

  /* ==========================================================================
     REPLAY / RESET LOGIC
     ========================================================================== */
  replayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (treeAnimId) cancelAnimationFrame(treeAnimId);
    isTreeGrowing = false;
    hasTriggered = false;

    const rect = treeContainer.getBoundingClientRect();
    treeCtx.clearRect(0, 0, rect.width, rect.height);
    finalMessage.classList.remove('show');
    treeHint.classList.remove('show');

    wordHappy.classList.remove('show');
    wordBirthday.classList.remove('show');
    wordLover.classList.remove('show');

    birthdayApp.classList.remove('theme-magenta');
    sceneTree.classList.remove('active');
    sceneReveal.classList.remove('active');

    pullHandle.style.transform = 'translate(-50%, 0)';
    pullString.setAttribute('d', 'M 100 10 Q 100 10 100 10');
    mainHeart.style.transform = 'scale(1)';
    glowAura.style.transform = 'scale(0.85)';
    glowAura.style.opacity = '0.75';

    setTimeout(() => {
      scenePull.classList.add('active');
    }, 200);
  });

  // Initial setup
  resizeCanvases();

})();