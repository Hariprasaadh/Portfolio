import { useEffect, useRef, memo, useMemo, useCallback } from 'react';
import * as THREE from 'three';

// Memoized color options - static data extracted outside component
const COLOR_OPTIONS = [
  new THREE.Color(0xffffff),
  new THREE.Color(0xa0a0ff),
  new THREE.Color(0xd0d0ff),
  new THREE.Color(0xf8f8ff)
];

// Responsive star count based on device capability
const getStarCount = () => {
  const isMobile = window.innerWidth <= 768;
  const isLowPower = navigator.hardwareConcurrency <= 4;
  if (isMobile || isLowPower) return 800;
  return 1500;
};

const StarMovingEffect = memo(() => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isUnmountedRef = useRef(false);
  const lastTimeRef = useRef(0);
  
  // Memoize debounced resize handler
  const debouncedResize = useMemo(() => {
    let timeoutId = null;
    return (callback) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, 150);
    };
  }, []);
  
  useEffect(() => {
    isUnmountedRef.current = false;
    const mount = mountRef.current;
    if (!mount) return;
    
    // Scene setup with performance optimizations
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disable for performance
      powerPreference: 'high-performance'
    });
    
    // Cap pixel ratio for performance (especially on high-DPI mobile)
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);
    
    camera.position.z = 800;
    
    // Use responsive star count
    const starCount = getStarCount();
    const starGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 2] = Math.random() * 3000;
      
      velocities[i] = 0.5 + Math.random() * 5;
      sizes[i] = 1.5 + Math.random() * 3;
      
      const colorIndex = Math.floor(Math.random() * COLOR_OPTIONS.length);
      const color = COLOR_OPTIONS[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 4.5,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Frame-rate limited animation (target ~30fps for background effect)
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime) => {
      if (isUnmountedRef.current) return;
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Frame rate limiting
      const deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime < frameInterval) return;
      
      lastTimeRef.current = currentTime - (deltaTime % frameInterval);
      
      const posArray = stars.geometry.attributes.position.array;
      
      for (let i = 0; i < starCount; i++) {
        posArray[i * 3 + 2] -= velocities[i];
        
        if (posArray[i * 3 + 2] < -1500) {
          posArray[i * 3 + 2] = 1500;
          posArray[i * 3] = (Math.random() - 0.5) * 3000;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 3000;
        }
      }
      
      stars.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Debounced resize handler
    const handleResize = () => {
      debouncedResize(() => {
        if (isUnmountedRef.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup function
    return () => {
      isUnmountedRef.current = true;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose Three.js resources
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [debouncedResize]);
  
  // Memoized inline style to prevent re-renders
  const containerStyle = useMemo(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100dvh', // Dynamic viewport height for mobile (fallback handled by CSS)
    zIndex: -2,
    pointerEvents: 'none',
    willChange: 'transform' // GPU acceleration hint
  }), []);
  
  return <div ref={mountRef} style={containerStyle} />;
});

StarMovingEffect.displayName = 'StarMovingEffect';

export default StarMovingEffect;