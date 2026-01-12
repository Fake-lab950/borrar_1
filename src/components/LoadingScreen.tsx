import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const fillOverlayRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SVGSVGElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Register GSAP plugin
    gsap.registerPlugin();

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 100);
      }
    });

    // Controller drawing animation starts first
    tl.to('.controller-path', {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      stagger: 0.05,
    }, 0);

    // Progress line animation (0% to 100% top to bottom) - runs in parallel
    tl.to(progressLineRef.current, {
      height: '100%',
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: function() {
        setProgress(Math.round(this.progress() * 100));
      }
    }, 0);

    // Expand horizontally
    tl.to(fillOverlayRef.current, {
      width: '100vw',
      duration: 0.6,
      ease: 'power3.inOut',
    });

    // Hold for 0.5 second
    tl.to({}, { duration: 0.5 });

    // Fade out
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
    >
      {/* Progress line on the left */}
      <div className="absolute left-8 top-0 h-full w-1 bg-muted overflow-hidden">
        <div 
          ref={progressLineRef}
          className="w-full bg-primary"
          style={{ height: '0%' }}
        />
      </div>

      {/* Progress percentage */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 font-display text-6xl font-bold text-primary">
        {progress}%
      </div>

      {/* Fill overlay that expands horizontally */}
      <div 
        ref={fillOverlayRef}
        className="absolute left-0 top-0 h-full bg-primary"
        style={{ width: '4px' }}
      />

      {/* Controller illustration */}
      <svg
        ref={controllerRef}
        viewBox="0 0 500 250"
        className="w-[60%] max-w-[700px] h-auto absolute right-[10%] top-1/2 -translate-y-1/2"
        fill="none"
        strokeWidth="2"
      >
        {/* PlayStation-style section (left) */}
        <g className="text-foreground" stroke="currentColor">
          <path
            className="controller-path"
            d="M80 125 Q50 100 60 70 L110 45 Q140 35 170 45 L195 60"
            style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
          />
          {/* D-pad */}
          <path
            className="controller-path"
            d="M95 100 L95 85 L110 85 L110 70 L125 70 L125 85 L140 85 L140 100 L125 100 L125 115 L110 115 L110 100 Z"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          {/* Analog stick */}
          <circle
            className="controller-path"
            cx="165"
            cy="120"
            r="18"
            style={{ strokeDasharray: 150, strokeDashoffset: 150 }}
          />
          <circle
            className="controller-path"
            cx="165"
            cy="120"
            r="8"
            stroke="hsl(var(--primary))"
            style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
          />
        </g>

        {/* Xbox-style section (center) */}
        <g className="text-foreground" stroke="currentColor">
          <path
            className="controller-path"
            d="M195 60 Q220 40 250 35 Q280 40 305 60"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          {/* Center Xbox button */}
          <circle
            className="controller-path"
            cx="250"
            cy="90"
            r="22"
            style={{ strokeDasharray: 150, strokeDashoffset: 150 }}
          />
          <path
            className="controller-path"
            d="M240 85 L250 78 L260 85 L260 98 L250 105 L240 98 Z"
            stroke="hsl(var(--primary))"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          {/* Menu buttons */}
          <rect
            className="controller-path"
            x="205"
            y="85"
            width="18"
            height="10"
            rx="3"
            style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
          />
          <rect
            className="controller-path"
            x="277"
            y="85"
            width="18"
            height="10"
            rx="3"
            style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
          />
        </g>

        {/* Nintendo-style section (right) */}
        <g className="text-foreground" stroke="currentColor">
          <path
            className="controller-path"
            d="M305 60 L330 45 Q360 35 390 45 L440 70 Q450 100 440 125"
            style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
          />
          {/* ABXY buttons */}
          <circle
            className="controller-path"
            cx="365"
            cy="80"
            r="12"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          <circle
            className="controller-path"
            cx="390"
            cy="95"
            r="12"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          <circle
            className="controller-path"
            cx="340"
            cy="95"
            r="12"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          <circle
            className="controller-path"
            cx="365"
            cy="110"
            r="12"
            style={{ strokeDasharray: 80, strokeDashoffset: 80 }}
          />
          {/* Button labels */}
          <text x="365" y="84" textAnchor="middle" fontSize="10" fill="hsl(var(--primary))" className="controller-path font-display" style={{ strokeDasharray: 0, strokeDashoffset: 0 }}>Y</text>
          <text x="390" y="99" textAnchor="middle" fontSize="10" fill="hsl(var(--primary))" className="controller-path font-display" style={{ strokeDasharray: 0, strokeDashoffset: 0 }}>B</text>
          <text x="340" y="99" textAnchor="middle" fontSize="10" fill="hsl(var(--primary))" className="controller-path font-display" style={{ strokeDasharray: 0, strokeDashoffset: 0 }}>X</text>
          <text x="365" y="114" textAnchor="middle" fontSize="10" fill="hsl(var(--primary))" className="controller-path font-display" style={{ strokeDasharray: 0, strokeDashoffset: 0 }}>A</text>
          {/* Right analog */}
          <circle
            className="controller-path"
            cx="330"
            cy="140"
            r="18"
            style={{ strokeDasharray: 150, strokeDashoffset: 150 }}
          />
        </g>

        {/* Bottom grip connections */}
        <g className="text-foreground" stroke="currentColor">
          <path
            className="controller-path"
            d="M80 125 Q60 160 75 190 L115 200 Q150 208 185 195"
            style={{ strokeDasharray: 250, strokeDashoffset: 250 }}
          />
          <path
            className="controller-path"
            d="M440 125 Q460 160 445 190 L405 200 Q370 208 335 195"
            style={{ strokeDasharray: 250, strokeDashoffset: 250 }}
          />
          <path
            className="controller-path"
            d="M185 195 Q220 210 250 210 Q280 210 335 195"
            style={{ strokeDasharray: 180, strokeDashoffset: 180 }}
          />
        </g>

        {/* Decorative neon accents */}
        <g stroke="hsl(var(--primary))" strokeWidth="1">
          <line className="controller-path" x1="100" y1="150" x2="120" y2="150" style={{ strokeDasharray: 30, strokeDashoffset: 30 }} />
          <line className="controller-path" x1="100" y1="160" x2="130" y2="160" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
          <line className="controller-path" x1="380" y1="150" x2="410" y2="150" style={{ strokeDasharray: 30, strokeDashoffset: 30 }} />
          <line className="controller-path" x1="370" y1="160" x2="410" y2="160" style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
        </g>
      </svg>

      {/* Loading text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-display text-sm tracking-[0.3em] text-muted-foreground uppercase">
        Cargando experiencia
      </div>
    </div>
  );
};

export default LoadingScreen;
