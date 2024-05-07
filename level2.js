function level2() {
    // Set the sky color to green
    scene.background = new THREE.Color(0x00ff00);

    // Create the ground with a brown color
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // SaddleBrown
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Define a new trigger for advancing to the next level (if applicable)
    const levelTrigger = new THREE.BoxGeometry(1, 0.1, 1);
    const triggerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4500 }); // OrangeRed for visibility
    const triggerMesh = new THREE.Mesh(levelTrigger, triggerMaterial);
    triggerMesh.position.set(0, 0.05, -10);
    scene.add(triggerMesh);

    // Add a check for the character reaching the trigger
    scene.onBeforeRender = function() {
        if (character.position.distanceTo(triggerMesh.position) < 1) {
            // Load the next level or repeat if more levels are not defined
            if (window.advanceLevel) {
                window.advanceLevel();
            }
        }
    };
}
