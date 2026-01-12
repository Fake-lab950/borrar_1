import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  BookOpen, 
  Map, 
  Image, 
  Newspaper, 
  User 
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Inicio', href: '#inicio' },
  { icon: Users, label: 'Personajes', href: '#personajes' },
  { icon: BookOpen, label: 'Historia', href: '#historia' },
  { icon: Map, label: 'Mapa', href: '#mapa' },
  { icon: Image, label: 'Galería', href: '#galeria' },
  { icon: Newspaper, label: 'Noticias', href: '#noticias' },
  { icon: User, label: 'Cuenta', href: '#cuenta' },
];

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.nav
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-sidebar shadow-lg"
      initial={{ width: 60 }}
      animate={{ width: isExpanded ? 200 : 60 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setHoveredIndex(null);
      }}
    >
      <ul className="flex flex-col py-4">
        {menuItems.map((item, index) => (
          <motion.li
            key={item.label}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <a
              href={item.href}
              className="flex items-center px-4 py-3 text-sidebar-foreground transition-colors relative z-10"
            >
              {/* Hover background */}
              <motion.div
                className="absolute inset-0 bg-sidebar-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Icon */}
              <motion.div
                className="relative z-10 flex items-center justify-center w-7 h-7"
                whileHover={{ scale: 1.1 }}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>

              {/* Label */}
              <motion.span
                className="relative z-10 ml-4 font-medium whitespace-nowrap overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ 
                  opacity: isExpanded ? 1 : 0, 
                  width: isExpanded ? 'auto' : 0 
                }}
                transition={{ duration: 0.2, delay: isExpanded ? 0.1 : 0 }}
              >
                {item.label}
              </motion.span>
            </a>

            {/* Active indicator line */}
            {hoveredIndex === index && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                layoutId="activeIndicator"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.li>
        ))}
      </ul>

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full opacity-50" />
    </motion.nav>
  );
};

export default Navigation;
