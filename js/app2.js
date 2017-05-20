var scene, camera, renderer;
var clock = new THREE.Clock();
var mouseX = mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var plane;
var composer;
var theta = 1;
function init() {

    document.getElementById("container").style.cursor = "none";
    //boilerplate
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.getElementById("container").appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
    scene.add(camera);

    //down to business
    plane = new THREE.Mesh(new THREE.PlaneGeometry(132, 132, 128, 128), new THREE.MeshPhongMaterial({ color: 0x00FF00, emissive: new THREE.Color(0x00aa00) }));
    scene.add(plane);
    plane.material.side = THREE.DoubleSide;
    plane.material.wireframe = true;
    plane.rotation.x = Math.PI / 2;
    console.log(plane.geometry);
    camera.position.set(0, 100, 100);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 60, 1);
    scene.add(directionalLight);
    var ambiLight = new THREE.AmbientLight(0xffffff, .4);
    // directionalLight.position.set(50, 60, 1);
    scene.add(ambiLight);

    //skysphere
    var skygeo = new THREE.SphereGeometry(600, 60, 40);
    skygeo.scale(-1, 1, 1);

    var skymat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.3,
        map: new THREE.TextureLoader().load(
            "./assets/gb.jpg"
        )
    });
    var skysphere = new THREE.Mesh(skygeo, skymat);
    scene.add(skysphere);


    // postprocessing
    composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    renderPass.renderToScreen = false;

    var bloomPass = new THREE.BloomBlendPass(1.0, 0.3, new THREE.Vector2(1024, 1024));
    bloomPass.renderToScreen = true;

    // var effectCopy = new THREE.ShaderPass(THREE.CopyShader);

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    // composer.addPass(effectCopy);


}



function render() {

    plane.rotation.z += .0009;
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.z += (- mouseY - camera.position.z) * .05;
    camera.position.y += (- mouseY - camera.position.y) * .05;
    camera.lookAt(scene.position);
    plane.geometry.verticesNeedUpdate = true;
    plane.geometry.computeFaceNormals();
    plane.geometry.computeVertexNormals();
    plane.geometry.normalsNeedUpdate = true;
    for (var i = 0; i < plane.geometry.vertices.length; i++) {

        // if (i % 2 == 0) {
        // plane.geometry.verticesNeedUpdate = true;
        plane.geometry.vertices[i].z += Math.cos(clock.getElapsedTime() * (plane.geometry.vertices[i].z / 10 * plane.geometry.vertices[i].y * 5)) / 50;
        // }
    }

    renderer.clear();
    composer.render();
    requestAnimationFrame(render);
}


init();
render();


function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    renderer.setSize(window.innerWidth, window.innerHeight);
};


//Listen to mouse mouve events
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', resize);
