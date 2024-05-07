function level1() {
    const loader = new THREE.TextureLoader();
    loader.load(
        'https://raw.githubusercontent.com/nbelmore/forget/main/829a6b8ec6c3370da58eab685bfb580c.jpg',
        function(texture) {
            scene.background = texture;
        },
        undefined,
        function(error) {
            console.error('Error loading the sky texture.', error);
        }
    );

    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);

    const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.set(0, 1, -20);
    scene.add(enemy);

    let waypoints = [];
    let targetWaypointIndex = 0;

    function generateWaypoints() {
        for (let i = 0; i < 10; i++) {
            waypoints.push(new THREE.Vector3(
                Math.random() * 100 - 50, // x-axis: -50 to 50
                1,                       // y-axis: fixed at 1 (ground level)
                Math.random() * 100 - 50  // z-axis: -50 to 50
            ));
        }
    }

    generateWaypoints();

    const triggerGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const triggerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const triggerMesh = new THREE.Mesh(triggerGeometry, triggerMaterial);
    triggerMesh.position.set(0, 0.05, -5);
    scene.add(triggerMesh);

    let projectiles = [];
    const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });

    setInterval(function() {
        const projectileGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
        projectile.position.copy(enemy.position);
        projectiles.push(projectile);
        scene.add(projectile);
    }, 2000);  // Shoot every 2 seconds

    scene.onBeforeRender = function() {
        // Update projectiles
        projectiles.forEach((projectile, index) => {
            const direction = new THREE.Vector3();
            character.getWorldPosition(direction);
            direction.sub(projectile.position).normalize();
            projectile.position.addScaledVector(direction, 0.5);

            if (projectile.position.distanceTo(character.position) < 1) {
                updateHealth(2);
                scene.remove(projectile);
                projectiles.splice(index, 1);
            }
        });

        // Move enemy towards waypoints more slowly
        if (enemy.position.distanceTo(waypoints[targetWaypointIndex]) > 1) {
            const moveDirection = waypoints[targetWaypointIndex].clone().sub(enemy.position).normalize();
            enemy.position.add(moveDirection.multiplyScalar(0.1)); // Reduced speed here
        } else {
            targetWaypointIndex = (targetWaypointIndex + 1) % waypoints.length;
        }

        // Check level completion
        const distance = triggerMesh.position.distanceTo(character.position);
        if (distance < 1) {
            window.advanceLevel();
        }
    };
}
