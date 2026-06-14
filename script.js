/**
 * AfterDLifex Portfolio — Interactive Scripts
 * Particle system, custom cursor, scroll animations, tabs, counters
 */

(function() {
  'use strict';

  // ==========================================
  // Particle System
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let mouseX = 0;
  let mouseY = 0;
  let isTouch = window.matchMedia('(pointer: coarse)').matches;

  function resizeCanvas() {
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
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = this.getRandomColor();
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }

    getRandomColor() {
      const colors = [
        '124, 140, 253',   // periwinkle
        '255, 126, 179',   // pink
        '52, 211, 153',    // green
        '212, 168, 83',    // gold
        '168, 85, 247'     // purple
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      // Mouse repulsion (desktop only)
      if (!isTouch) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Fade lifecycle
      if (this.life > this.maxLife) {
        this.opacity -= 0.01;
        if (this.opacity <= 0) this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = isTouch ? 40 : 80;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const maxDist = 120;
    const maxConnections = 3;

    for (let i = 0; i < particles.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < particles.length; j++) {
        if (connections >= maxConnections) break;

        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 140, 253, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          connections++;
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  // ==========================================
  // Custom Cursor
  // ==========================================
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  function initCursor() {
    if (isTouch) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX - 3 + 'px';
      cursorDot.style.top = mouseY - 3 + 'px';

      cursorRing.style.left = mouseX - 16 + 'px';
      cursorRing.style.top = mouseY - 16 + 'px';
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .style-card, .project-card, .connect-card, .principle-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.transform = 'scale(1.5)';
        cursorRing.style.borderColor = 'rgba(124, 140, 253, 0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.transform = 'scale(1)';
        cursorRing.style.borderColor = 'rgba(124, 140, 253, 0.4)';
      });
    });
  }

  // ==========================================
  // Navigation
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  function initNav() {
    // Scroll behavior
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Active section highlighting
      updateActiveNav();
    });

    // Mobile toggle
    navToggle?.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Smooth scroll
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
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================
  // Scroll Reveal (AOS-like)
  // ==========================================
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-aos]').forEach(el => {
      observer.observe(el);
    });
  }

  // ==========================================
  // Counter Animation
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
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, stepTime);
  }

  // ==========================================
  // Install Tabs
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
  // Copy to Clipboard
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
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });
    });
  }

  // ==========================================
  // Parallax on Scroll
  // ==========================================
  function initParallax() {
    if (isTouch) return;

    const orbs = document.querySelectorAll('.orb');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.1 + (i * 0.05);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }

  // ==========================================
  // Theme Tag Glow Effect
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
  // Initialize Everything
  // ==========================================
  function init() {
    resizeCanvas();
    initParticles();
    animateParticles();
    initCursor();
    initNav();
    initScrollReveal();
    initCounters();
    initInstallTabs();
    initCopyButtons();
    initParallax();
    initThemeTags();

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 250);
    });

    // Visibility API — pause particles when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animateParticles();
      }
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();