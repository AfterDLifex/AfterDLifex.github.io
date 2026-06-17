import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = 'three-canvas';
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '-1';
renderer.domElement.style.pointerEvents = 'none';
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-2';
renderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(renderer.domElement);

// Black Hole Geometry
const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
const blackHoleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
scene.add(blackHole);

// Accretion Disk
const diskGeometry = new THREE.CircleGeometry(2, 32);
const diskMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
const disk = new THREE.Mesh(diskGeometry, diskMaterial);
disk.rotation.x = Math.PI / 2;
scene.add(disk);

// Nebulae Particles
const nebulaParticles = [];
const nebulaGeometry = new THREE.BufferGeometry();
const nebulaMaterial = new THREE.PointsMaterial({
    color: 0x7c8cfd,
    size: 0.1,
    transparent: true,
    opacity: 0.6
});

function createNebulaParticles() {
    const positions = new Float32Array(500 * 3); // 500 particles
    const sizes = new Float32Array(500);

    for (let i = 0; i < 500; i++) {
        // Position particles in a spherical distribution
        const radius = 3 + Math.random() * 5;
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Random initial size
        sizes[i] = 0.1 + Math.random() * 0.2;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const nebulaPoints = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaPoints);
    nebulaParticles.push({ points: nebulaPoints, geometry: nebulaGeometry, material: nebulaMaterial, positions, sizes });
}

// Star Birth Regions
const starBirthParticles = [];
const starBirthGeometry = new THREE.BufferGeometry();
const starBirthMaterial = new THREE.PointsMaterial({
    color: 0xff7eb3,
    size: 0.05,
    transparent: true,
    opacity: 0.8
});

function createStarBirthParticles() {
    const positions = new Float32Array(200 * 3); // 200 particles
    const sizes = new Float32Array(200);

    for (let i = 0; i < 200; i++) {
        // Position particles in clusters
        const radius = 0.5 + Math.random() * 1.5;
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();

        positions[i * 3] = (Math.random() - 0.5) * 4 + radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4 + radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4 + radius * Math.cos(phi);

        // Random initial size
        sizes[i] = 0.02 + Math.random() * 0.06;
    }

    starBirthGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starBirthGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starBirthPoints = new THREE.Points(starBirthGeometry, starBirthMaterial);
    scene.add(starBirthPoints);
    starBirthParticles.push({ points: starBirthPoints, geometry: starBirthGeometry, material: starBirthMaterial, positions, sizes });
}

// Supernova Explosions (triggered occasionally)
let supernovaActive = false;
let supernovaParticles = [];
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

    const positions = new Float32Array(300 * 3);
    const sizes = new Float32Array(300);
    const velocities = new Float32Array(300 * 3);

    for (let i = 0; i < 300; i++) {
        // Explosion from center
        const radius = Math.random() * 0.1;
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Outward velocity
        const speed = 0.02 + Math.random() * 0.05;
        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;

        // Initial size
        sizes[i] = 0.05 + Math.random() * 0.1;
    }

    supernovaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    supernovaGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    supernovaGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const supernovaPoints = new THREE.Points(supernovaGeometry, supernovaMaterial);
    scene.add(supernovaPoints);
    supernovaParticles = [{ points: supernovaPoints, geometry: supernovaGeometry, material: supernovaMaterial, positions, sizes, velocities, clock: 0 }];

    // Deactivate after explosion
    setTimeout(() => {
        supernovaActive = false;
        if (supernovaParticles.length > 0) {
            scene.remove(supernovaParticles[0].points);
            supernovaParticles = [];
        }
    }, 3000);
}

// Trigger supernova occasionally
setInterval(() => {
    if (Math.random() > 0.97) { // ~3% chance per second
        triggerSupernova();
    }
}, 1000);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Dust trail particles
const dustParticles = [];
const dustGeometry = new THREE.BufferGeometry();
const dustMaterial = new THREE.PointsMaterial({
    color: 0x7c8cfd,
    size: 0.05,
    transparent: true,
    opacity: 0.7
});

function createDustParticles(count = 50) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        // Start at origin, will be positioned when spawned
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        sizes[i] = 0.02 + Math.random() * 0.03;
        lifetimes[i] = 0; // 0 means inactive
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    dustGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);
    dustParticles.push({ points: dustPoints, geometry: dustGeometry, material: dustMaterial, positions, sizes, lifetimes });
}

