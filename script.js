/**
 * AfterDLifex Portfolio — ULTIMATE COSMIC SCRIPTS
 * All Famous Cosmic Events + Scroll Animations + Spaceship Cursor
 * Particle system, scroll animations, tabs, counters, cosmic events
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    particleCount: { desktop: 200, tablet: 100, mobile: 50 },
    cosmicEvents: [
      'black-hole', 'supernova', 'nebula-rebirth', 'wormhole',
      'quasar', 'pulsar', 'gamma-burst', 'solar-system',
      'aurora', 'asteroid-belt', 'cosmic-web'
    ],
    scrollThreshold: 0.3,
    isTouch: window.matchMedia('(pointer: coarse)').matches,
    isMobile: window.innerWidth < 768
  };

  // ==========================================
  // SPACESHIP CURSOR
  // ==========================================
  const spaceship = document.getElementById('spaceshipCursor');
  let mouseX = 0, mouseY = 0;
  let shipX = 0, shipY = 0;
  let velocityX = 0, velocityY = 0;
  let isMoving = false;
  let moveTimeout = null;

  function initSpaceshipCursor() {
    if (CONFIG.isTouch || !spaceship) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      spaceship.classList.add('moving');

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
        spaceship.classList.remove('moving');
      }, 100);
    });

    document.querySelectorAll('a, button, .btn, .install-tab, .copy-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        spaceship.style.transform = `translate(${shipX - 12}px, ${shipY - 12}px) scale(1.3)`;
      });
      el.addEventListener('mouseleave', () => {
        spaceship.style.transform = `translate(${shipX - 12}px, ${shipY - 12}px) scale(1)`;
      });
    });

    animateSpaceship();
  }

  function animateSpaceship() {
    if (!spaceship) return;

    // Follow exact mouse position instantly
    shipX = mouseX;
    shipY = mouseY;

    // Calculate velocity for rotation and trail effects only
    const dx = mouseX - (spaceship._lastX || mouseX);
    const dy = mouseY - (spaceship._lastY || mouseY);
    spaceship._lastX = mouseX;
    spaceship._lastY = mouseY;

    velocityX = dx;
    velocityY = dy;

    const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI) + 90;
    const speed = Math.sqrt(dx * dx + dy * dy);

    spaceship.style.transform = `translate(${shipX - 12}px, ${shipY - 12}px) rotate(${angle}deg)`;

    if (speed > 3 && isMoving) spawnTrailParticle(shipX, shipY, angle);
    if (speed > 8 && isMoving && Math.random() > 0.7) spawnWarpLine(shipX, shipY, angle);

    requestAnimationFrame(animateSpaceship);
  }

  function spawnTrailParticle(x, y, angle) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    const colors = [
      'rgba(124, 140, 253, 0.8)', 'rgba(168, 85, 247, 0.7)',
      'rgba(255, 126, 179, 0.6)', 'rgba(52, 211, 153, 0.5)', 'rgba(212, 168, 83, 0.6)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = (x + (Math.random() - 0.5) * 8) + 'px';
    particle.style.top = (y + (Math.random() - 0.5) * 8) + 'px';
    particle.style.width = (Math.random() * 3 + 2) + 'px';
    particle.style.height = particle.style.width;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
  }

  function spawnWarpLine(x, y, angle) {
    const line = document.createElement('div');
    line.className = 'warp-line';
    line.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
    line.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
    line.style.transform = `rotate(${angle + 180}deg)`;
    document.body.appendChild(line);
    setTimeout(() => line.remove(), 400);
  }

  // ==========================================
  // PARTICLE SYSTEM (Stars)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animationId = null;
  let canvasMouseX = 0, canvasMouseY = 0;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.1;
      this.speedY = (Math.random() - 0.5) * 0.1;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.color = this.getStarColor();
    }
    getStarColor() {
      const colors = [
        '255, 255, 255', '200, 220, 255', '255, 240, 200',
        '200, 180, 255', '180, 220, 255'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinklePhase += this.twinkleSpeed;

      if (!CONFIG.isTouch) {
        const dx = this.x - canvasMouseX;
        const dy = this.y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity * twinkle})`;
      ctx.fill();

      if (this.size > 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * twinkle * 0.1})`;
        ctx.fill();
      }
    }
  }

  function initParticles() {
    if (!canvas || !ctx) return;
    particles = [];
    const count = CONFIG.isTouch ? CONFIG.particleCount.mobile :
      window.innerWidth < 1024 ? CONFIG.particleCount.tablet :
        CONFIG.particleCount.desktop;
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawConnections() {
    const maxDist = 100;
    const maxConnections = 2;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].size < 0.8) continue;
      let connections = 0;
      for (let j = i + 1; j < particles.length; j++) {
        if (connections >= maxConnections) break;
        if (particles[j].size < 0.8) continue;
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200, 200, 255, ${opacity})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
          connections++;
        }
      }
    }
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  // ==========================================
  // COSMIC EVENT GENERATORS
  // ==========================================

  // Black Hole Accretion Particles
  function initBlackHoleParticles() {
    const container = document.querySelector('.black-hole-container');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'accretion-particle';
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 120;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      particle.style.left = `calc(50% + ${x}px)`;
      particle.style.top = `calc(50% + ${y}px)`;
      particle.style.background = `hsl(${Math.random() * 60 + 240}, 80%, 60%)`;
      particle.style.animation = `accretionOrbit ${3 + Math.random() * 4}s linear infinite`;
      particle.style.animationDelay = `-${Math.random() * 5}s`;
      container.appendChild(particle);
    }
  }

  // Supernova Debris
  function initSupernovaDebris() {
    const container = document.querySelector('.supernova-container');
    if (!container) return;

    for (let i = 0; i < 80; i++) {
      const debris = document.createElement('div');
      debris.className = 'supernova-debris';
      const angle = (Math.PI * 2 / 80) * i + Math.random() * 0.5;
      const distance = 60 + Math.random() * 180;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      debris.style.left = `calc(50% + ${x}px)`;
      debris.style.top = `calc(50% + ${y}px)`;
      debris.style.width = (Math.random() * 3 + 1) + 'px';
      debris.style.height = debris.style.width;
      debris.style.background = `hsl(${Math.random() * 60 + 10}, 100%, ${60 + Math.random() * 40}%)`;
      debris.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px ${debris.style.background}`;
      debris.style.animation = `debrisFloat ${2 + Math.random() * 3}s ease-in-out infinite alternate`;
      debris.style.animationDelay = `-${Math.random() * 2}s`;
      container.appendChild(debris);
    }
  }

  // Nebula Star Birth
  function initNebulaStars() {
    const container = document.querySelector('.nebula-rebirth-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'nebula-star-birth';
      star.style.left = (20 + Math.random() * 60) + '%';
      star.style.top = (20 + Math.random() * 60) + '%';
      star.style.animationDelay = `-${Math.random() * 3}s`;
      star.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(star);
    }
  }

  // Asteroid Belt
  function initAsteroidBelt() {
    const container = document.querySelector('.asteroid-container');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
      const asteroid = document.createElement('div');
      asteroid.className = 'asteroid';
      const angle = (Math.PI * 2 / 60) * i + Math.random() * 0.3;
      const distance = 140 + Math.random() * 60;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      asteroid.style.left = `calc(50% + ${x}px)`;
      asteroid.style.top = `calc(50% + ${y}px)`;
      asteroid.style.width = (Math.random() * 6 + 2) + 'px';
      asteroid.style.height = (Math.random() * 6 + 2) + 'px';
      asteroid.style.transform = `rotate(${Math.random() * 360}deg)`;
      asteroid.style.animation = `asteroidOrbit ${15 + Math.random() * 20}s linear infinite`;
      asteroid.style.animationDelay = `-${Math.random() * 15}s`;
      container.appendChild(asteroid);
    }
  }

  // Cosmic Web
  function initCosmicWeb() {
    const container = document.querySelector('.cosmic-web-container');
    if (!container) return;

    const nodes = [];
    const nodeCount = 25;

    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'web-node';
      const x = 50 + (Math.random() - 0.5) * 80;
      const y = 50 + (Math.random() - 0.5) * 80;
      node.style.left = x + '%';
      node.style.top = y + '%';
      node.style.animationDelay = `-${Math.random() * 3}s`;
      container.appendChild(node);
      nodes.push({ x, y, el: node });
    }

    // Create filaments between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          const filament = document.createElement('div');
          filament.className = 'web-filament';
          const midX = (nodes[i].x + nodes[j].x) / 2;
          const midY = (nodes[i].y + nodes[j].y) / 2;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          filament.style.left = midX + '%';
          filament.style.top = midY + '%';
          filament.style.width = dist + '%';
          filament.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
          filament.style.animationDelay = `-${Math.random() * 4}s`;
          container.appendChild(filament);
        }
      }
    }
  }

  // ==========================================
  // COSMIC EVENT BACKGROUND INITIALIZER
  // (Initialize all events immediately since they're background animations now)
  // ==========================================
  function initBGCosmicEvents() {
    // Skip heavy animations on mobile for performance
    if (CONFIG.isMobile) return;

    // Black Hole
    const bhContainer = document.querySelector('#bg-black-hole .black-hole-container');
    if (bhContainer) {
      // Create particles inside the bg container
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'accretion-particle';
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        particle.style.background = `hsl(${Math.random() * 60 + 240}, 80%, 60%)`;
        particle.style.animation = `accretionOrbit ${3 + Math.random() * 4}s linear infinite`;
        particle.style.animationDelay = `-${Math.random() * 5}s`;
        bhContainer.appendChild(particle);
      }
    }

    // Supernova
    const snContainer = document.querySelector('#bg-supernova .supernova-container');
    if (snContainer) {
      for (let i = 0; i < 40; i++) {
        const debris = document.createElement('div');
        debris.className = 'supernova-debris';
        const angle = (Math.PI * 2 / 40) * i + Math.random() * 0.5;
        const distance = 30 + Math.random() * 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        debris.style.left = `calc(50% + ${x}px)`;
        debris.style.top = `calc(50% + ${y}px)`;
        debris.style.width = (Math.random() * 3 + 1) + 'px';
        debris.style.height = debris.style.width;
        debris.style.background = `hsl(${Math.random() * 60 + 10}, 100%, ${60 + Math.random() * 40}%)`;
        debris.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px ${debris.style.background}`;
        debris.style.animation = `debrisFloat ${2 + Math.random() * 3}s ease-in-out infinite alternate`;
        debris.style.animationDelay = `-${Math.random() * 2}s`;
        snContainer.appendChild(debris);
      }
    }

    // Nebula Stars
    const nbContainer = document.querySelector('#bg-nebula-rebirth .nebula-rebirth-container');
    if (nbContainer) {
      for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'nebula-star-birth';
        star.style.left = (20 + Math.random() * 60) + '%';
        star.style.top = (20 + Math.random() * 60) + '%';
        star.style.animationDelay = `-${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 2}s`;
        nbContainer.appendChild(star);
      }
    }

    // Asteroid Belt
    const astContainer = document.querySelector('#bg-asteroid-belt .asteroid-container');
    if (astContainer) {
      for (let i = 0; i < 30; i++) {
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        const angle = (Math.PI * 2 / 30) * i + Math.random() * 0.3;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        asteroid.style.left = `calc(50% + ${x}px)`;
        asteroid.style.top = `calc(50% + ${y}px)`;
        asteroid.style.width = (Math.random() * 6 + 2) + 'px';
        asteroid.style.height = (Math.random() * 6 + 2) + 'px';
        asteroid.style.transform = `rotate(${Math.random() * 360}deg)`;
        asteroid.style.animation = `asteroidOrbit ${15 + Math.random() * 20}s linear infinite`;
        asteroid.style.animationDelay = `-${Math.random() * 15}s`;
        astContainer.appendChild(asteroid);
      }
    }

    // Cosmic Web
    const cwContainer = document.querySelector('#bg-cosmic-web .cosmic-web-container');
    if (cwContainer) {
      const nodes = [];
      const nodeCount = 15;
      const containerWidth = cwContainer.offsetWidth || 200;

      for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'web-node';
        const x = 30 + (Math.random() - 0.5) * 60;
        const y = 30 + (Math.random() - 0.5) * 60;
        node.style.left = x + '%';
        node.style.top = y + '%';
        node.style.animationDelay = `-${Math.random() * 3}s`;
        cwContainer.appendChild(node);
        nodes.push({ x, y, el: node });
      }

      // Create filaments between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) {
            const filament = document.createElement('div');
            filament.className = 'web-filament';
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            filament.style.left = midX + '%';
            filament.style.top = midY + '%';
            filament.style.width = dist + '%';
            filament.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            filament.style.animationDelay = `-${Math.random() * 4}s`;
            cwContainer.appendChild(filament);
          }
        }
      }
    }
  }

  // ==========================================
  // NAVIGATION
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  function initNav() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
      updateActiveNav();
    });

    navToggle?.addEventListener('click', () => navLinks.classList.toggle('active'));

    navLinkItems.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          navLinks.classList.remove('active');
        }
      });
    });
  }

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }

  // ==========================================
  // SCROLL REVEAL (AOS-like)
  // ==========================================
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 1500;
    const stepTime = duration / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, stepTime);
  }

  // ==========================================
  // INSTALL TABS
  // ==========================================
  function initInstallTabs() {
    const tabs = document.querySelectorAll('.install-tab');
    const contents = document.querySelectorAll('.install-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        contents.forEach(c => c.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  // ==========================================
  // COPY TO CLIPBOARD
  // ==========================================
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
          btn.classList.add('copied');
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>`;
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
          }, 2000);
        } catch (err) { console.error('Copy failed:', err); }
      });
    });
  }

  // ==========================================
  // PARALLAX ON SCROLL (RAF-throttled for smoothness)
  // ==========================================
  function initParallax() {
    if (CONFIG.isTouch) return;
    const nebulas = document.querySelectorAll('.nebula');
    const planets = document.querySelectorAll('.planet');
    const sun = document.querySelector('.sun-container');
    const galaxy = document.querySelector('.galaxy-container');
    let lastScrollY = 0;
    let ticking = false;

    function applyParallax() {
      const scrollY = lastScrollY;
      nebulas.forEach((neb, i) => {
        const speed = 0.05 + (i * 0.02);
        neb.style.transform = `translateY(${scrollY * speed}px)`;
      });
      if (sun) sun.style.transform = `translateY(${scrollY * 0.03}px)`;
      if (galaxy) galaxy.style.transform = `translateY(${scrollY * 0.04}px)`;
      planets.forEach((planet, i) => {
        const speed = 0.08 + (i * 0.03);
        planet.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================
  // THEME TAG GLOW
  // ==========================================
  function initThemeTags() {
    document.querySelectorAll('.theme-tag').forEach(tag => {
      const accent = tag.style.getPropertyValue('--accent');
      if (accent) {
        tag.addEventListener('mouseenter', () => {
          tag.style.borderColor = accent;
          tag.style.color = accent;
          tag.style.boxShadow = `0 0 12px ${accent}40`;
        });
        tag.addEventListener('mouseleave', () => {
          tag.style.borderColor = '';
          tag.style.color = '';
          tag.style.boxShadow = '';
        });
      }
    });
  }

  // ==========================================
  // COSMIC EVENT KEYBOARD SHORTCUTS
  // ==========================================
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === '1') scrollToEvent('black-hole');
      if (e.key === '2') scrollToEvent('supernova');
      if (e.key === '3') scrollToEvent('nebula-rebirth');
      if (e.key === '4') scrollToEvent('wormhole');
      if (e.key === '5') scrollToEvent('quasar');
      if (e.key === '6') scrollToEvent('pulsar');
      if (e.key === '7') scrollToEvent('gamma-burst');
      if (e.key === '8') scrollToEvent('solar-system');
      if (e.key === '9') scrollToEvent('aurora');
      if (e.key === '0') scrollToEvent('asteroid-belt');
    });
  }

  function scrollToEvent(eventId) {
    const el = document.querySelector(`[data-cosmic-event="${eventId}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ==========================================
  // DYNAMIC COSMIC BACKGROUND EFFECTS
  // ==========================================
  function initDynamicBackground() {
    // Add subtle color shift based on scroll position
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / maxScroll;

      // Shift background hue slightly based on scroll
      const hue = 240 + progress * 60; // Blue to purple range
      document.documentElement.style.setProperty('--bg-shift-hue', hue);

      lastScroll = scrollY;
    });
  }

  // ==========================================
  // INITIALIZE EVERYTHING
  // ==========================================
  function init() {
    resizeCanvas();
    initParticles();
    animateParticles();
    initSpaceshipCursor();
    initNav();
    initScrollReveal();
    initCounters();
    initInstallTabs();
    initCopyButtons();
    initParallax();
    initThemeTags();
    initBGCosmicEvents();
    initKeyboardShortcuts();
    initDynamicBackground();

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
        // Update mobile flag on resize
        CONFIG.isMobile = window.innerWidth < 768;
      }, 250);
    });

    // Visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animationId);
      else animateParticles();
    });

    // Canvas mouse tracking
    if (canvas && !CONFIG.isTouch) {
      canvas.addEventListener('mousemove', (e) => {
        canvasMouseX = e.clientX;
        canvasMouseY = e.clientY;
      });
    }
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();