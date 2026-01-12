import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Zap, Swords } from 'lucide-react';

// Import character images
import kiraImage from '@/assets/characters/kira.png';
import venomImage from '@/assets/characters/venom.png';
import novaImage from '@/assets/characters/nova.png';
import titanImage from '@/assets/characters/titan.png';

interface Character {
  id: number;
  name: string;
  title: string;
  description: string;
  faction: string;
  race: string;
  accentColor: string;
  image: string;
  stats: {
    strength: number;
    speed: number;
    defense: number;
  };
}

const characters: Character[] = [
  {
    id: 1,
    name: 'KIRA',
    title: 'Guerrera del Futuro',
    description: 'Portadora de la espada ancestral de su familia y el escudo de plasma. Lucha por proteger lo que queda de la humanidad en una ciudad futurista devastada. Sus hazañas heroicas han inspirado a miles de guerreros.',
    faction: 'Legión Aurora',
    race: 'Humana',
    accentColor: 'cyan',
    image: kiraImage,
    stats: { strength: 75, speed: 85, defense: 90 },
  },
  {
    id: 2,
    name: 'VENOM',
    title: 'Maestro del Sigilo',
    description: 'Experto en las artes prohibidas y técnicas de asesinato silencioso. Sus dagas gemelas han acabado con incontables enemigos bajo la luz de la luna. Un asesino legendario que actúa desde las sombras.',
    faction: 'Hermandad Oscura',
    race: 'Desconocida',
    accentColor: 'red',
    image: venomImage,
    stats: { strength: 70, speed: 95, defense: 60 },
  },
  {
    id: 3,
    name: 'NOVA',
    title: 'Tecno-Maga',
    description: 'Fusión perfecta entre magia ancestral y tecnología avanzada. Su guante robótico amplifica sus hechizos mientras su grimorio flotante revela secretos arcanos del universo.',
    faction: 'Academia Arcana',
    race: 'Semi-Élfica',
    accentColor: 'blue',
    image: novaImage,
    stats: { strength: 60, speed: 70, defense: 75 },
  },
  {
    id: 4,
    name: 'TITAN',
    title: 'El Indestructible',
    description: 'Guerrero vikingo que desafía las leyes del tiempo, combinando la fuerza ancestral con armamento moderno. Su presencia en el campo de batalla es legendaria e infunde terror en sus enemigos.',
    faction: 'Clanes del Norte',
    race: 'Gigante',
    accentColor: 'amber',
    image: titanImage,
    stats: { strength: 95, speed: 55, defense: 90 },
  },
];

const CharactersSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const characterX = useTransform(mouseX, [-500, 500], [20, -20]);
  const characterY = useTransform(mouseY, [-500, 500], [15, -15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1));
  };

  const activeCharacter = characters[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="personajes"
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Background with yellow accent like reference */}
      <div className="absolute inset-0">
        {/* Yellow geometric accent top-right */}
        <motion.div
          className="absolute -top-20 right-1/4 w-[600px] h-[400px] bg-yellow-400/90"
          style={{
            clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="charGrid" patternUnits="userSpaceOnUse" width="60" height="60">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#charGrid)" className="text-foreground" />
          </svg>
        </div>

        {/* Large watermark text behind */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.span
            key={activeCharacter.name}
            className="text-[20vw] font-display font-black text-foreground/[0.03] whitespace-nowrap select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeCharacter.name}
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left sidebar - Character selector */}
        <div className="w-28 flex flex-col items-center py-8 z-20">
          {/* Up navigation arrow */}
          <motion.button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all mb-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>

          {/* Character portrait circles */}
          <div className="flex flex-col gap-4">
            {characters.map((char, index) => (
              <motion.button
                key={char.id}
                onClick={() => setActiveIndex(index)}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active state - dotted ring animation */}
                {index === activeIndex && (
                  <motion.div
                    className="absolute -inset-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 72 72">
                      <motion.circle
                        cx="36"
                        cy="36"
                        r="34"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </svg>
                  </motion.div>
                )}
                
                {/* Portrait circle with face thumbnail */}
                <div
                  className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all duration-300 ${
                    index === activeIndex 
                      ? 'border-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]' 
                      : 'border-border hover:border-foreground/50 grayscale hover:grayscale-0'
                  }`}
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top scale-[2] translate-y-2"
                  />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Down navigation arrow */}
          <motion.button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all mt-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Info panel - Left side */}
        <div className="w-[400px] flex flex-col justify-center pl-4 pr-8 z-20">
          {/* REC indicator and counter */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-display text-muted-foreground">[</span>
              <span className="text-sm font-display font-bold text-primary">REC</span>
              <span className="text-sm font-display text-muted-foreground">]</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground font-mono">MISSION-DEPENDENT PAYLOAD</span>
          </div>

          {/* Character name and counter */}
          <div className="flex items-baseline gap-4 mb-3">
            <span className="text-sm text-muted-foreground font-mono">{activeCharacter.name}</span>
            <span className="text-sm text-muted-foreground font-mono">
              {(activeIndex + 1).toString().padStart(2, '0')} / {characters.length.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Chevron icons row */}
          <div className="flex gap-1 mb-8">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="text-muted-foreground/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <svg width="24" height="20" viewBox="0 0 24 20" fill="currentColor">
                  <path d="M4 0 L12 10 L4 20 L8 20 L16 10 L8 0 Z" />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Character title with icons */}
          <motion.div
            key={activeCharacter.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-primary" />
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-muted-foreground">[</span>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {activeCharacter.name}
              </h3>
              <span className="text-muted-foreground">]</span>
            </div>

            {/* Faction and Race tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
                  Facción
                </span>
                <span className="px-3 py-1 bg-muted text-foreground text-xs">
                  {activeCharacter.faction}
                </span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
                  Raza
                </span>
                <span className="px-3 py-1 bg-muted text-foreground text-xs">
                  {activeCharacter.race}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              "{activeCharacter.description}"
            </p>

            {/* Title */}
            <p className="text-sm text-foreground/80 leading-relaxed max-w-sm">
              <span className="font-medium">{activeCharacter.title}.</span> Las hazañas heroicas de este guerrero han dado lugar a una variedad de historias, relatos e incluso rumores.
            </p>

            {/* Stats bars */}
            <div className="mt-8 space-y-3">
              {[
                { name: 'ATK', value: activeCharacter.stats.strength },
                { name: 'SPD', value: activeCharacter.stats.speed },
                { name: 'DEF', value: activeCharacter.stats.defense },
              ].map((stat, i) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-8">{stat.name}</span>
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-primary w-8">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main character display - Right side */}
        <div className="flex-1 flex items-center justify-end relative">
          {/* Character image with parallax */}
          <motion.div
            className="relative h-full w-full flex items-end justify-center"
            style={{ x: characterX, y: characterY }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeCharacter.id}
                src={activeCharacter.image}
                alt={activeCharacter.name}
                className="h-[95vh] w-auto object-contain object-bottom drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.3))',
                }}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </AnimatePresence>
          </motion.div>

          {/* 2D button indicator */}
          <div className="absolute bottom-8 right-8 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full border border-border">
            <span className="text-xs font-mono text-foreground">2D</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharactersSection;
