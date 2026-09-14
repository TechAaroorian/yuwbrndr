import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThreeSceneConfig, ColorTheme } from '../../../types/studio';
import { Box, Layers, Cpu, Sparkles } from 'lucide-react';

interface Props {
  config: ThreeSceneConfig;
  theme: ColorTheme;
}

export const ThreeCanvas: React.FC<Props> = ({ config, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera (Isometric Perspective)
    const camera = new THREE.PerspectiveCamera(config.cameraFov || 45, width / height, 0.1, 1000);
    camera.position.set(4, 3.5, 5);
    camera.lookAt(0, 0, 0);

    // 3. Renderer with high DPI support
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(new THREE.Color(config.color || theme.primary), 2.5, 50);
    accentLight.position.set(-4, -2, -4);
    scene.add(accentLight);

    // 5. Mesh Creation based on shape
    const group = new THREE.Group();

    const mainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.color || theme.primary),
      roughness: config.roughness,
      metalness: config.metalness,
      wireframe: config.wireframe,
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.emissiveColor || theme.accent),
      emissive: new THREE.Color(config.emissiveColor || theme.accent),
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.1,
    });

    if (config.shape === 'isometric-cube') {
      // Base platform
      const baseGeo = new THREE.BoxGeometry(2.4, 0.4, 2.4);
      const baseMesh = new THREE.Mesh(baseGeo, mainMaterial);
      baseMesh.position.y = -0.5;
      group.add(baseMesh);

      // Floating center cube
      const centerGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const centerMesh = new THREE.Mesh(centerGeo, glowMaterial);
      centerMesh.position.y = 0.6;
      centerMesh.rotation.y = Math.PI / 4;
      group.add(centerMesh);

      // Micro satellites
      const satGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      for (let i = 0; i < 4; i++) {
        const satMesh = new THREE.Mesh(satGeo, mainMaterial);
        const angle = (i * Math.PI) / 2;
        satMesh.position.set(Math.cos(angle) * 1.5, 0.6, Math.sin(angle) * 1.5);
        group.add(satMesh);
      }
    } else if (config.shape === 'geodesic-sphere') {
      const sphereGeo = new THREE.IcosahedronGeometry(1.6, 2);
      const sphereMesh = new THREE.Mesh(sphereGeo, mainMaterial);
      group.add(sphereMesh);

      const innerGeo = new THREE.IcosahedronGeometry(0.9, 1);
      const innerMesh = new THREE.Mesh(innerGeo, glowMaterial);
      group.add(innerMesh);
    } else if (config.shape === 'torus-knot') {
      const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
      const knotMesh = new THREE.Mesh(knotGeo, mainMaterial);
      group.add(knotMesh);
    } else if (config.shape === 'cyber-cylinder') {
      // 3 Stacked Disks (Database style)
      for (let i = 0; i < 3; i++) {
        const diskGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 32);
        const mat = i === 1 ? glowMaterial : mainMaterial;
        const diskMesh = new THREE.Mesh(diskGeo, mat);
        diskMesh.position.y = (i - 1) * 0.7;
        group.add(diskMesh);
      }
    }

    scene.add(group);

    // Initial render
    renderer.render(scene, camera);

    // Gentle render loop for preview
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      if (config.rotationSpeed > 0) {
        group.rotation.y = elapsedTime * (config.rotationSpeed * 0.5);
        group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    if (config.rotationSpeed > 0) {
      animate();
    } else {
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [config, theme]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-8 md:p-12 select-none"
      style={{ backgroundColor: theme.background }}
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-25"
        style={{ backgroundColor: config.color || theme.primary }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Header Card */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase border"
            style={{ 
              backgroundColor: `${theme.primary}18`, 
              borderColor: `${theme.primary}40`,
              color: theme.accent 
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {config.techBadge || 'THREE.JS 3D ASSET'}
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            {config.title || 'Isometric Vector Shape'}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            {config.subtitle || 'Deterministic WebGL 3D render with standard PBR materials'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
          style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.muted }}>
          <Box className="w-4 h-4 text-indigo-400" />
          <span className="uppercase">{config.shape}</span>
        </div>
      </div>

      {/* WebGL Canvas Viewport */}
      <div className="relative z-10 my-auto flex items-center justify-center w-full h-[360px] md:h-[420px]">
        <canvas ref={canvasRef} className="max-w-full max-h-full cursor-grab active:cursor-grabbing" />
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-4 border-t" style={{ borderColor: theme.border, color: theme.muted }}>
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>ROUGHNESS: {config.roughness} • METALNESS: {config.metalness}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>HARDWARE-ACCELERATED WEBGL</span>
        </div>
      </div>
    </div>
  );
};
