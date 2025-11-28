import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.IcosahedronGeometry(10, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4a90e2, 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 40;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.5,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.001;
      particlesMesh.rotation.y -= 0.0005;
      renderer.render(scene, camera);
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
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-background" />;
};

const Loader = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "INITIALIZING SYSTEM...",
    "LOADING ASSETS...",
    "PREPARING EXPERIENCE...",
    "WELCOME TO MY PORTFOLIO"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledWrapper>
      <ThreeBackground />
      
      <div className="loader-content">
        <svg className="pl" viewBox="0 0 160 160" width="160px" height="160px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" stopColor="#000" />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
            <mask id="mask1">
              <rect x={0} y={0} width={160} height={160} fill="url(#grad)" />
            </mask>
            <mask id="mask2">
              <rect x={28} y={28} width={104} height={104} fill="url(#grad)" />
            </mask>
          </defs>
          <g>
            <g className="pl__ring-rotate">
              <circle className="pl__ring-stroke" cx={80} cy={80} r={72} fill="none" stroke="hsl(223,90%,55%)" strokeWidth={16} strokeDasharray="452.39 452.39" strokeDashoffset={452} strokeLinecap="round" transform="rotate(-45,80,80)" />
            </g>
          </g>
          <g mask="url(#mask1)">
            <g className="pl__ring-rotate">
              <circle className="pl__ring-stroke" cx={80} cy={80} r={72} fill="none" stroke="hsl(193,90%,55%)" strokeWidth={16} strokeDasharray="452.39 452.39" strokeDashoffset={452} strokeLinecap="round" transform="rotate(-45,80,80)" />
            </g>
          </g>
          <g>
            <g strokeWidth={4} strokeDasharray="12 12" strokeDashoffset={12} strokeLinecap="round" transform="translate(80,80)">
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-135,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-90,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-45,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(0,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(45,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(90,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(135,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(180,0,0) translate(0,40)" />
            </g>
          </g>
          <g mask="url(#mask1)">
            <g strokeWidth={4} strokeDasharray="12 12" strokeDashoffset={12} strokeLinecap="round" transform="translate(80,80)">
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-135,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-90,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-45,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(0,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(45,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(90,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(135,0,0) translate(0,40)" />
              <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(180,0,0) translate(0,40)" />
            </g>
          </g>
          <g>
            <g transform="translate(64,28)">
              <g className="pl__arrows" transform="rotate(45,16,52)">
                <path fill="hsl(3,90%,55%)" d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z" />
                <path fill="hsl(223,10%,90%)" d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z" />
              </g>
            </g>
          </g>
          <g mask="url(#mask2)">
            <g transform="translate(64,28)">
              <g className="pl__arrows" transform="rotate(45,16,52)">
                <path fill="hsl(333,90%,55%)" d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z" />
                <path fill="hsl(223,90%,80%)" d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z" />
              </g>
            </g>
          </g>
        </svg>
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
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
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

  .three-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .loader-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .text-container {
    min-height: 30px;
    display: flex;
    justify-content: center;
  }

  .loading-text {
    font-family: 'Courier New', Courier, monospace;
    color: #4a90e2;
    font-size: 1.2rem;
    letter-spacing: 4px;
    text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
    white-space: nowrap;
  }

  .pl {
    display: block;
    width: 9.375em;
    height: 9.375em;
    filter: drop-shadow(0 0 10px rgba(74, 144, 226, 0.3));
  }

  .pl__arrows,
  .pl__ring-rotate,
  .pl__ring-stroke,
  .pl__tick {
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .pl__arrows {
    animation-name: arrows42;
    transform: rotate(45deg);
    transform-origin: 16px 52px;
  }

  .pl__ring-rotate,
  .pl__ring-stroke {
    transform-origin: 80px 80px;
  }

  .pl__ring-rotate {
    animation-name: ringRotate42;
  }

  .pl__ring-stroke {
    animation-name: ringStroke42;
    transform: rotate(-45deg);
  }

  .pl__tick {
    animation-name: tick42;
  }

  .pl__tick:nth-child(2) {
    animation-delay: -1.75s;
  }

  .pl__tick:nth-child(3) {
    animation-delay: -1.5s;
  }

  .pl__tick:nth-child(4) {
    animation-delay: -1.25s;
  }

  .pl__tick:nth-child(5) {
    animation-delay: -1s;
  }

  .pl__tick:nth-child(6) {
    animation-delay: -0.75s;
  }

  .pl__tick:nth-child(7) {
    animation-delay: -0.5s;
  }

  .pl__tick:nth-child(8) {
    animation-delay: -0.25s;
  }

  /* Animations */
  @keyframes arrows42 {
    from {
      transform: rotate(45deg);
    }

    to {
      transform: rotate(405deg);
    }
  }

  @keyframes ringRotate42 {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(720deg);
    }
  }

  @keyframes ringStroke42 {
    from,
  	to {
      stroke-dashoffset: 452;
      transform: rotate(-45deg);
    }

    50% {
      stroke-dashoffset: 169.5;
      transform: rotate(-180deg);
    }
  }

  @keyframes tick42 {
    from,
  	3%,
  	47%,
  	to {
      stroke-dashoffset: -12;
    }

    14%,
  	36% {
      stroke-dashoffset: 0;
    }
  }`;

export default Loader;
