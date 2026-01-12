import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface FuturisticFrameProps {
  size?: number;
  isActive?: boolean;
}

const FuturisticFrame: React.FC<FuturisticFrameProps> = ({ 
  size = 400,
  isActive = true 
}) => {
  const outerRingRef = useRef<SVGGElement>(null);
  const innerRingRef = useRef<SVGGElement>(null);
  const ticksRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!isActive) return;

    // Rotate outer ring slowly
    if (outerRingRef.current) {
      gsap.to(outerRingRef.current, {
        rotation: 360,
        duration: 30,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    }

    // Rotate inner ring in opposite direction
    if (innerRingRef.current) {
      gsap.to(innerRingRef.current, {
        rotation: -360,
        duration: 20,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    }

    // Pulse ticks
    if (ticksRef.current) {
      gsap.to(ticksRef.current, {
        opacity: 0.3,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      gsap.killTweensOf([outerRingRef.current, innerRingRef.current, ticksRef.current]);
    };
  }, [isActive]);

  const center = size / 2;
  const outerRadius = size * 0.45;
  const middleRadius = size * 0.38;
  const innerRadius = size * 0.32;

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const isLong = i % 6 === 0;
    const innerR = outerRadius - (isLong ? 15 : 8);
    const outerR = outerRadius - 2;
    
    ticks.push(
      <line
        key={i}
        x1={center + Math.cos(angle) * innerR}
        y1={center + Math.sin(angle) * innerR}
        x2={center + Math.cos(angle) * outerR}
        y2={center + Math.sin(angle) * outerR}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth={isLong ? 2 : 1}
        opacity={isLong ? 0.6 : 0.3}
      />
    );
  }

  // Arc segments at cardinal points
  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = {
      x: center + Math.cos(startAngle) * radius,
      y: center + Math.sin(startAngle) * radius,
    };
    const end = {
      x: center + Math.cos(endAngle) * radius,
      y: center + Math.sin(endAngle) * radius,
    };
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0"
    >
      <defs>
        {/* Gradient for arcs */}
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer rotating group */}
      <g ref={outerRingRef}>
        {/* Main arc segments */}
        <path
          d={createArc(-0.4, 0.4, outerRadius)}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <path
          d={createArc(Math.PI - 0.4, Math.PI + 0.4, outerRadius)}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <path
          d={createArc(Math.PI / 2 - 0.3, Math.PI / 2 + 0.3, outerRadius)}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d={createArc(-Math.PI / 2 - 0.3, -Math.PI / 2 + 0.3, outerRadius)}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          opacity="0.5"
        />
        
        {/* Corner markers */}
        {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, i) => (
          <g key={i}>
            <circle
              cx={center + Math.cos(angle) * outerRadius}
              cy={center + Math.sin(angle) * outerRadius}
              r={4}
              fill="hsl(var(--primary))"
              filter="url(#glow)"
            />
          </g>
        ))}
      </g>

      {/* Tick marks */}
      <g ref={ticksRef}>
        {ticks}
      </g>

      {/* Inner rotating group */}
      <g ref={innerRingRef}>
        {/* Dashed middle circle */}
        <circle
          cx={center}
          cy={center}
          r={middleRadius}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
          strokeDasharray="8 4"
          opacity="0.4"
        />
        
        {/* Inner arc segments */}
        <path
          d={createArc(0.5, 1.2, innerRadius)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d={createArc(Math.PI + 0.5, Math.PI + 1.2, innerRadius)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Small decorative circles */}
        {[0.8, Math.PI + 0.8].map((angle, i) => (
          <circle
            key={i}
            cx={center + Math.cos(angle) * innerRadius}
            cy={center + Math.sin(angle) * innerRadius}
            r={3}
            fill="hsl(var(--primary))"
            opacity="0.8"
          />
        ))}
      </g>

      {/* Static center crosshair */}
      <g opacity="0.3">
        <line
          x1={center - 20}
          y1={center}
          x2={center - 8}
          y2={center}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
        />
        <line
          x1={center + 8}
          y1={center}
          x2={center + 20}
          y2={center}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
        />
        <line
          x1={center}
          y1={center - 20}
          x2={center}
          y2={center - 8}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
        />
        <line
          x1={center}
          y1={center + 8}
          x2={center}
          y2={center + 20}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
        />
      </g>

      {/* Data readout dots */}
      <g>
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx={center - 40 + i * 20}
            cy={center + innerRadius + 25}
            r={2}
            fill={i < 3 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
            opacity={i < 3 ? 1 : 0.3}
          />
        ))}
      </g>
    </svg>
  );
};

export default FuturisticFrame;
