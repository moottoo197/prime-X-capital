/**
 * PRIME X CAPITAL - HIGH-PERFORMANCE 3D INTERACTIVE ENGINE
 * Real-time 3D Particle Space, Hologram Liquidity Core, and 3D Card Physics
 * Ultra-optimized for mobile 60fps & desktop fidelity without main-thread blocking
 */

(function () {
  'use strict';

  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth <= 768 ||
    ('ontouchstart' in window && window.innerWidth < 1024) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '')
  );

  const Engine3D = {
    isMobile,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false },
    dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2),
    isTabVisible: !document.hidden,

    init() {
      // Listen for tab visibility changes to pause all rendering when tab is hidden
      document.addEventListener('visibilitychange', () => {
        this.isTabVisible = !document.hidden;
      });

      // Defer boot to ensure critical DOM, styles, and API responses render in single-digit milliseconds
      const start = () => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => this.boot(), { timeout: isMobile ? 600 : 300 });
        } else {
          setTimeout(() => this.boot(), isMobile ? 250 : 100);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    },

    boot() {
      // Disabled in Cobalt & White institutional light mode to keep flat crisp surfaces and 60fps
      return;
    },

    initMouseTracking() {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      let lerpRunning = false;

      const lerpMouse = () => {
        if (!this.isTabVisible) {
          lerpRunning = false;
          return;
        }

        const dx = this.mouse.targetX - this.mouse.x;
        const dy = this.mouse.targetY - this.mouse.y;

        this.mouse.x += dx * 0.06;
        this.mouse.y += dy * 0.06;

        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
          requestAnimationFrame(lerpMouse);
        } else {
          lerpRunning = false;
        }
      };

      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = (e.clientX - halfW) / halfW;
        this.mouse.targetY = (e.clientY - halfH) / halfH;
        this.mouse.isHovering = true;
        if (!lerpRunning) {
          lerpRunning = true;
          requestAnimationFrame(lerpMouse);
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouse.targetX = 0;
        this.mouse.targetY = 0;
        this.mouse.isHovering = false;
        if (!lerpRunning) {
          lerpRunning = true;
          requestAnimationFrame(lerpMouse);
        }
      }, { passive: true });
    },

    /* ===================================================================
       1. 3D BACKGROUND PARTICLE & ISOMETRIC CYBER-SPACE (Desktop Only)
       =================================================================== */
    initBackgroundSpace() {
      if (this.isMobile) return; // Prevent mobile GPU contention

      let canvas = document.getElementById('bg-3d-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-3d-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);
      }

      // Add ambient blur orbs if not present on desktop
      if (!document.querySelector('.ambient-glow-layer')) {
        const glowLayer = document.createElement('div');
        glowLayer.className = 'ambient-glow-layer';
        glowLayer.innerHTML = `
          <div class="ambient-orb ambient-orb-1"></div>
          <div class="ambient-orb ambient-orb-2"></div>
          <div class="ambient-orb ambient-orb-3"></div>
        `;
        document.body.insertBefore(glowLayer, document.body.firstChild);
      }

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth * this.dpr);
      let height = (canvas.height = window.innerHeight * this.dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';

      let resizeTimeout = null;
      const resize = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          width = canvas.width = window.innerWidth * this.dpr;
          height = canvas.height = window.innerHeight * this.dpr;
          canvas.style.width = window.innerWidth + 'px';
          canvas.style.height = window.innerHeight + 'px';
        }, 120);
      };
      window.addEventListener('resize', resize, { passive: true });

      const particleCount = 28;
      const points = [];
      const spreadX = 1400;
      const spreadY = 1200;
      const spreadZ = 900;

      for (let i = 0; i < particleCount; i++) {
        points.push({
          x: (Math.random() - 0.5) * spreadX,
          y: (Math.random() - 0.5) * spreadY,
          z: (Math.random() - 0.5) * spreadZ,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          vz: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.6 + 1,
          colorType: Math.random() > 0.65 ? 'cyan' : (Math.random() > 0.4 ? 'emerald' : 'white'),
          pulse: Math.random() * Math.PI * 2
        });
      }

      const fov = 650;
      let rotX = 0;
      let rotY = 0;
      let lastFrame = 0;
      const frameInterval = 28; // ~35 FPS on desktop keeps CPU usage < 1%

      const render = (time) => {
        if (!this.isTabVisible) {
          setTimeout(() => requestAnimationFrame(render), 300);
          return;
        }

        if (time - lastFrame < frameInterval) {
          requestAnimationFrame(render);
          return;
        }
        lastFrame = time;

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        rotY += (this.mouse.x * 0.25 - rotY) * 0.04;
        rotX += (this.mouse.y * 0.2 - rotX) * 0.04;

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const projected = [];

        for (let i = 0; i < points.length; i++) {
          const p = points[i];

          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.pulse += 0.02;

          if (p.x < -spreadX / 2) p.x = spreadX / 2;
          if (p.x > spreadX / 2) p.x = -spreadX / 2;
          if (p.y < -spreadY / 2) p.y = spreadY / 2;
          if (p.y > spreadY / 2) p.y = -spreadY / 2;
          if (p.z < -spreadZ / 2) p.z = spreadZ / 2;
          if (p.z > spreadZ / 2) p.z = -spreadZ / 2;

          let x1 = p.x * cosY - p.z * sinY;
          let z1 = p.z * cosY + p.x * sinY;
          let y1 = p.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + p.y * sinX;

          const depth = z2 + fov;
          if (depth > 10) {
            const scale = (fov / depth) * this.dpr;
            const px = centerX + x1 * scale;
            const py = centerY + y1 * scale;

            if (px >= 0 && px <= width && py >= 0 && py <= height) {
              const alpha = Math.max(0.12, Math.min(0.65, (depth / (fov * 1.6)) * (0.6 + Math.sin(p.pulse) * 0.25)));
              projected.push({ x: px, y: py, alpha, colorType: p.colorType, size: p.size * scale });
            }
          }
        }

        // Draw connecting constellation lines
        const maxDist = 80 * this.dpr;
        ctx.lineWidth = 0.8 * this.dpr;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
        for (let i = 0; i < projected.length; i++) {
          const p1 = projected[i];
          for (let j = i + 1; j < projected.length; j++) {
            const p2 = projected[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;
            if (dx * dx + dy * dy < maxDist * maxDist) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();

        // Draw 3D nodes
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);

          if (p.colorType === 'cyan') {
            ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
          } else if (p.colorType === 'emerald') {
            ctx.fillStyle = `rgba(0, 192, 135, ${p.alpha})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.5})`;
          }
          ctx.fill();
        }

        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    },

    /* ===================================================================
       2. INTERACTIVE 3D HOLOGRAM LIQUIDITY CORE (ROTATING GEM & RINGS)
       =================================================================== */
    initHologramCore() {
      const canvas = document.getElementById('hero-hologram-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const size = 140;
      canvas.width = size * this.dpr;
      canvas.height = size * this.dpr;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';

      // 3D Diamond / Polyhedron Vertices
      const vertices = [
        { x: 0, y: -45, z: 0 },    // Top Apex
        { x: 34, y: -10, z: 0 },   // Mid Ring 1
        { x: 0, y: -10, z: 34 },   // Mid Ring 2
        { x: -34, y: -10, z: 0 },  // Mid Ring 3
        { x: 0, y: -10, z: -34 },  // Mid Ring 4
        { x: 0, y: 48, z: 0 }      // Bottom Apex
      ];

      const edges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
        [5, 1], [5, 2], [5, 3], [5, 4]
      ];

      let angX = 0.35;
      let angY = 0;
      let velX = 0.006;
      let velY = 0.016;
      let isDragging = false;
      let lastPointerX = 0;
      let lastPointerY = 0;

      const container = canvas.parentElement;
      if (container) {
        const onPointerDown = (e) => {
          isDragging = true;
          const p = e.touches ? e.touches[0] : e;
          lastPointerX = p.clientX;
          lastPointerY = p.clientY;
        };

        const onPointerMove = (e) => {
          if (!isDragging) return;
          const p = e.touches ? e.touches[0] : e;
          const dx = p.clientX - lastPointerX;
          const dy = p.clientY - lastPointerY;

          angY += dx * 0.02;
          angX += dy * 0.02;
          velY = dx * 0.008;
          velX = dy * 0.008;

          lastPointerX = p.clientX;
          lastPointerY = p.clientY;
        };

        const onPointerUp = () => {
          isDragging = false;
        };

        container.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove, { passive: true });
        window.addEventListener('mouseup', onPointerUp, { passive: true });

        container.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp, { passive: true });
      }

      // Orbital Satellites
      const satellites = [
        { angle: 0, radius: 56, speed: 0.035, color: '#00e5ff', size: 3.5, tilt: 0.6 },
        { angle: 2.2, radius: 56, speed: -0.028, color: '#00c087', size: 3, tilt: -0.4 },
        { angle: 4.4, radius: 62, speed: 0.022, color: '#facc15', size: 2.8, tilt: 1.1 }
      ];

      let isVisibleOnScreen = true;
      let holoRafId = null;
      let lastHoloFrame = 0;
      const holoMinInterval = this.isMobile ? 32 : 16; // 30fps on mobile keeps phone cool

      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          const entry = entries[0];
          isVisibleOnScreen = entry.isIntersecting;
          if (isVisibleOnScreen && !holoRafId) {
            holoRafId = requestAnimationFrame(renderHolo);
          }
        }, { threshold: 0.05 });
        obs.observe(canvas);
      }

      const drawRing = (cx, cy, r, tiltX, tiltY, ringRot, strokeStyle, dash = false) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.4 * this.dpr;
        if (dash) ctx.setLineDash([4 * this.dpr, 4 * this.dpr]);

        const steps = this.isMobile ? 24 : 36;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2 + ringRot;
          let rx = Math.cos(theta) * r;
          let rz = Math.sin(theta) * r;
          let ry = 0;

          let y1 = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
          let z1 = rz * Math.cos(tiltX) + ry * Math.sin(tiltX);
          let x1 = rx * Math.cos(tiltY) + z1 * Math.sin(tiltY);
          let z2 = z1 * Math.cos(tiltY) - rx * Math.sin(tiltY);

          const scale = (200 / (200 + z2)) * this.dpr;
          const px = cx + x1 * scale;
          const py = cy + y1 * scale;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      };

      const renderHolo = (time) => {
        if (!isVisibleOnScreen || !this.isTabVisible) {
          holoRafId = null;
          return;
        }

        if (time - lastHoloFrame < holoMinInterval) {
          holoRafId = requestAnimationFrame(renderHolo);
          return;
        }
        lastHoloFrame = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        if (!isDragging) {
          angY += velY;
          angX += velX;
          velX += (0.004 - velX) * 0.04;
          velY += (0.012 - velY) * 0.04;
        }

        const cosY = Math.cos(angY);
        const sinY = Math.sin(angY);
        const cosX = Math.cos(angX);
        const sinX = Math.sin(angX);

        // Inner glowing core
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * this.dpr);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
        grad.addColorStop(0.6, 'rgba(0, 192, 135, 0.16)');
        grad.addColorStop(1, 'rgba(0, 192, 135, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * this.dpr, 0, Math.PI * 2);
        ctx.fill();

        // Outer gimbal rings
        drawRing(cx, cy, 52, 0.8, angY * 0.7, angX * 0.5, 'rgba(0, 229, 255, 0.35)', true);
        drawRing(cx, cy, 58, -0.6, -angY * 0.5, -angX * 0.4, 'rgba(0, 192, 135, 0.4)', false);

        // Project Polyhedron 3D Vertices
        const projVerts = [];
        for (let i = 0; i < vertices.length; i++) {
          const v = vertices[i];
          let x1 = v.x * cosY - v.z * sinY;
          let z1 = v.z * cosY + v.x * sinY;
          let y1 = v.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + v.y * sinX;

          const scale = (220 / (220 + z2)) * this.dpr;
          projVerts.push({
            x: cx + x1 * scale,
            y: cy + y1 * scale,
            z: z2,
            scale
          });
        }

        // Draw Edges
        ctx.lineWidth = 1.5 * this.dpr;
        for (let i = 0; i < edges.length; i++) {
          const [i1, i2] = edges[i];
          const p1 = projVerts[i1];
          const p2 = projVerts[i2];
          const avgZ = (p1.z + p2.z) / 2;
          const edgeAlpha = Math.max(0.25, Math.min(0.9, (avgZ + 40) / 80));

          ctx.strokeStyle = `rgba(0, 229, 255, ${edgeAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Draw Vertices (Skip expensive shadowBlur on mobile)
        const useShadow = !this.isMobile;
        for (let i = 0; i < projVerts.length; i++) {
          const p = projVerts[i];
          const nodeAlpha = Math.max(0.3, Math.min(1, (p.z + 40) / 80));
          ctx.beginPath();
          ctx.arc(p.x, p.y, (i === 0 || i === 5 ? 3.2 : 2.5) * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha})`;
          if (useShadow) {
            ctx.shadowColor = '#00c087';
            ctx.shadowBlur = 6 * this.dpr;
          }
          ctx.fill();
        }
        if (useShadow) ctx.shadowBlur = 0;

        // Orbiting Satellites
        for (let i = 0; i < satellites.length; i++) {
          const s = satellites[i];
          s.angle += s.speed;
          let sx = Math.cos(s.angle) * s.radius;
          let sz = Math.sin(s.angle) * s.radius;
          let sy = Math.sin(s.angle * 2) * 12;

          let y1 = sy * Math.cos(s.tilt) - sz * Math.sin(s.tilt);
          let z1 = sz * Math.cos(s.tilt) + sy * Math.sin(s.tilt);
          let x1 = sx * cosY - z1 * sinY;
          let z2 = z1 * cosY + sx * sinY;

          const scale = (220 / (220 + z2)) * this.dpr;
          const spx = cx + x1 * scale;
          const spy = cy + y1 * scale;

          ctx.beginPath();
          ctx.arc(spx, spy, s.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
        }

        holoRafId = requestAnimationFrame(renderHolo);
      };

      holoRafId = requestAnimationFrame(renderHolo);
    },

    /* ===================================================================
       3. INTERACTIVE 3D CARD TILT & SPECULAR GLARE PHYSICS (Desktop Only)
       =================================================================== */
    initCardTiltPhysics() {
      if (this.isMobile) return; // Completely bypass on mobile for native smooth touch gestures

      const cardSelectors = [
        '.top-ticker-card',
        '.user-balance-hero',
        '.circle-action-item',
        '.hero-3d-hologram-wrap',
        '.countdown-box'
      ];

      const cards = document.querySelectorAll(cardSelectors.join(', '));
      const maxTilt = 8;

      cards.forEach(card => {
        card.classList.add('tilt-card-3d');

        if (!card.querySelector('.tilt-glare')) {
          const glare = document.createElement('div');
          glare.className = 'tilt-glare';
          card.appendChild(glare);
        }

        let animationFrame = null;
        let curRotateX = 0;
        let curRotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;

        const updateTilt = () => {
          curRotateX += (targetRotateX - curRotateX) * 0.15;
          curRotateY += (targetRotateY - curRotateY) * 0.15;

          card.style.transform = `perspective(900px) rotateX(${curRotateX.toFixed(2)}deg) rotateY(${curRotateY.toFixed(2)}deg) translateZ(4px)`;

          if (Math.abs(targetRotateX - curRotateX) > 0.05 || Math.abs(targetRotateY - curRotateY) > 0.05) {
            animationFrame = requestAnimationFrame(updateTilt);
          } else {
            animationFrame = null;
          }
        };

        card.addEventListener('mouseenter', () => {
          card.style.setProperty('--glare-opacity', '1');
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
          card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);

          const normX = (x / rect.width) * 2 - 1;
          const normY = (y / rect.height) * 2 - 1;

          targetRotateX = -normY * maxTilt;
          targetRotateY = normX * maxTilt;

          if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateTilt);
          }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--glare-opacity', '0');
          targetRotateX = 0;
          targetRotateY = 0;
          if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateTilt);
          }
        }, { passive: true });
      });
    },

    refreshTilt() {
      if (!this.isMobile) {
        this.initCardTiltPhysics();
      }
    }
  };

  window.Engine3D = Engine3D;
  Engine3D.init();
})();
