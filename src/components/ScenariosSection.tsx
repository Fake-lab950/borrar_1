import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Scenario {
  id: number;
  name: string;
  description: string;
  image: string;
  silhouette: React.ReactNode;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    name: "Neo Tokyo 2099",
    description: "A sprawling cyberpunk metropolis where neon lights pierce through perpetual smog. Towering megastructures house corporate overlords while street-level markets buzz with underground tech traders. Battle across rooftops, through holographic billboards, and in the depths of the cyber-underground.",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&h=600&fit=crop",
    silhouette: (
      <svg viewBox="0 0 100 200" className="w-full h-full">
        <path d="M10 200 L10 80 L20 70 L20 40 L30 30 L30 60 L40 50 L40 20 L50 10 L50 50 L60 40 L60 70 L70 60 L70 30 L80 40 L80 80 L90 90 L90 200 Z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 2,
    name: "Elderwood Forest",
    description: "An ancient mystical forest where massive trees reach into the clouds and magic flows through every root and branch. Hidden elven ruins hold secrets of forgotten civilizations. Navigate treacherous canopy bridges, enchanted clearings, and the depths of hollow giant trees.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=600&fit=crop",
    silhouette: (
      <svg viewBox="0 0 100 200" className="w-full h-full">
        <path d="M50 10 L30 50 L40 50 L20 90 L35 90 L10 140 L30 140 L30 200 L70 200 L70 140 L90 140 L65 90 L80 90 L60 50 L70 50 Z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 3,
    name: "Metro Prime",
    description: "A modern urban jungle where glass and steel towers reflect the chaos below. Highway overpasses, shopping districts, and construction sites create a multi-layered battlefield. Use the urban environment to your advantage—from rooftop chases to underground parking lot ambushes.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop",
    silhouette: (
      <svg viewBox="0 0 100 200" className="w-full h-full">
        <path d="M5 200 L5 100 L15 100 L15 80 L25 80 L25 120 L35 120 L35 60 L45 60 L45 100 L55 100 L55 40 L65 40 L65 90 L75 90 L75 70 L85 70 L85 110 L95 110 L95 200 Z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 4,
    name: "Verdun Trenches",
    description: "The mud-soaked battlefields of the Great War, where barbed wire and shell craters define the landscape. Abandoned tanks rust in no-man's land while artillery echoes in the distance. Navigate through trench networks, bombed-out villages, and poisonous gas clouds.",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200&h=600&fit=crop",
    silhouette: (
      <svg viewBox="0 0 100 200" className="w-full h-full">
        <path d="M0 200 L0 160 L10 155 L15 165 L25 150 L30 160 L40 145 L45 155 L55 140 L60 150 L70 135 L75 145 L85 130 L90 140 L100 125 L100 200 Z" fill="currentColor" />
        <circle cx="30" cy="170" r="8" fill="currentColor" />
        <circle cx="70" cy="165" r="6" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 5,
    name: "Abyssal Depths",
    description: "Beneath the waves lies a world of wonder and terror. Sunken ships, ancient underwater temples, and bioluminescent coral reefs create an otherworldly arena. Pressure suits and submarines enable combat in the crushing depths where sea monsters lurk in the shadows.",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=600&fit=crop",
    silhouette: (
      <svg viewBox="0 0 100 200" className="w-full h-full">
        <path d="M0 50 Q25 30 50 50 Q75 70 100 50 L100 80 Q75 100 50 80 Q25 60 0 80 Z" fill="currentColor" />
        <path d="M0 100 Q25 80 50 100 Q75 120 100 100 L100 130 Q75 150 50 130 Q25 110 0 130 Z" fill="currentColor" />
        <path d="M0 150 Q25 130 50 150 Q75 170 100 150 L100 200 L0 200 Z" fill="currentColor" />
      </svg>
    )
  }
];

const ScenariosSection = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);

  const handlePrevious = () => {
    setActiveScenario((prev) => (prev === 0 ? scenarios.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveScenario((prev) => (prev === scenarios.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      ref={sectionRef}
      id="mapa"
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      {/* Background Silhouettes */}
      <div className="absolute inset-0 flex justify-around items-stretch pointer-events-none overflow-hidden">
        {scenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            className="relative flex-1 text-muted/30"
            style={{
              transform: `skewX(-5deg) translateX(${index * 2}px)`,
            }}
          >
            <div className="absolute inset-0 flex items-end justify-center opacity-50">
              {scenario.silhouette}
            </div>
          </div>
        ))}
      </div>

      {/* Scrolling Title */}
      <div className="relative overflow-hidden mb-16">
        <motion.div 
          className="whitespace-nowrap"
          style={{ x: titleX }}
        >
          <h2 className="inline-block text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-foreground to-neon-green uppercase tracking-wider">
            World of Smash
            <span className="mx-16 text-muted">•</span>
            World of Smash
            <span className="mx-16 text-muted">•</span>
            World of Smash
            <span className="mx-16 text-muted">•</span>
            World of Smash
          </h2>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        {/* Scenario Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-border/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScenario}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[21/9] w-full"
            >
              <img
                src={scenarios[activeScenario].image}
                alt={scenarios[activeScenario].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              {/* Scenario Name Overlay */}
              <motion.h3
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-6 left-6 text-3xl md:text-5xl font-bold text-foreground"
              >
                {scenarios[activeScenario].name}
              </motion.h3>
            </motion.div>
          </AnimatePresence>

          {/* Scenario Indicators */}
          <div className="absolute top-4 right-4 flex gap-2">
            {scenarios.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveScenario(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeScenario 
                    ? 'bg-neon-green scale-125' 
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation & Description */}
        <div className="flex flex-col items-center">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-6 mb-8">
            <motion.button
              onClick={handlePrevious}
              className="group relative w-14 h-14 rounded-full border-2 border-neon-green/50 bg-background/50 backdrop-blur-sm flex items-center justify-center hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-neon-green group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>

            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-neon-green">
                {String(activeScenario + 1).padStart(2, '0')}
              </span>
              <span className="text-xl text-muted">/</span>
              <span className="text-xl text-muted">
                {String(scenarios.length).padStart(2, '0')}
              </span>
            </div>

            <motion.button
              onClick={handleNext}
              className="group relative w-14 h-14 rounded-full border-2 border-neon-green/50 bg-background/50 backdrop-blur-sm flex items-center justify-center hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6 text-neon-green group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeScenario}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl text-center text-lg text-muted-foreground leading-relaxed"
            >
              {scenarios[activeScenario].description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />
    </section>
  );
};

export default ScenariosSection;