function spawnDustParticle(x, y, z) {
    // Find first inactive particle
    for (let i = 0; i < dustParticles.length; i++) {
        const particle = dustParticles[i];
        const lifetimeArray = particle.geometry.attributes.lifetime.array;

        // Find an inactive slot
        for (let j = 0; j < lifetimeArray.length; j++) {
            if (lifetimeArray[j] <= 0) {
                // Activate this particle
                const index = j * 3;
                particle.positions[index] = x;
                particle.positions[index + 1] = y;
                particle.positions[index + 2] = z;

                lifetimeArray[j] = 1.0; // Full lifetime
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

    // Rotate black hole and disk
    rotationAngle += 0.01;
    blackHole.rotation.z = rotationAngle;
    disk.rotation.z = rotationAngle * 0.5;

    // Animate nebula particles (expanding/contracting)
    nebulaPhase += 0.005;
    nebulaParticles.forEach(particle => {
        const sizeArray = particle.geometry.attributes.size.array;
        for (let i = 0; i < sizeArray.length; i++) {
            // Pulsating size
            sizeArray[i] = particle.sizes[i] * (0.8 + 0.4 * Math.sin(nebulaPhase + i * 0.1));
        }
        particle.geometry.attributes.size.needsUpdate = true;
    });

    // Animate star birth particles
    starBirthParticles.forEach(particle => {
        const sizeArray = particle.geometry.attributes.size.array;
        for (let i = 0; i < sizeArray.length; i++) {
            // Twinkling effect
            sizeArray[i] = particle.sizes[i] * (0.5 + 0.5 * Math.sin(Date.now() * 0.002 + i));
        }
        particle.geometry.attributes.size.needsUpdate = true;
    });

    // Animate supernova particles
    supernovaParticles.forEach(particle => {
        particle.clock += 0.016; // ~60fps
        if (particle.clock < 3) { // 3 second lifespan
            const posArray = particle.geometry.attributes.position.array;
            const velArray = particle.geometry.attributes.velocity.array;
            const sizeArray = particle.geometry.attributes.size.array;

            for (let i = 0; i < posArray.length; i += 3) {
                // Apply velocity
                posArray[i] += velArray[i];
                posArray[i + 1] += velArray[i + 1];
                posArray[i + 2] += velArray[i + 2];

                // Fade out
                sizeArray[i / 3] *= 0.99;
            }

            particle.geometry.attributes.position.needsUpdate = true;
            particle.geometry.attributes.size.needsUpdate = true;
        }
    });

    // Animate dust particles
    dustParticles.forEach(particle => {
        const posArray = particle.geometry.attributes.position.array;
        const lifetimeArray = particle.geometry.attributes.lifetime.array;
        const sizeArray = particle.geometry.attributes.size.array;

        for (let i = 0; i < lifetimeArray.length; i++) {
            if (lifetimeArray[i] > 0) {
                // Decrease lifetime
                lifetimeArray[i] -= 0.016; // ~60fps

                // Fade out and drift slightly
                const index = i * 3;
                posArray[index] += (Math.random() - 0.5) * 0.01;
                posArray[index + 1] += (Math.random() - 0.5) * 0.01;
                posArray[index + 2] += (Math.random() - 0.5) * 0.01;

                // Apply to size based on lifetime (fade out)
                sizeArray[i] = particle.sizes[i] * lifetimeArray[i];
            }
        }

        particle.geometry.attributes.position.needsUpdate = true;
        particle.geometry.attributes.lifetime.needsUpdate = true;
        particle.geometry.attributes.size.needsUpdate = true;
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
createNebulaParticles();
createStarBirthParticles();
createDustParticles(); // initialize dust system
// Expose dust spawn function for cursor
window.spawnDustAtScreen = function (screenX, screenY) {
    const vec = new THREE.Vector3(
        (screenX / window.innerWidth) * 2 - 1,
        -(screenY / window.innerHeight) * 2 + 1,
        0.5
    ).unproject(camera);
    spawnDustParticle(vec.x, vec.y, vec.z);
};
animate();