let scene, camera, renderer, character, currentLevel = 1;
let clock = new THREE.Clock();
const levels = [];
let health = 100; // Starting health
let projectiles = [];

function shootProjectile() {
    const projectileGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // Orange color for the projectile
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    projectile.position.copy(character.position);
    projectile.velocity = new THREE.Vector3(0, 0, -10); // Adjust velocity vector based on your game's orientation

    projectiles.push(projectile);
    scene.add(projectile);
}

function updateProjectiles(delta) {
    projectiles.forEach((proj, index) => {
        proj.position.add(proj.velocity.clone().multiplyScalar(delta));
        
        // Assume an entity or target for collision detection
        if (proj.position.distanceTo(enemy.position) < 1) { // Simple collision detection
            console.log("Hit detected!");
            // Handle hit logic here, like damaging the enemy
            scene.remove(proj);
            projectiles.splice(index, 1);
        }

        // Remove the projectile if it goes out of bounds
        if (proj.position.z < -50 || proj.position.z > 50) {
            scene.remove(proj);
            projectiles.splice(index, 1);
        }
    });
}

// Include updateProjectiles in your animation loop in game.js
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateControls(delta);
    updateProjectiles(delta);
    renderer.render(scene, camera);
}

function initGame() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createCharacter();
    loadLevel(currentLevel);
    animate();
    window.addEventListener('resize', onWindowResize, false);
}

function createCharacter() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    character = new THREE.Mesh(geometry, material);
    character.position.set(0, 1, 0);
    scene.add(character);

    camera.position.set(0, 5, 10);
    camera.lookAt(character.position);
}

function loadLevel(levelNumber) {
    const levelFunction = window[`level${levelNumber}`];
    if (levelFunction) {
        levelFunction();
        reloadCharacterAndCamera();
    } else {
        console.log("No more levels!");
    }
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateControls(delta);

    camera.position.x = character.position.x;
    camera.position.y = character.position.y + 5;
    camera.position.z = character.position.z + 10;
    camera.lookAt(character.position);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.advanceLevel = function() {
    if (scene) {
        for (let i = scene.children.length - 1; i >= 0; i--) {
            let obj = scene.children[i];
            if (obj !== character && obj !== camera) {
                scene.remove(obj);
            }
        }
    }
    currentLevel++;
    loadLevel(currentLevel);
};

function reloadCharacterAndCamera() {
    if (!scene.children.includes(character)) {
        scene.add(character);
    }
    camera.position.set(0, 5, 10);
    camera.lookAt(character.position);
}

function updateHealth(delta) {
    // This is just an example, you would have conditions to change health
    health -= delta * 5; // Decrement health as an example
    if (health < 0) health = 0;
    document.getElementById('health').style.width = `${health}%`;
}

function updateHealth(damage) {
    health -= damage;
    document.getElementById('health').style.width = `${(health / 100) * 200}px`; // Assuming the max width of the health bar is 200px
    if (health <= 0) {
        console.log("Health depleted. Restarting level...");
        health = 100; // Reset health
        document.getElementById('health').style.width = '200px';
        loadLevel(currentLevel); // Reload the current level
    }
}

// Integrate updateHealth into your game loop or trigger as necessary
