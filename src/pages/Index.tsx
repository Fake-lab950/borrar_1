import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CharactersSection from '@/components/CharactersSection';
import WeaponsSection from '@/components/WeaponsSection';
import ScenariosSection from '@/components/ScenariosSection';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative">
          <Navigation />
          
          <main className="ml-[60px]">
            <HeroSection />
            <CharactersSection />
            <WeaponsSection />
            <ScenariosSection />
          </main>
        </div>
      )}
    </>
  );
};

export default Index;
