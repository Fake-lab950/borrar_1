import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  isEdge: boolean;
  speed: number;
  angle: number;
  color: string;
}

interface WeaponParticleSystemProps {
  svgPath: string;
  width?: number;
  height?: number;
  particleCount?: number;
  edgeColor?: string;
  fillColor?: string;
  className?: string;
}

const WeaponParticleSystem = ({
  svgPath,
  width = 400,
  height = 200,
  particleCount = 2500,
  edgeColor = '#00ffff',
  fillColor = '#0088aa',
  className = '',
}: WeaponParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Generate particles from SVG path using edge detection
  const generateParticlesFromPath = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create offscreen canvas for silhouette mask
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // Draw the SVG path as a filled shape
    const path = new Path2D(svgPath);
    offCtx.fillStyle = 'white';
    offCtx.fill(path);

    // Get image data for mask-based particle distribution
    const imageData = offCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Collect valid positions (where weapon shape exists)
    const shapePositions: { x: number; y: number; isEdge: boolean }[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];

        if (alpha > 128) {
          // Check if this is an edge pixel
          const isEdge = checkIfEdge(data, x, y, width, height);
          shapePositions.push({ x, y, isEdge });
        }
      }
    }

    // Separate edge and fill positions
    const edgePositions = shapePositions.filter(p => p.isEdge);
    const fillPositions = shapePositions.filter(p => !p.isEdge);

    // Distribute particles: 60% on edges, 40% fill
    const edgeParticleCount = Math.floor(particleCount * 0.6);
    const fillParticleCount = particleCount - edgeParticleCount;

    const particles: Particle[] = [];

    // Generate edge particles (higher density and brightness)
    for (let i = 0; i < edgeParticleCount; i++) {
      if (edgePositions.length === 0) break;
      const pos = edgePositions[Math.floor(Math.random() * edgePositions.length)];
      particles.push(createParticle(pos.x, pos.y, true, edgeColor));
    }

    // Generate fill particles (lower opacity)
    for (let i = 0; i < fillParticleCount; i++) {
      if (fillPositions.length === 0) break;
      const pos = fillPositions[Math.floor(Math.random() * fillPositions.length)];
      particles.push(createParticle(pos.x, pos.y, false, fillColor));
    }

    // Also trace along the SVG path for extra edge definition
    const pathParticles = tracePathParticles(svgPath, 500, edgeColor);
    particles.push(...pathParticles);

    particlesRef.current = particles;
  }, [svgPath, width, height, particleCount, edgeColor, fillColor]);

  // Check if pixel is on the edge using neighbor analysis
  const checkIfEdge = (data: Uint8ClampedArray, x: number, y: number, w: number, h: number): boolean => {
    const neighbors = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],          [1, 0],
      [-1, 1],  [0, 1],  [1, 1]
    ];

    for (const [dx, dy] of neighbors) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) return true;
      const idx = (ny * w + nx) * 4;
      if (data[idx + 3] < 128) return true;
    }
    return false;
  };

  // Create a single particle
  const createParticle = (x: number, y: number, isEdge: boolean, color: string): Particle => {
    return {
      x: x + (Math.random() - 0.5) * 2,
      y: y + (Math.random() - 0.5) * 2,
      baseX: x,
      baseY: y,
      size: isEdge ? 1.5 + Math.random() * 1 : 0.8 + Math.random() * 0.8,
      opacity: isEdge ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.3,
      isEdge,
      speed: 0.02 + Math.random() * 0.03,
      angle: Math.random() * Math.PI * 2,
      color,
    };
  };

  // Trace particles along SVG path for precise edge definition
  const tracePathParticles = (pathData: string, count: number, color: string): Particle[] => {
    const particles: Particle[] = [];
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    
    const pathLength = path.getTotalLength();
    
    for (let i = 0; i < count; i++) {
      const distance = (i / count) * pathLength;
      const point = path.getPointAtLength(distance);
      
      particles.push({
        x: point.x + (Math.random() - 0.5) * 1.5,
        y: point.y + (Math.random() - 0.5) * 1.5,
        baseX: point.x,
        baseY: point.y,
        size: 1.2 + Math.random() * 0.8,
        opacity: 0.8 + Math.random() * 0.2,
        isEdge: true,
        speed: 0.015 + Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        color,
      });
    }
    
    return particles;
  };

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const mouseRadius = 60;

    for (const particle of particles) {
      // Subtle floating animation
      particle.angle += particle.speed;
      const floatX = Math.sin(particle.angle) * 1.5;
      const floatY = Math.cos(particle.angle * 0.7) * 1;

      // Mouse interaction - particles flee from cursor
      const dx = mouse.x - particle.baseX;
      const dy = mouse.y - particle.baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let targetX = particle.baseX + floatX;
      let targetY = particle.baseY + floatY;

      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        targetX -= Math.cos(angle) * force * 25;
        targetY -= Math.sin(angle) * force * 25;
      }

      // Smooth movement towards target
      particle.x += (targetX - particle.x) * 0.1;
      particle.y += (targetY - particle.y) * 0.1;

      // Draw particle with glow effect for edge particles
      if (particle.isEdge) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = particle.color;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    animationRef.current = requestAnimationFrame(animate);
  }, [width, height]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    generateParticlesFromPath();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateParticlesFromPath, animate]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default WeaponParticleSystem;
