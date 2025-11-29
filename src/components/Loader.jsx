import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const RubiksCubeLoader = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cubesRef = useRef([]);
  const rotationQueueRef = useRef([]);
  const rotatingGroupRef = useRef(null);
  const rotationAxisRef = useRef(null);
  const rotationSpeedRef = useRef(0);
  const remainingAngleRef = useRef(0);
  const isShuffledRef = useRef(false);
  const scrambleMovesRef = useRef([]);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ----- Scene Setup -----
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 9, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ----- Cube Creation -----
    const faceColors = [0xff8c00, 0xdc143c, 0x1e90ff, 0x32cd32, 0xffff00, 0xffffff];

    function createFaceMaterials() {
      return Array(6).fill().map(() => new THREE.MeshBasicMaterial({ color: 0x000000 }));
    }

    function createRoundedStickerGeometry() {
      const width = 0.8, height = 0.8, radius = 0.1;
      const shape = new THREE.Shape();
      const x = -width / 2, y = -height / 2;

      shape.moveTo(x + radius, y);
      shape.lineTo(x + width - radius, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + radius);
      shape.lineTo(x + width, y + height - radius);
      shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      shape.lineTo(x + radius, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - radius);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);

      return new THREE.ShapeGeometry(shape);
    }

    function addSticker(subCube, face, color) {
      const sticker = new THREE.Mesh(
        createRoundedStickerGeometry(),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
      );
      switch (face) {
        case 'right':  sticker.position.set(0.501, 0, 0); sticker.rotation.y =  Math.PI / 2; break;
        case 'left':   sticker.position.set(-0.501, 0, 0); sticker.rotation.y = -Math.PI / 2; break;
        case 'top':    sticker.position.set(0, 0.501, 0);  sticker.rotation.x = -Math.PI / 2; break;
        case 'bottom': sticker.position.set(0, -0.501, 0); sticker.rotation.x =  Math.PI / 2; break;
        case 'front':  sticker.position.set(0, 0, 0.501);  break;
        case 'back':   sticker.position.set(0, 0, -0.501); sticker.rotation.y =  Math.PI; break;
      }
      subCube.add(sticker);
    }

    // Build Rubik's Cube
    const spacing = 1.025;
    const cubes = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const subCube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            createFaceMaterials()
          );
          subCube.position.set((x - 1) * spacing, (y - 1) * spacing, (z - 1) * spacing);
          if (x === 0) addSticker(subCube, 'left', faceColors[1]);
          if (x === 2) addSticker(subCube, 'right', faceColors[0]);
          if (y === 0) addSticker(subCube, 'bottom', faceColors[3]);
          if (y === 2) addSticker(subCube, 'top', faceColors[2]);
          if (z === 0) addSticker(subCube, 'back', faceColors[5]);
          if (z === 2) addSticker(subCube, 'front', faceColors[4]);
          cubes.push(subCube);
          scene.add(subCube);
        }
      }
    }
    cubesRef.current = cubes;

    // ----- Logic Functions -----
    const getLayerCubes = (axis, index) => {
      return cubesRef.current.filter(c => Math.abs(c.position[axis] - index) < 0.01);
    };

    const rotateLayer = (axis, index, angle) => {
      if (rotatingGroupRef.current) return;
      const layer = getLayerCubes(axis, index);
      const group = new THREE.Group();
      layer.forEach(c => { scene.attach(c); group.add(c); });
      scene.add(group);
      rotatingGroupRef.current = group;
      
      rotationAxisRef.current = new THREE.Vector3(
        axis === 'x' ? 1 : 0,
        axis === 'y' ? 1 : 0,
        axis === 'z' ? 1 : 0
      );
      remainingAngleRef.current = angle;
      rotationSpeedRef.current = angle / 10;
    };

    const performRotation = () => {
      if (!rotatingGroupRef.current) return;
      
      const step = Math.sign(remainingAngleRef.current) * Math.min(Math.abs(rotationSpeedRef.current), Math.abs(remainingAngleRef.current));
      rotatingGroupRef.current.rotateOnAxis(rotationAxisRef.current, step);
      remainingAngleRef.current -= step;
      
      if (Math.abs(remainingAngleRef.current) < 0.001) {
        rotatingGroupRef.current.children.slice().forEach(c => {
          scene.attach(c);
          scene.add(c);
        });
        scene.remove(rotatingGroupRef.current);
        rotatingGroupRef.current = null;
      }
    };

    const scrambleCube = () => {
      scrambleMovesRef.current = [];
      const axes = ['x', 'y', 'z'];
      const idxs = [-spacing, 0, spacing];
      
      for (let i = 0; i < 15; i++) {
        const axis = axes[Math.floor(Math.random() * 3)];
        const idx = idxs[Math.floor(Math.random() * 3)];
        const ang = Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
        rotationQueueRef.current.push({ axis, index: idx, angle: ang });
        scrambleMovesRef.current.push({ axis, index: idx, angle: ang });
      }
      isShuffledRef.current = true;
    };

    const solveCube = () => {
      const solution = scrambleMovesRef.current.slice().reverse().map(m => ({
        axis: m.axis, index: m.index, angle: -m.angle
      }));
      rotationQueueRef.current.push(...solution);
      isShuffledRef.current = false;
    };

    // ----- Animation Loop -----
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      scene.rotation.x += 0.005;
      scene.rotation.y += 0.005;

      if (rotatingGroupRef.current) {
        performRotation();
      } else if (rotationQueueRef.current.length) {
        const { axis, index, angle } = rotationQueueRef.current.shift();
        rotateLayer(axis, index, angle);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Start Sequence
    setTimeout(() => {
      scrambleCube();
      setTimeout(() => {
        solveCube();
      }, 1500);
    }, 100);

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

const Loader = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "OPTIMIZING HYPERPARAMETERS...",
    "ESTABLISHING SECURE CONNECTION...",
    "WELCOME TO MY PORTFOLIO"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledWrapper>
      <div className="cube-container">
        <RubiksCubeLoader />
      </div>
      
      <div className="text-container">
        <AnimatePresence mode='wait'>
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="loading-text"
          >
            {texts[textIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #0f0f16;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;

  .cube-container {
    width: 400px;
    height: 400px;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      width: 300px;
      height: 300px;
    }
  }

  .text-container {
    margin-top: 20px;
    min-height: 30px;
    display: flex;
    justify-content: center;
    z-index: 2;
  }

  .loading-text {
    font-family: 'Courier New', Courier, monospace;
    color: #4a90e2;
    font-size: 1.2rem;
    letter-spacing: 4px;
    text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
    white-space: nowrap;
    font-weight: bold;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      letter-spacing: 2px;
    }
  }
`;

export default Loader;
