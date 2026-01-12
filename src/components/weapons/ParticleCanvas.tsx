import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  isAccent: boolean;
}

interface ParticleCanvasProps {
  weaponType: 'firearm' | 'physical' | 'magical' | 'elemental';
  isTransitioning: boolean;
  width?: number;
  height?: number;
}

// Define weapon shapes as coordinate arrays
const weaponShapes: Record<string, { x: number; y: number }[]> = {
  firearm: generateRifleShape(),
  physical: generateSwordShape(),
  magical: generateStaffShape(),
  elemental: generateGauntletShape(),
};

function generateRifleShape(): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Main barrel body
  for (let x = 20; x <= 180; x += 3) {
    for (let y = 85; y <= 115; y += 4) {
      if (Math.random() > 0.3) {
        points.push({ x, y: y + (Math.random() - 0.5) * 2 });
      }
    }
  }
  
  // Stock (back part)
  for (let x = 150; x <= 190; x += 3) {
    for (let y = 75; y <= 125; y += 4) {
      if (Math.random() > 0.4) {
        points.push({ x, y });
      }
    }
  }
  
  // Barrel tip
  for (let i = 0; i < 30; i++) {
    points.push({ x: 10 + Math.random() * 15, y: 95 + (Math.random() - 0.5) * 10 });
  }
  
  // Magazine
  for (let x = 70; x <= 100; x += 3) {
    for (let y = 115; y <= 145; y += 4) {
      if (Math.random() > 0.3) {
        points.push({ x, y });
      }
    }
  }
  
  // Scope
  for (let x = 80; x <= 120; x += 2) {
    for (let y = 70; y <= 85; y += 3) {
      if (Math.random() > 0.5) {
        points.push({ x, y });
      }
    }
  }
  
  return points;
}

function generateSwordShape(): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Blade
  for (let y = 15; y <= 130; y += 2) {
    const widthAtY = Math.max(5, 15 - (y / 130) * 10);
    for (let offset = -widthAtY; offset <= widthAtY; offset += 3) {
      if (Math.random() > 0.2) {
        points.push({ x: 100 + offset, y });
      }
    }
  }
  
  // Blade tip (denser)
  for (let i = 0; i < 40; i++) {
    points.push({ 
      x: 100 + (Math.random() - 0.5) * 10, 
      y: 10 + Math.random() * 15 
    });
  }
  
  // Guard
  for (let x = 70; x <= 130; x += 2) {
    for (let y = 130; y <= 145; y += 3) {
      points.push({ x, y });
    }
  }
  
  // Handle
  for (let y = 145; y <= 185; y += 2) {
    for (let offset = -8; offset <= 8; offset += 3) {
      if (Math.random() > 0.3) {
        points.push({ x: 100 + offset, y });
      }
    }
  }
  
  // Pommel
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 8;
    points.push({ x: 100 + Math.cos(angle) * r, y: 190 + Math.sin(angle) * r });
  }
  
  return points;
}

function generateStaffShape(): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Staff pole
  for (let y = 50; y <= 190; y += 2) {
    for (let offset = -4; offset <= 4; offset += 2) {
      if (Math.random() > 0.2) {
        points.push({ x: 100 + offset, y });
      }
    }
  }
  
  // Orb at top
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 25;
    points.push({ x: 100 + Math.cos(angle) * r, y: 30 + Math.sin(angle) * r });
  }
  
  // Inner orb glow
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 12;
    points.push({ x: 100 + Math.cos(angle) * r, y: 30 + Math.sin(angle) * r });
  }
  
  // Decorative rings
  for (let ringY of [60, 90, 120]) {
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      points.push({ x: 100 + Math.cos(angle) * 10, y: ringY + Math.sin(angle) * 3 });
    }
  }
  
  // Energy wisps
  for (let i = 0; i < 30; i++) {
    const y = 30 + Math.random() * 30;
    const spread = (1 - (y - 30) / 30) * 35;
    points.push({ x: 100 + (Math.random() - 0.5) * spread, y });
  }
  
  return points;
}

