import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import heroImage from '@/assets/hero-characters.jpg';

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    });

    gsap.from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });

    gsap.from('.hero-button', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'back.out(1.7)',
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-screen flex items-end justify-start overflow-hidden pb-20"
    >
      {/* Hero background image */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img 
          src={heroImage} 
          alt="Gaming characters" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing lines */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary via-primary/50 to-transparent"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 text-left px-8 md:px-16 lg:px-24 max-w-3xl">
        <motion.div
          className="mb-4 inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-2 text-xs font-display tracking-widest text-primary border border-primary/30 rounded-full uppercase">
            Nueva Temporada
          </span>
        </motion.div>

        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          <span className="block text-foreground">EL UNIVERSO</span>
          <span className="block neon-text">GAMING</span>
        </h1>

        <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-body">
          Explora mundos infinitos, domina épicas batallas y vive aventuras sin límites
        </p>

        {/* CTA Button */}
        <motion.button
          className="hero-button group relative overflow-hidden rounded-xl bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={!isHovered ? { x: [0, -3, 3, -3, 3, 0] } : {}}
          transition={{ 
            duration: 0.6, 
            repeat: isHovered ? 0 : Infinity, 
            repeatDelay: 3 
          }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{ 
              width: isHovered ? 220 : 64,
              height: 64,
              paddingLeft: isHovered ? 24 : 0,
              paddingRight: isHovered ? 24 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Play className="w-6 h-6 fill-current flex-shrink-0" />
            
            <motion.span
              className="ml-3 whitespace-nowrap overflow-hidden"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                width: isHovered ? 'auto' : 0,
              }}
              transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
            >
              Juega ahora
            </motion.span>

            <motion.div
              className="ml-2"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
              }}
              transition={{ duration: 0.2, delay: isHovered ? 0.15 : 0 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-glow pointer-events-none" />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
