var scene, camera, renderer;
var clock = new THREE.Clock();
var mouseX = mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var plane;
var theta = 1;
function init() {

    document.getElementById("container").style.cursor = "none";
    //boilerplate
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xdddddd);
    document.getElementById("container").appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
    scene.add(camera);

    //down to business
    plane = new THREE.Mesh(new THREE.PlaneGeometry(132, 132, 128, 128), new THREE.MeshPhongMaterial({ color: 0xeebbff }));
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
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
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
        plane.geometry.vertices[i].z += Math.cos(clock.getElapsedTime() / 1000 * (plane.geometry.vertices[i].x * 5 - plane.geometry.vertices[i].y * 5));
        // }
    }
    // console.log(Math.sin(clock.getElapsedTime()));
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
