import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Constants
const FACE_COLORS = [0xff8c00, 0xdc143c, 0x1e90ff, 0x32cd32, 0xffff00, 0xffffff];
const SPACING = 1.025;
const CUBE_SIZE = 1;
const STICKER_SIZE = 0.8;
const STICKER_RADIUS = 0.1;
const ROTATION_STEPS = 10;
const SCRAMBLE_MOVES = 15;

// Helper functions outside component to prevent recreation
const createRoundedStickerGeometry = () => {
  const width = STICKER_SIZE;
  const height = STICKER_SIZE;
  const radius = STICKER_RADIUS;
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

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
};

const STICKER_POSITIONS = {
  right: { position: [0.501, 0, 0], rotation: [0, Math.PI / 2, 0] },
  left: { position: [-0.501, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  top: { position: [0, 0.501, 0], rotation: [-Math.PI / 2, 0, 0] },
  bottom: { position: [0, -0.501, 0], rotation: [Math.PI / 2, 0, 0] },
  front: { position: [0, 0, 0.501], rotation: [0, 0, 0] },
  back: { position: [0, 0, -0.501], rotation: [0, Math.PI, 0] }
};

const RubiksCubeLoader = React.memo(() => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cubesRef = useRef([]);
  const rotationQueueRef = useRef([]);
  const rotatingGroupRef = useRef(null);
  const rotationAxisRef = useRef(null);
  const rotationSpeedRef = useRef(0);
  const remainingAngleRef = useRef(0);
  const scrambleMovesRef = useRef([]);
  const frameIdRef = useRef(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    isUnmountedRef.current = false;

    // Scene Setup
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

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Reusable geometries and materials for performance
    const stickerGeometry = createRoundedStickerGeometry();
    const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    const createFaceMaterials = () => Array(6).fill(blackMaterial);

    const addSticker = (subCube, face, color) => {
      const stickerMaterial = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const sticker = new THREE.Mesh(stickerGeometry, stickerMaterial);
      const { position, rotation } = STICKER_POSITIONS[face];
      sticker.position.set(...position);
      sticker.rotation.set(...rotation);
      subCube.add(sticker);
    };

    // Build Rubik's Cube
    const cubes = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const subCube = new THREE.Mesh(cubeGeometry, createFaceMaterials());
          subCube.position.set(
            (x - 1) * SPACING,
            (y - 1) * SPACING,
            (z - 1) * SPACING
          );
          
          if (x === 0) addSticker(subCube, 'left', FACE_COLORS[1]);
          if (x === 2) addSticker(subCube, 'right', FACE_COLORS[0]);
          if (y === 0) addSticker(subCube, 'bottom', FACE_COLORS[3]);
          if (y === 2) addSticker(subCube, 'top', FACE_COLORS[2]);
          if (z === 0) addSticker(subCube, 'back', FACE_COLORS[5]);
          if (z === 2) addSticker(subCube, 'front', FACE_COLORS[4]);
          
          cubes.push(subCube);
          scene.add(subCube);
        }
      }
    }
    cubesRef.current = cubes;

    // Rotation Logic
    const getLayerCubes = (axis, index) => 
      cubesRef.current.filter(c => Math.abs(c.position[axis] - index) < 0.01);

    const rotateLayer = (axis, index, angle) => {
      if (rotatingGroupRef.current) return;
      
      const layer = getLayerCubes(axis, index);
      const group = new THREE.Group();
      
      layer.forEach(c => {
        scene.attach(c);
        group.add(c);
      });
      
      scene.add(group);
      rotatingGroupRef.current = group;
      rotationAxisRef.current = new THREE.Vector3(
        axis === 'x' ? 1 : 0,
        axis === 'y' ? 1 : 0,
        axis === 'z' ? 1 : 0
      );
      remainingAngleRef.current = angle;
      rotationSpeedRef.current = angle / ROTATION_STEPS;
    };

    const performRotation = () => {
      if (!rotatingGroupRef.current) return;

      const remaining = remainingAngleRef.current;
      const speed = rotationSpeedRef.current;
      const step = Math.sign(remaining) * Math.min(Math.abs(speed), Math.abs(remaining));
      
      rotatingGroupRef.current.rotateOnAxis(rotationAxisRef.current, step);
      remainingAngleRef.current -= step;

      if (Math.abs(remainingAngleRef.current) < 0.001) {
        const children = rotatingGroupRef.current.children.slice();
        children.forEach(c => {
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
      const idxs = [-SPACING, 0, SPACING];

      for (let i = 0; i < SCRAMBLE_MOVES; i++) {
        const axis = axes[Math.floor(Math.random() * 3)];
        const idx = idxs[Math.floor(Math.random() * 3)];
        const ang = (Math.PI / 2) * (Math.random() < 0.5 ? 1 : -1);
        rotationQueueRef.current.push({ axis, index: idx, angle: ang });
        scrambleMovesRef.current.push({ axis, index: idx, angle: ang });
      }
    };

    const solveCube = () => {
      const solution = scrambleMovesRef.current
        .slice()
        .reverse()
        .map(m => ({ axis: m.axis, index: m.index, angle: -m.angle }));
      rotationQueueRef.current.push(...solution);
    };

    // Animation Loop with performance optimization
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      if (isUnmountedRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      
      lastTime = currentTime - (deltaTime % frameInterval);

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

    frameIdRef.current = requestAnimationFrame(animate);

    // Start Sequence
    const scrambleTimeout = setTimeout(() => {
      if (!isUnmountedRef.current) {
        scrambleCube();
        setTimeout(() => {
          if (!isUnmountedRef.current) solveCube();
        }, 1500);
      }
    }, 100);

    // Resize Handler with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!mountRef.current || isUnmountedRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isUnmountedRef.current = true;
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrambleTimeout);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(frameIdRef.current);

      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose all resources
      stickerGeometry.dispose();
      blackMaterial.dispose();
      cubeGeometry.dispose();

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

  return <CubeMount ref={mountRef} />;
});

RubiksCubeLoader.displayName = 'RubiksCubeLoader';

const Loader = () => {
  const [textIndex, setTextIndex] = useState(0);
  
  const texts = useMemo(() => [
    "OPTIMIZING HYPERPARAMETERS...",
    "ESTABLISHING SECURE CONNECTION...",
    "WELCOME TO MY PORTFOLIO"
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [texts.length]);

  const textVariants = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }), []);

  return (
    <StyledWrapper>
      <div className="cube-container">
        <RubiksCubeLoader />
      </div>

      <div className="text-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="loading-text"
          >
            {texts[textIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </StyledWrapper>
  );
};

const CubeMount = styled.div`
  width: 100%;
  height: 100%;
  touch-action: none;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  width: 100vw;
  background-color: #0f0f16;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;

  .cube-container {
    width: min(400px, 80vw);
    height: min(400px, 80vw);
    position: relative;
    z-index: 1;
    will-change: transform;
  }

  .text-container {
    margin-top: clamp(10px, 3vh, 30px);
    min-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    padding: 0 20px;
    width: 100%;
  }

  .loading-text {
    font-family: 'Courier New', Courier, monospace;
    color: #4a90e2;
    font-size: clamp(0.75rem, 2.5vw, 1.2rem);
    letter-spacing: clamp(1px, 0.5vw, 4px);
    text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
    white-space: nowrap;
    font-weight: bold;
    text-align: center;
    will-change: opacity, transform;
  }

  /* Ensure proper rendering on iOS */
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;

export default Loader;
