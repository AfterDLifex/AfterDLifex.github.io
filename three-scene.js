/**
 * AfterDLifex Portfolio — Three.js Cosmic Background (Mobile Optimized)
 * Black Hole, Accretion Disk, Nebula Particles, Star Birth, Supernova, Dust Trail
 * Optimized: Pauses when not visible, reduced GPU load on mobile
 */

(function () {
    'use strict';

    const isSmallMobile = window.innerWidth < 500;
    const isMobile = window.innerWidth < 768;

    // On very small mobile, skip Three.js entirely to save GPU
    if (isSmallMobile && window.innerWidth < 360) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isSmallMobile ? 60 : 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false, // Disable antialias on all devices for performance
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(null); // Start paused
    renderer.domElement.id = 'three-canvas';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '-2';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.contain = 'paint style';
    document.body.appendChild(renderer.domElement);

    // Black Hole - low poly on mobile
    const bhSegments = isSmallMobile ? 8 : isMobile ? 12 : 24;
    const blackHoleGeometry = new THREE.SphereGeometry(1, bhSegments, bhSegments);
    const blackHoleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Accretion Disk
    const diskSegments = isSmallMobile ? 8 : isMobile ? 12 : 24;
    const diskGeometry = new THREE.CircleGeometry(2, diskSegments);
    const diskMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    scene.add(disk);

    // Nebula Particles
    let nebulaParticles = [];

    function createNebulaParticles() {
        // Clean up existing
        nebulaParticles.forEach(p => { scene.remove(p.points); p.geometry.dispose(); p.material.dispose(); });
        nebulaParticles = [];

        const particleCount = isSmallMobile ? 20 : isMobile ? 60 : 300;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0x7c8cfd,
            size: isSmallMobile ? 0.04 : isMobile ? 0.06 : 0.1,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const radius = 3 + Math.random() * 5;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        nebulaParticles.push({ points, geometry, material });
    }

    // Star Birth Regions
    let starBirthParticles = [];

    function createStarBirthParticles() {
        starBirthParticles.forEach(p => { scene.remove(p.points); p.geometry.dispose(); p.material.dispose(); });
        starBirthParticles = [];

        const particleCount = isSmallMobile ? 10 : isMobile ? 30 : 100;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0xff7eb3,
            size: isSmallMobile ? 0.02 : isMobile ? 0.03 : 0.05,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        starBirthParticles.push({ points, geometry, material });
    }

    // Supernova - simplified on mobile
    let supernovaActive = false;
    let supernovaParticlesList = [];

    function triggerSupernova() {
        if (supernovaActive || isMobile) return; // Skip supernovae on mobile
        supernovaActive = true;

        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0xff4757,
            size: 0.1,
            transparent: true,
            opacity: 0.9
        });
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 0.1;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            const speed = 0.02 + Math.random() * 0.05;
            velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            velocities[i * 3 + 2] = Math.cos(phi) * speed;
            sizes[i] = 0.05 + Math.random() * 0.1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        supernovaParticlesList = [{ points, geometry, material, positions, sizes, velocities, clock: 0 }];

        setTimeout(() => {
            supernovaActive = false;
            if (supernovaParticlesList.length > 0) {
                scene.remove(supernovaParticlesList[0].points);
                supernovaParticlesList[0].geometry.dispose();
                supernovaParticlesList[0].material.dispose();
                supernovaParticlesList = [];
            }
        }, 3000);
    }

    // Lightning
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Dust trail particles
    let dustParticles = [];

    function createDustParticles(count) {
        dustParticles.forEach(p => { scene.remove(p.points); p.geometry.dispose(); p.material.dispose(); });
        dustParticles = [];

        count = isSmallMobile ? 5 : isMobile ? 10 : 50;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0x7c8cfd,
            size: 0.05,
            transparent: true,
            opacity: 0.7
        });
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const lifetimes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            sizes[i] = 0.02 + Math.random() * 0.03;
            lifetimes[i] = 0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        dustParticles.push({ points, geometry, material, positions, sizes, lifetimes });
    }

    // Animation
    let rotationAngle = 0;
    let nebulaPhase = 0;
    let animationId = null;

    function animate() {
        rotationAngle += 0.005;
        blackHole.rotation.z = rotationAngle;
        disk.rotation.z = rotationAngle * 0.5;

        nebulaPhase += 0.005;
        nebulaParticles.forEach(particle => {
            // Simplified: just move slowly
        });

        starBirthParticles.forEach(particle => {
            const sizeArray = particle.geometry.attributes.size.array;
            for (let i = 0; i < sizeArray.length; i++) {
                sizeArray[i] = 0.03 + 0.02 * Math.sin(Date.now() * 0.002 + i);
            }
            particle.geometry.attributes.size.needsUpdate = true;
        });

        supernovaParticlesList.forEach(particle => {
            particle.clock += 0.016;
            if (particle.clock < 3) {
                const posArray = particle.geometry.attributes.position.array;
                const velArray = particle.geometry.attributes.velocity.array;
                const sizeArray = particle.geometry.attributes.size.array;
                for (let i = 0; i < posArray.length; i += 3) {
                    posArray[i] += velArray[i];
                    posArray[i + 1] += velArray[i + 1];
                    posArray[i + 2] += velArray[i + 2];
                    sizeArray[i / 3] *= 0.99;
                }
                particle.geometry.attributes.position.needsUpdate = true;
                particle.geometry.attributes.size.needsUpdate = true;
            }
        });

        dustParticles.forEach(particle => {
            const posArray = particle.geometry.attributes.position.array;
            const lifetimeArray = particle.geometry.attributes.lifetime.array;
            const sizeArray = particle.geometry.attributes.size.array;
            for (let i = 0; i < lifetimeArray.length; i++) {
                if (lifetimeArray[i] > 0) {
                    lifetimeArray[i] -= 0.016;
                    const index = i * 3;
                    posArray[index] += (Math.random() - 0.5) * 0.01;
                    posArray[index + 1] += (Math.random() - 0.5) * 0.01;
                    posArray[index + 2] += (Math.random() - 0.5) * 0.01;
                    sizeArray[i] = 0.02 * lifetimeArray[i];
                }
            }
            particle.geometry.attributes.position.needsUpdate = true;
            particle.geometry.attributes.lifetime.needsUpdate = true;
            particle.geometry.attributes.size.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    // ===== START/STOP CONTROLS =====
    let isRunning = false;
    let scrollTimer = null;
    let isScrolling = false;

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        renderer.setAnimationLoop(null);
        animationId = requestAnimationFrame(function loop() {
            animate();
            animationId = requestAnimationFrame(loop);
        });
    }

    function stopAnimation() {
        if (!isRunning) return;
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        renderer.setAnimationLoop(null);
    }

    // Start after a small delay
    setTimeout(startAnimation, 500);

    // Pause on scroll to reduce jank
    window.addEventListener('scroll', () => {
        if (!isRunning) return;
        isScrolling = true;
        stopAnimation();
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
            startAnimation();
        }, 200); // Resume 200ms after scroll stops
    }, { passive: true });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    // Resize handler - no page reload
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Recreate with lower settings if needed
        if (window.innerWidth < 500 && !isSmallMobile) {
            location.reload();
        }
    });

    // Initialize
    createNebulaParticles();
    createStarBirthParticles();
    createDustParticles();
})();