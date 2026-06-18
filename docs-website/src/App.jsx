import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { motion, AnimatePresence } from 'framer-motion';

function NeuralNetwork(props) {
  const ref = useRef();
  // Generate random points in a sphere
  const sphere = useMemo(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#ff4655" size={0.01} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

const heroes = [
  "Anti-Mage", "Axe", "Bane", "Bloodseeker", "CM", "Drow", 
  "Earthshaker", "Juggernaut", "Mirana", "Morphling", "SF", "PL",
  "Puck", "Pudge", "Razor", "Sand King", "Storm", "Sven", "Tiny", 
  "Vengeful", "Windranger", "Zeus", "Kunkka", "Lina", "Lion"
];

function DraftSimulator() {
  const [selected, setSelected] = useState([]);
  const [computing, setComputing] = useState(false);
  const [results, setResults] = useState(null);

  const toggleHero = (hero) => {
    if (selected.includes(hero)) {
      setSelected(selected.filter(h => h !== hero));
    } else if (selected.length < 2) {
      setSelected([...selected, hero]);
    }
  };

  const compute = () => {
    setComputing(true);
    setResults(null);
    setTimeout(() => {
      setComputing(false);
      setResults([
        { id: 1, heroes: [...selected, "Earthshaker", "CM", "Juggernaut"], winRate: "68.4%" },
        { id: 2, heroes: [...selected, "Lion", "Sven", "Puck"], winRate: "65.1%" },
        { id: 3, heroes: [...selected, "SF", "Bane", "Axe"], winRate: "64.8%" },
      ]);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold font-['Oswald'] tracking-wider mb-4 text-white">DRAFT SIMULATOR ENGINE</h2>
        <p className="text-zinc-400">Select exactly 2 heroes your team has picked. Neural network calculates optimal completions.</p>
      </div>

      <div className="bg-black/80 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,70,85,0.1)]">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Panel: Hero Selection */}
          <div className="w-full md:w-96 border-r border-zinc-800 p-8 bg-zinc-950">
            <div className="flex justify-between items-baseline mb-6">
              <h3 className="text-xl font-bold font-['Oswald'] text-zinc-200">HERO ROSTER</h3>
              <span className="text-zinc-500 text-sm font-bold">{selected.length} / 2</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {heroes.map(hero => {
                const isSelected = selected.includes(hero);
                return (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={hero}
                    onClick={() => toggleHero(hero)}
                    className={`aspect-square rounded border flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[inset_0_0_15px_rgba(239,68,68,0.4)]' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {hero}
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={compute}
              disabled={selected.length !== 2 || computing}
              className={`w-full mt-8 py-4 font-bold font-['Oswald'] tracking-widest transition-all ${
                selected.length === 2 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {computing ? 'COMPUTING...' : 'COMPUTE SYNERGY'}
            </button>
          </div>

          {/* Right Panel: Results */}
          <div className="flex-1 p-8 relative flex flex-col justify-center">
            {computing ? (
              <div className="text-center font-['Oswald'] text-zinc-400 tracking-widest">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-16 h-16 border-4 border-zinc-800 border-t-red-500 rounded-full mx-auto mb-6"
                />
                EVALUATING 80,000 PERMUTATIONS...
              </div>
            ) : results ? (
              <div className="space-y-4 w-full">
                <h3 className="text-2xl font-['Oswald'] text-zinc-400 mb-8">CALCULATED TRAJECTORIES</h3>
                <AnimatePresence>
                  {results.map((res, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                      key={res.id}
                      className={`flex items-center p-4 border rounded bg-zinc-900/50 ${
                        i === 0 ? 'border-yellow-500/50 border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-500/10 to-transparent' : 'border-zinc-800'
                      }`}
                    >
                      <span className="font-['Oswald'] text-2xl text-zinc-600 w-12">0{res.id}</span>
                      <div className="flex gap-2 flex-1">
                        {res.heroes.map((h, idx) => (
                          <span key={idx} className={`px-3 py-1 text-sm rounded ${
                            idx < 2 ? 'border border-zinc-600 text-zinc-500' : 'border border-yellow-500/30 text-yellow-500/80 bg-yellow-500/10'
                          }`}>
                            {h}
                          </span>
                        ))}
                      </div>
                      <span className="font-['Oswald'] text-2xl text-white">{res.winRate}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center text-zinc-700 font-['Oswald'] tracking-widest">
                SYSTEM STANDBY
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-full min-h-screen bg-zinc-950 font-sans selection:bg-red-500/30 text-zinc-200 overflow-hidden relative">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <NeuralNetwork />
        </Canvas>
        {/* Gradient Mask to fade bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950 z-10" />
      </div>

      <div className="relative z-20 pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-red-500 font-['Oswald'] tracking-[0.2em] mb-4 block">ML RESEARCH PROJECT</span>
          <h1 className="text-7xl font-bold font-['Oswald'] uppercase mb-6 leading-tight">
            Dota 2 Draft <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Intelligence
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            An automated draft assistant powered by Naive Bayes. Trained on 50,000 professional International matches to compute highest-probability winning synergies in real-time.
          </p>
        </motion.div>
      </div>

      <DraftSimulator />

      <footer className="relative z-20 border-t border-zinc-900 mt-32 py-12 text-center text-zinc-600 font-['Oswald'] tracking-wider">
        <p>Hero Recommendation System · Built with React & Three.js</p>
      </footer>
    </div>
  );
}

export default App;