function generateGauntletShape(): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Main hand body
  for (let x = 60; x <= 140; x += 3) {
    for (let y = 100; y <= 160; y += 3) {
      if (Math.random() > 0.25) {
        points.push({ x, y });
      }
    }
  }
  
  // Fingers
  const fingerBases = [
    { x: 65, tipX: 55, tipY: 50 },
    { x: 80, tipX: 75, tipY: 35 },
    { x: 100, tipX: 100, tipY: 30 },
    { x: 120, tipX: 125, tipY: 40 },
    { x: 135, tipX: 145, tipY: 70 },
  ];
  
  fingerBases.forEach(finger => {
    for (let t = 0; t <= 1; t += 0.05) {
      const x = finger.x + (finger.tipX - finger.x) * t;
      const y = 100 + (finger.tipY - 100) * t;
      for (let offset = -5; offset <= 5; offset += 2) {
        if (Math.random() > 0.3) {
          points.push({ x: x + offset * (1 - t * 0.5), y });
        }
      }
    }
  });
  
  // Knuckle details
  for (let kx of [75, 95, 115]) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 6;
      points.push({ x: kx + Math.cos(angle) * r, y: 100 + Math.sin(angle) * r });
    }
  }
  
  // Energy core in palm
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 15;
    points.push({ x: 100 + Math.cos(angle) * r, y: 130 + Math.sin(angle) * r });
  }
  
  return points;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ 
  weaponType, 
  isTransitioning,
  width = 400, 
  height = 400 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const previousTypeRef = useRef(weaponType);

  const initParticles = useCallback((type: string) => {
    const shape = weaponShapes[type] || weaponShapes.firearm;
    const scaleX = width / 200;
    const scaleY = height / 200;
    
    return shape.map((point, i) => ({
      x: point.x * scaleX,
      y: point.y * scaleY,
      baseX: point.x * scaleX,
      baseY: point.y * scaleY,
      size: 1.5 + Math.random() * 2,
      opacity: 0.5 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1,
      angle: Math.random() * Math.PI * 2,
      isAccent: i % 8 === 0,
    }));
  }, [width, height]);

  useEffect(() => {
    if (weaponType !== previousTypeRef.current) {
      transitionProgressRef.current = 0;
      previousTypeRef.current = weaponType;
    }
  }, [weaponType]);

  useEffect(() => {
    particlesRef.current = initParticles(weaponType);
  }, [weaponType, initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetShape = weaponShapes[weaponType] || weaponShapes.firearm;
    const scaleX = width / 200;
    const scaleY = height / 200;

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Update transition progress
      if (transitionProgressRef.current < 1) {
        transitionProgressRef.current = Math.min(1, transitionProgressRef.current + 0.03);
      }

      const particles = particlesRef.current;
      
      particles.forEach((particle, i) => {
        const targetPoint = targetShape[i % targetShape.length];
        const targetX = targetPoint.x * scaleX;
        const targetY = targetPoint.y * scaleY;

        // Smooth transition to target position
        if (isTransitioning || transitionProgressRef.current < 1) {
          // Disperse effect
          const disperseStrength = isTransitioning ? 1 - transitionProgressRef.current : transitionProgressRef.current;
          const disperseX = (Math.random() - 0.5) * 200 * (1 - disperseStrength);
          const disperseY = (Math.random() - 0.5) * 200 * (1 - disperseStrength);
          
          particle.x += (targetX + disperseX - particle.x) * 0.08;
          particle.y += (targetY + disperseY - particle.y) * 0.08;
        } else {
          // Floating animation in idle state
          const floatX = Math.sin(timeRef.current * particle.speed + particle.angle) * 2;
          const floatY = Math.cos(timeRef.current * particle.speed * 0.7 + particle.angle) * 2;
          
          particle.x += (targetX + floatX - particle.x) * 0.1;
          particle.y += (targetY + floatY - particle.y) * 0.1;
        }

        // Pulsing opacity
        const pulseOpacity = particle.opacity * (0.7 + Math.sin(timeRef.current * 2 + i * 0.1) * 0.3);

        // Scan line effect
        const scanY = (timeRef.current * 50) % height;
        const scanDistance = Math.abs(particle.y - scanY);
        const scanBoost = scanDistance < 30 ? (1 - scanDistance / 30) * 0.5 : 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        if (particle.isAccent) {
          // Accent particles (neon green)
          ctx.fillStyle = `hsla(142, 100%, 50%, ${pulseOpacity + scanBoost})`;
          ctx.shadowColor = 'hsl(142, 100%, 50%)';
          ctx.shadowBlur = 8;
        } else {
          // Regular particles (white/light)
          ctx.fillStyle = `hsla(0, 0%, 100%, ${pulseOpacity * 0.8 + scanBoost})`;
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });

      // Draw connecting lines between nearby accent particles
      ctx.strokeStyle = 'hsla(142, 100%, 50%, 0.1)';
      ctx.lineWidth = 0.5;
      
      const accentParticles = particles.filter(p => p.isAccent);
      accentParticles.forEach((p1, i) => {
        accentParticles.slice(i + 1).forEach(p2 => {
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.globalAlpha = 1 - distance / 50;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [weaponType, isTransitioning, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ 
        filter: 'drop-shadow(0 0 20px hsla(142, 100%, 50%, 0.3))',
      }}
    />
  );
};

export default ParticleCanvas;
