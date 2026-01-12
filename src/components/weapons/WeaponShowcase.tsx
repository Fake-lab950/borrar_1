import { useState } from 'react';
import WeaponParticleSystem from './WeaponParticleSystem';
import { weaponPaths, WeaponType } from './weaponPaths';

interface WeaponInfo {
  name: string;
  type: WeaponType;
  description: string;
  stats: {
    damage: number;
    fireRate: number;
    accuracy: number;
    range: number;
  };
}

const weapons: WeaponInfo[] = [
  {
    name: 'PHANTOM-7',
    type: 'assaultRifle',
    description: 'Versatile assault rifle with balanced stats for all combat situations.',
    stats: { damage: 75, fireRate: 80, accuracy: 70, range: 65 },
  },
  {
    name: 'VIPER STRIKE',
    type: 'sniperRifle',
    description: 'Precision long-range rifle with devastating single-shot damage.',
    stats: { damage: 95, fireRate: 25, accuracy: 95, range: 100 },
  },
  {
    name: 'SHADOW-9',
    type: 'pistol',
    description: 'Lightweight sidearm perfect for close-quarters combat.',
    stats: { damage: 45, fireRate: 70, accuracy: 80, range: 30 },
  },
  {
    name: 'THUNDER BLAST',
    type: 'shotgun',
    description: 'Devastating spread weapon for room clearing operations.',
    stats: { damage: 90, fireRate: 40, accuracy: 35, range: 20 },
  },
  {
    name: 'SPECTRE-X',
    type: 'smg',
    description: 'High fire rate SMG for aggressive close-range gameplay.',
    stats: { damage: 35, fireRate: 95, accuracy: 55, range: 35 },
  },
  {
    name: 'HELLFIRE',
    type: 'rocketLauncher',
    description: 'Heavy explosive launcher for vehicle and structure destruction.',
    stats: { damage: 100, fireRate: 15, accuracy: 60, range: 80 },
  },
];

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-primary font-mono">{value}</span>
    </div>
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const WeaponShowcase = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedWeapon = weapons[selectedIndex];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/95 to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ARSENAL
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced weaponry rendered with 3000+ particle edge-detection technology.
            Each weapon visualized through precision particle mapping.
          </p>
        </div>

        {/* Weapon selector tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {weapons.map((weapon, index) => (
            <button
              key={weapon.type}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 border ${
                index === selectedIndex
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                  : 'bg-transparent text-muted-foreground border-muted-foreground/30 hover:border-primary/50 hover:text-primary'
              }`}
            >
              {weapon.name}
            </button>
          ))}
        </div>

        {/* Main weapon display */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Particle canvas */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-lg" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
              <WeaponParticleSystem
                key={selectedWeapon.type}
                svgPath={weaponPaths[selectedWeapon.type]}
                width={400}
                height={200}
                particleCount={2500}
                edgeColor="hsl(var(--primary))"
                fillColor="hsl(var(--accent))"
                className="max-w-full"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-background border border-border text-xs text-muted-foreground rounded">
              Interactive • Hover to interact
            </div>
          </div>

          {/* Weapon info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {selectedWeapon.name}
              </h3>
              <p className="text-muted-foreground">
                {selectedWeapon.description}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Specifications
              </h4>
              <div className="space-y-3">
                <StatBar label="Damage" value={selectedWeapon.stats.damage} />
                <StatBar label="Fire Rate" value={selectedWeapon.stats.fireRate} />
                <StatBar label="Accuracy" value={selectedWeapon.stats.accuracy} />
                <StatBar label="Range" value={selectedWeapon.stats.range} />
              </div>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>~3000 particles • Edge-detection rendering • SVG path tracing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeaponShowcase;
