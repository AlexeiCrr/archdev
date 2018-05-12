console.clear();
window.addEventListener('load', function () {
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var w = window.innerWidth,
        h = window.innerHeight;

    var container, renderer, scene, camera, controls, children;
    var raycaster, mouse = new THREE.Vector2(), INTERSECTED;

    var container2, renderer2, cam2, controls2, camHelper, stats, isDown = false, isDragging = false;

    (function init() {
        
        // Main renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);


        // Preview renderer
        renderer2 = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(200, 200);

        container2 = document.getElementById('container2');
        container2.appendChild(renderer2.domElement);

        
        // 
        // Debug framerate
        // 

        stats = new Stats();

        container2.appendChild(stats.dom);
        stats.dom.style.position = 'absolute';


        // Create world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x55555, 0.0018);
        renderer.setClearColor(scene.fog.color);
        renderer2.setClearColor(scene.fog.color);


        // Create main camera
        camera = new THREE.PerspectiveCamera(60, w / h, 1, 2000);
        camera.position.set(25, 20, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        camHelper = new THREE.CameraHelper(camera);
        scene.add(camHelper);

        // Create preview camera
        cam2 = new THREE.PerspectiveCamera(60, w / h, 1, 2000);
        cam2.position.set(0,100,400);
        cam2.lookAt(new THREE.Vector3(0, 0, 0));
        controls2 = new THREE.OrbitControls(cam2, renderer2.domElement);
    
        scene.add(new THREE.AxisHelper(50));
        scene.add(new THREE.GridHelper(100, 10));

        // Add lighting to the scene
        threePointLight();
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        raycaster = new THREE.Raycaster();
        children = new THREE.Object3D();
        
        
        var surfaceGeometry = new THREE.PlaneGeometry(100, 100, 32);
        
        var texture = new THREE.TextureLoader().load("assets/grass.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var surface = new THREE.Mesh(surfaceGeometry, material);
        surface.rotation.x = -Math.PI / 2;
        scene.add(surface);

        // Add the listeners
        window.addEventListener('resize', onWindowResize, false);
        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mousedown', onMouseDown, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('click', onClick, false);


    })();



    var loader = new THREE.OBJLoader();

    // load a resource
    loader.load('./assets/FantasyHouse.obj',

        // called when resource is loaded
        function (house) {

            scene.traverse(function (sceneChild) {
                if (sceneChild.type === 'PerspectiveCamera') {
                    camera = sceneChild;
                    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
                    camera.updateProjectionMatrix();
                }
            });

            scene.add(house);
            house.position.set(0, 2.5, 0);
            console.log(house.position)
        }
    );

    function onWindowResize() {
        w = window.innerWidth;
        h = window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        cam2.aspect = w / h;
        cam2.updateProjectionMatrix();
        renderer2.setSize(200, 200);
    }


    function onMouseMove(event) {
        event.preventDefault();
        if (isDown) isDragging = true;

        if (!isDragging) {
            mouse.x = (event.clientX / w) * 2 - 1;
            mouse.y = -(event.clientY / h) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(children.children);
            if (intersects.length > 0) {
                if (INTERSECTED != intersects[0].object) {
                    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                    INTERSECTED = intersects[0].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex(0xffff00);
                    container.style.cursor = 'pointer';
                }
            } else {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = null;
                container.style.cursor = 'auto';
            }
        }
    }


    function onClick(event) {
        event.preventDefault();
        if (!isDragging && INTERSECTED) {
            var centroid = bsphere.center;
            controls.target.copy(centroid);
            controls.update();
            controls.update();
        }
    }

    function onMouseDown(event) {
        event.preventDefault();
        isDown = true;
    }


    function onMouseUp(event) {
        event.preventDefault();
        isDown = false;
        isDragging = false;
    }


    (function animate() {
        requestAnimationFrame(animate);

        camHelper.visible = false;
        renderer.render(scene, camera);

        camHelper.visible = true;
        renderer2.render(scene, cam2);
        stats.update();
    })();

    function threePointLight() {
        // Add 3 sources of light
        var directionalLight = new THREE.DirectionalLight(0xb8b8b8);
        directionalLight.position.set(1, 1, 1).normalize();
        directionalLight.intensity = 1.0;
        scene.add(directionalLight);
        directionalLight = new THREE.DirectionalLight(0xb8b8b8);
        directionalLight.position.set(- 1, 0.6, 0.5).normalize();
        directionalLight.intensity = 0.5;
        scene.add(directionalLight);
        directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set(- 0.3, 0.6, - 0.8).normalize(0xb8b8b8);
        directionalLight.intensity = 0.45;
        scene.add(directionalLight);
    }
});