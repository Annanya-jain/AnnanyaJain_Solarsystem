import * as THREE from 'three'
let scene, camera, renderer, sun, planets = [], orbits = [], speeds = [], angles = [];
let isPaused = false;

const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 0.4, distance: 8, speed: 0.04 },
  { name: "Venus",   color: 0xffddaa, size: 0.9, distance: 12, speed: 0.015 },
  { name: "Earth",   color: 0x2233ff, size: 1,   distance: 16, speed: 0.01 },
  { name: "Mars",    color: 0xff3300, size: 0.8, distance: 20, speed: 0.008 },
  { name: "Jupiter", color: 0xffaa33, size: 2.5, distance: 28, speed: 0.002 },
  { name: "Saturn",  color: 0xffddaa, size: 2,   distance: 34, speed: 0.0015 },
  { name: "Uranus",  color: 0x33ffff, size: 1.5, distance: 40, speed: 0.001 },
  { name: "Neptune", color: 0x3344ff, size: 1.5, distance: 46, speed: 0.0009 }
];

function init() {
  // Basic scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.8), 0.1, 1000);
  camera.position.z = 70;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Lighting
// Lighting (replace existing light code)
const light = new THREE.PointLight(0xffffff, 50, 10000);
light.position.set(0, 0, 0);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffff00,1); 
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);

  // Sun
  const sunGeo = new THREE.SphereGeometry(3, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Planets
  planetData.forEach((data, i) => {
    const geo = new THREE.SphereGeometry(data.size, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: data.color });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.x = data.distance;
    scene.add(planet);
    planets.push(planet);

    orbits.push(data.distance);
    speeds.push(data.speed);
    angles.push(0);

    // Create UI
    const label = document.createElement("label");
    label.style.margin = "0 10px";
    label.innerText = `${data.name}`;

    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "0.1";
    input.step = "0.001";
    input.value = data.speed;
    input.dataset.index = i;

    input.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.index);
      speeds[idx] = parseFloat(e.target.value);
    });

    label.appendChild(input);
    document.getElementById("controls").appendChild(label);
  });

  // Pause/Resume Buttons
  document.getElementById("pauseBtn").onclick = () => isPaused = true;
  document.getElementById("resumeBtn").onclick = () => isPaused = false;
}

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    planets.forEach((planet, i) => {
      angles[i] += speeds[i];
      planet.position.x = Math.cos(angles[i]) * orbits[i];
      planet.position.z = Math.sin(angles[i]) * orbits[i];
      planet.rotation.y += 0.01;
    });
  }

  renderer.render(scene, camera);
}

init();
animate();
