/**
 * three-scene.js - escena 3D progresiva del hero.
 * Carga Three.js bajo demanda para mantener el sitio estatico sin build step.
 */
(async function () {
  'use strict';

  const mount = document.getElementById('hero-webgl');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!mount || prefersReduced) return;

  let THREE;

  try {
    THREE = await import('https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js');
  } catch (error) {
    mount.dataset.fallback = 'true';
    return;
  }

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    mount.dataset.fallback = 'true';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.2, 6.8);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  mount.appendChild(renderer.domElement);
  document.documentElement.classList.add('has-webgl-hero');

  const group = new THREE.Group();
  scene.add(group);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d6470,
    metalness: 0.58,
    roughness: 0.26,
    emissive: 0x003d42,
    emissiveIntensity: 0.52,
    transparent: true,
    opacity: 0.94,
  });

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d4aa,
    wireframe: true,
    transparent: true,
    opacity: 0.34,
  });

  const accentMaterial = new THREE.MeshBasicMaterial({
    color: 0x4f8cff,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 2), coreMaterial);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 2), wireMaterial);
  const torusA = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.018, 16, 160), wireMaterial);
  const torusB = new THREE.Mesh(new THREE.TorusGeometry(2.16, 0.012, 16, 180), accentMaterial);
  const torusC = new THREE.Mesh(new THREE.TorusGeometry(2.48, 0.01, 12, 180), wireMaterial);

  torusA.rotation.x = Math.PI * 0.52;
  torusB.rotation.x = Math.PI * 0.24;
  torusB.rotation.y = Math.PI * 0.12;
  torusC.rotation.x = Math.PI * 0.72;
  torusC.rotation.y = Math.PI * -0.18;

  group.add(core, wire, torusA, torusB, torusC);

  const nodeGroup = new THREE.Group();
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4aa });
  const signalMaterial = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 12);
  const nodePositions = [];
  const nodeCount = 34;

  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    const material = i % 9 === 0 ? signalMaterial : nodeMaterial;
    const node = new THREE.Mesh(nodeGeometry, material);

    node.position.set(
      Math.cos(theta) * radius * 2.25,
      y * 1.55,
      Math.sin(theta) * radius * 2.25
    );
    node.userData.baseScale = i % 9 === 0 ? 1.55 : 1;
    nodeGroup.add(node);
    nodePositions.push(node.position.x, node.position.y, node.position.z);
  }

  const linePositions = [];
  for (let i = 0; i < nodePositions.length; i += 3) {
    linePositions.push(0, 0, 0, nodePositions[i], nodePositions[i + 1], nodePositions[i + 2]);
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00d4aa,
    transparent: true,
    opacity: 0.12,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

  nodeGroup.add(lines);
  group.add(nodeGroup);

  scene.add(new THREE.AmbientLight(0xb8fff1, 0.55));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(3, 3, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x00d4aa, 2.4, 8);
  rimLight.position.set(-2.5, -1.5, 3);
  scene.add(rimLight);

  let pointerX = 0;
  let pointerY = 0;

  document.addEventListener('pointermove', (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.6;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.5;
  }, { passive: true });

  function resize() {
    const width = mount.clientWidth || 520;
    const height = mount.clientHeight || 520;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();

  function render(time) {
    const t = time * 0.001;

    group.rotation.y = t * 0.22 + pointerX;
    group.rotation.x = Math.sin(t * 0.55) * 0.08 + pointerY;
    wire.rotation.y = t * 0.42;
    core.rotation.y = t * -0.24;
    torusA.rotation.z = t * 0.36;
    torusB.rotation.z = t * -0.28;
    torusC.rotation.z = t * 0.18;
    nodeGroup.rotation.y = t * -0.16;

    nodeGroup.children.forEach((node, index) => {
      if (!node.isMesh) return;
      const pulse = 1 + Math.sin(t * 2.2 + index * 0.62) * 0.22;
      const scale = node.userData.baseScale * pulse;
      node.scale.setScalar(scale);
    });

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(render);

  document.addEventListener('visibilitychange', () => {
    renderer.setAnimationLoop(document.hidden ? null : render);
  });

  window.addEventListener('beforeunload', () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    renderer.dispose();
  });
})();
