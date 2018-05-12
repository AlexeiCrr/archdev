console.clear();
window.addEventListener('load', function () {
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var w = window.innerWidth,
        h = window.innerHeight;

    var container, renderer, scene, camera, controls, children;
    var raycaster, mouse = new THREE.Vector2(),
        INTERSECTED;

    var container2, renderer2, cam2, controls2, camHelper, stats, isDown = false,
        isDragging = false;

    (function init() {
        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);


        renderer2 = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(200, 200);

        container2 = document.getElementById('container2');
        container2.appendChild(renderer2.domElement);

        stats = new Stats();

        container2.appendChild(stats.dom);
        stats.dom.style.position = 'absolute';

        // world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x1E2630, 0.0018);
        renderer.setClearColor(scene.fog.color);
        renderer2.setClearColor(scene.fog.color);

        // Main camera
        camera = new THREE.PerspectiveCamera(60, w / h, 1, 2000);
        camera.position.x = 25;
        camera.position.y = 20;
        camera.position.z = 100;
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        // Adding corner camera helper
        camHelper = new THREE.CameraHelper(camera);
        scene.add(camHelper);

        threePointLight();
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        cam2 = new THREE.PerspectiveCamera(60, w / h, 1, 2000);
        cam2.position.x = 0;
        cam2.position.y = 100;
        cam2.position.z = 400;
        cam2.lookAt(new THREE.Vector3(0, 0, 0));
        controls2 = new THREE.OrbitControls(cam2, renderer2.domElement);

        // helpers
        var axes = new THREE.AxisHelper(50);
        scene.add(axes);
        var gridXZ = new THREE.GridHelper(100, 10);
        scene.add(gridXZ);



        raycaster = new THREE.Raycaster();

        children = new THREE.Object3D();
        var tmpGeometry = new THREE.Geometry();

        tmpGeometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

        var geometry = new THREE.BufferGeometry().fromGeometry( tmpGeometry );
        geometry.computeBoundingSphere();
        var texture = new THREE.TextureLoader().load( './assets/grass.png' );
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture } ) );
        scene.add( mesh );


        var surfaceGeometry = new THREE.PlaneGeometry( 100, 100, 32 );

        // var surfaceGeometry = new THREE.BoxGeometry( 0, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
        var surface = new THREE.Mesh( surfaceGeometry, material );
        surface.rotation.x = Math.PI / 2;
        scene.add( surface );


        window.addEventListener('resize', onWindowResize, false);
        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mousedown', onMouseDown, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('click', onClick, false);


    })();



    var loader = new THREE.OBJLoader();

// load a resource
    loader.load( './assets/FantasyHouse.obj',
        
        // called when resource is loaded
        function ( house ) {

            scene.traverse( function ( sceneChild ) {
                if ( sceneChild.type === 'PerspectiveCamera' ) {
                    camera = sceneChild;
                    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
                    camera.updateProjectionMatrix();
                }
            } );

            scene.add( house );
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
        var directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
        directionalLight.position.set( 1, 1, 1 ).normalize();
        directionalLight.intensity = 1.0;
        scene.add( directionalLight );
        directionalLight = new THREE.DirectionalLight( 0xb8b8b8 );
        directionalLight.position.set( - 1, 0.6, 0.5 ).normalize();
        directionalLight.intensity = 0.5;
        scene.add( directionalLight );
        directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set( - 0.3, 0.6, - 0.8 ).normalize( 0xb8b8b8 );
        directionalLight.intensity = 0.45;
        scene.add( directionalLight );
    }
});