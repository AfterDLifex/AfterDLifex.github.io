/**
 * AfterDLifex Portfolio — Three.js Cosmic Background
 * Black Hole, Accretion Disk, Nebula Particles, Star Birth, Supernova, Dust Trail
 * Uses THREE global from CDN
 */

(function () {
    'use strict';

    const isSmallMobile = window.innerWidth < 500;
    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isSmallMobile ? 60 : 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallMobile ? 1 : isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = 'three-canvas';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '-2';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);

    // Black Hole
    const blackHoleGeometry = new THREE.SphereGeometry(1, isSmallMobile ? 12 : isMobile ? 16 : 32, isSmallMobile ? 12 : isMobile ? 16 : 32);
    const blackHoleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Accretion Disk
    const diskGeometry = new THREE.CircleGeometry(2, isSmallMobile ? 12 : isMobile ? 16 : 32);
    const diskMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    scene.add(disk);

    // Nebula Particles
    const nebulaParticles = [];

    function createNebulaParticles() {
        const particleCount = isSmallMobile ? 60 : isMobile ? 150 : 500;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0x7c8cfd,
            size: isSmallMobile ? 0.05 : isMobile ? 0.08 : 0.1,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const radius = 3 + Math.random() * 5;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            sizes[i] = 0.1 + Math.random() * 0.2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        nebulaParticles.push({ points, geometry, material, positions, sizes });
    }

    // Star Birth Regions
    const starBirthParticles = [];

    function createStarBirthParticles() {
        const particleCount = isSmallMobile ? 40 : isMobile ? 80 : 200;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: 0xff7eb3,
            size: isSmallMobile ? 0.03 : isMobile ? 0.04 : 0.05,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const radius = 0.5 + Math.random() * 1.5;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            positions[i * 3] = (Math.random() - 0.5) * 4 + radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = (Math.random() - 0.5) * 4 + radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4 + radius * Math.cos(phi);
            sizes[i] = 0.02 + Math.random() * 0.06;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        starBirthParticles.push({ points, geometry, material, positions, sizes });
    }

    // Supernova Explosions
    let supernovaActive = false;
    let supernovaParticlesList = [];
    const supernovaGeometry = new THREE.BufferGeometry();
    const supernovaMaterial = new THREE.PointsMaterial({
        color: 0xff4757,
        size: 0.1,
        transparent: true,
        opacity: 0.9
    });

    function triggerSupernova() {
        if (supernovaActive) return;
        supernovaActive = true;

        const particleCount = isSmallMobile ? 60 : isMobile ? 150 : 300;
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

        supernovaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        supernovaGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        supernovaGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const points = new THREE.Points(supernovaGeometry, supernovaMaterial);
        scene.add(points);
        supernovaParticlesList = [{ points, geometry: supernovaGeometry, material: supernovaMaterial, positions, sizes, velocities, clock: 0 }];

        setTimeout(() => {
            supernovaActive = false;
            if (supernovaParticlesList.length > 0) {
                scene.remove(supernovaParticlesList[0].points);
                supernovaParticlesList = [];
            }
        }, 3000);
    }

    setInterval(() => {
        if (!isMobile && Math.random() > 0.97) triggerSupernova();
    }, isSmallMobile ? 5000 : isMobile ? 3000 : 1000);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Dust trail particles
    const dustParticles = [];

    function createDustParticles(count) {
        count = isSmallMobile ? Math.min(count || 50, 10) : isMobile ? Math.min(count || 50, 20) : (count || 50);
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

    function spawnDustParticle(x, y, z) {
        for (let i = 0; i < dustParticles.length; i++) {
            const particle = dustParticles[i];
            const lifetimeArray = particle.geometry.attributes.lifetime.array;
            for (let j = 0; j < lifetimeArray.length; j++) {
                if (lifetimeArray[j] <= 0) {
                    const index = j * 3;
                    particle.positions[index] = x;
                    particle.positions[index + 1] = y;
                    particle.positions[index + 2] = z;
                    lifetimeArray[j] = 1.0;
                    particle.geometry.attributes.lifetime.needsUpdate = true;
                    particle.geometry.attributes.position.needsUpdate = true;
                    return;
                }
            }
        }
    }

    // Animation
    let rotationAngle = 0;
    let nebulaPhase = 0;

    function animate() {
        requestAnimationFrame(animate);

        rotationAngle += isSmallMobile ? 0.003 : isMobile ? 0.005 : 0.01;
        blackHole.rotation.z = rotationAngle;
        disk.rotation.z = rotationAngle * 0.5;

        nebulaPhase += isSmallMobile ? 0.001 : isMobile ? 0.002 : 0.005;
        nebulaParticles.forEach(particle => {
            const sizeArray = particle.geometry.attributes.size.array;
            for (let i = 0; i < sizeArray.length; i++) {
                sizeArray[i] = particle.sizes[i] * (0.8 + 0.4 * Math.sin(nebulaPhase + i * 0.1));
            }
            particle.geometry.attributes.size.needsUpdate = true;
        });

        starBirthParticles.forEach(particle => {
            const sizeArray = particle.geometry.attributes.size.array;
            for (let i = 0; i < sizeArray.length; i++) {
                sizeArray[i] = particle.sizes[i] * (0.5 + 0.5 * Math.sin(Date.now() * 0.002 + i));
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
                    sizeArray[i] = particle.sizes[i] * lifetimeArray[i];
                }
            }
            particle.geometry.attributes.position.needsUpdate = true;
            particle.geometry.attributes.lifetime.needsUpdate = true;
            particle.geometry.attributes.size.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const nowSmallMobile = window.innerWidth < 500;
        const nowMobile = window.innerWidth < 768;

        if (nowSmallMobile !== isSmallMobile || nowMobile !== isMobile) {
            location.reload();
        }
    });

    // Initialize
    createNebulaParticles();
    createStarBirthParticles();
    createDustParticles();
    animate();
})();