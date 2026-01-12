import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Sword, Sparkles, Zap } from 'lucide-react';
import ParticleCanvas from './weapons/ParticleCanvas';
import FuturisticFrame from './weapons/FuturisticFrame';

interface Weapon {
  id: number;
  name: string;
  description: string;
  type: 'firearm' | 'physical' | 'magical' | 'elemental';
  stats: { damage: number; range: number; speed: number };
}

const weapons: Weapon[] = [
  {
    id: 1,
    name: 'Plasma Rifle X-7',
    description: 'Rifle de plasma de alta precisión con cargador de energía cuántica. Capaz de perforar escudos energéticos.',
    type: 'firearm',
    stats: { damage: 85, range: 90, speed: 70 },
  },
  {
    id: 2,
    name: 'Espada Némesis',
    description: 'Forjada en el núcleo de una estrella moribunda. Su filo molecular corta cualquier material conocido.',
    type: 'physical',
    stats: { damage: 95, range: 30, speed: 85 },
  },
  {
    id: 3,
    name: 'Bastón del Vacío',
    description: 'Canaliza la energía del vacío interdimensional. Cada golpe distorsiona el espacio-tiempo.',
    type: 'magical',
    stats: { damage: 80, range: 60, speed: 65 },
  },
  {
    id: 4,
    name: 'Guanteletes Tormenta',
    description: 'Control total sobre los elementos atmosféricos. Invoca rayos y tornados a voluntad.',
    type: 'elemental',
    stats: { damage: 75, range: 70, speed: 80 },
  },
  {
    id: 5,
    name: 'Cañón de Singularidad',
    description: 'Dispara micro agujeros negros controlados. El arma más destructiva jamás creada.',
    type: 'firearm',
    stats: { damage: 100, range: 85, speed: 40 },
  },
  {
    id: 6,
    name: 'Hacha Primordial',
    description: 'Tallada del primer árbol del universo. Cada impacto libera energía vital ancestral.',
    type: 'physical',
    stats: { damage: 90, range: 25, speed: 60 },
  },
];

const typeIcons = {
  firearm: Flame,
  physical: Sword,
  magical: Sparkles,
  elemental: Zap,
};

const typeLabels = {
  firearm: 'ARMA DE FUEGO',
  physical: 'ARMA FÍSICA',
  magical: 'ARMA MÁGICA',
  elemental: 'ARMA ELEMENTAL',
};

const WeaponsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activeWeapon = weapons[activeIndex];
  const TypeIcon = typeIcons[activeWeapon.type];

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev === 0 ? weapons.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 100);
    }, 150);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev === weapons.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 100);
    }, 150);
  };

  return (
    <section
      id="armas"
      ref={sectionRef}
      className="relative min-h-screen bg-background overflow-hidden py-20"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="weaponGrid" patternUnits="userSpaceOnUse" width="40" height="40">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#weaponGrid)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full">
        {/* Top labels */}
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-muted-foreground tracking-[0.3em] uppercase">▪ LORE</span>
          </motion.div>
          
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-muted-foreground tracking-[0.2em]">■ WORLD OF SMASH</span>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 min-h-[600px]">
          {/* Left side - Type indicator */}
          <motion.div
            key={activeWeapon.type}
            className="flex flex-col items-center lg:items-start gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-secondary/50 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                <TypeIcon className="w-10 h-10 text-primary" />
              </div>
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-primary" />
            </div>
            <span className="text-[10px] font-display text-muted-foreground tracking-[0.2em]">
              {typeLabels[activeWeapon.type]}
            </span>
          </motion.div>

          {/* Center - Particle weapon display with futuristic frame */}
          <div className="relative flex-1 flex items-center justify-center">
            <div className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px]">
              {/* Futuristic circular frame */}
              <FuturisticFrame size={400} isActive={true} />
              
              {/* Particle weapon canvas */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ParticleCanvas 
                  weaponType={activeWeapon.type}
                  isTransitioning={isTransitioning}
                  width={400}
                  height={400}
                />
              </div>

              {/* Ambient glow */}
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>

          {/* Right side - Weapon info */}
          <div className="lg:max-w-sm w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWeapon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center lg:text-left"
              >
                {/* Weapon name */}
                <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {activeWeapon.name}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {activeWeapon.description}
                </p>

                {/* Stats */}
                <div className="space-y-4">
                  {Object.entries(activeWeapon.stats).map(([key, value], index) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground uppercase tracking-wider">
                          {key === 'damage' ? 'Daño' : key === 'range' ? 'Alcance' : 'Velocidad'}
                        </span>
                        <span className="text-primary font-display">{value}%</span>
                      </div>
                      <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-primary/60"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              {/* Progress indicator */}
              <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden max-w-[120px]">
                <motion.div 
                  className="h-full bg-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeIndex + 1) / weapons.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Counter */}
              <span className="text-xs font-display text-muted-foreground">
                {activeIndex + 1}/{weapons.length}
              </span>

              {/* Nav buttons */}
              <div className="flex gap-2">
                <motion.button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center text-foreground border border-muted/20 hover:border-primary/50 hover:bg-primary/10 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center text-foreground border border-muted/20 hover:border-primary/50 hover:bg-primary/10 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeaponsSection;
