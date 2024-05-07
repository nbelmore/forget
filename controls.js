const moveSpeed = 5;  // Human walking speed in units per second
const jumpSpeed = 5;  // Realistic human jump speed in units per second
let velocity = new THREE.Vector3();
let canJump = true;

function updateControls(delta) {
    // Apply motion based on key inputs and scale it by delta for frame-rate independence
    if (keyboard['w']) character.position.z -= moveSpeed * delta;
    if (keyboard['s']) character.position.z += moveSpeed * delta;
    if (keyboard['a']) character.position.x -= moveSpeed * delta;
    if (keyboard['d']) character.position.x += moveSpeed * delta;

    // Gravity and jumping physics
    character.position.add(velocity.clone().multiplyScalar(delta));  // Apply velocity scaled by delta
    if (character.position.y > 1) {  // Assuming 1 is the ground level
        velocity.y -= 9.81 * delta;  // Apply gravity effect, 9.81 m/s^2
    } else {
        character.position.y = 1;
        canJump = true;
        velocity.y = 0;
    }

    // Jumping
    if (keyboard[' '] && canJump) {
        velocity.y = jumpSpeed;  // Set initial jump velocity
        canJump = false;
    }
}

const keyboard = {};

window.addEventListener('keydown', (e) => {
    keyboard[e.key] = true;
});

window.addEventListener('keydown', (e) => {
    keyboard[e.key] = true;
    if (e.key === 'q' || e.key === 'Q') {
        shootProjectile(); // Call shoot function when 'Q' is pressed
    }
});

window.addEventListener('keyup', (e) => {
    keyboard[e.key] = false;
});

window.addEventListener('keyup', (e) => {
    keyboard[e.key] = false;
});
