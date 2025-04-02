import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarMovingEffect = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 800;
    
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500; 
    
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);
    
    const colorOptions = [
      new THREE.Color(0xffffff), 
      new THREE.Color(0xa0a0ff), 
      new THREE.Color(0xd0d0ff), 
      new THREE.Color(0xf8f8ff)  
    ];
    
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3000; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3000; // y
      positions[i * 3 + 2] = Math.random() * 3000; // z
      
      velocities[i] = 0.5 + Math.random() * 5; // Increased speed
      
      sizes[i] = 1.5 + Math.random() * 3; // Increased sizes
      
      const colorIndex = Math.floor(Math.random() * colorOptions.length);
      const color = colorOptions[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 4.5, // Increased base size
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    const animate = () => {
      const positions = stars.geometry.attributes.position.array;
      
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] -= velocities[i];
        
        if (positions[i * 3 + 2] < -1500) {
          positions[i * 3 + 2] = 1500;
          positions[i * 3] = (Math.random() - 0.5) * 3000;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
        }
      }
      
      stars.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2, pointerEvents: 'none' }} />;
};

export default StarMovingEffect;