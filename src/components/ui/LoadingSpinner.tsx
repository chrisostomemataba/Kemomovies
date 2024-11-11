// src/components/ui/Loader.tsx
import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50
      bg-kemo-black/80 backdrop-blur-sm">
      <div className="bg-kemo-gray-900/90 p-8 rounded-2xl border border-white/10
        shadow-xl backdrop-blur-md">
        <div className="text-white/70 font-medium text-2xl flex items-center
          h-[40px] px-4">
          <span className="mr-2">loading</span>
          <div className="overflow-hidden relative">
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b 
              from-kemo-gray-900 via-transparent to-kemo-gray-900
              z-20 pointer-events-none" />
            
            {/* Animated Words */}
            <motion.div
              animate={{
                y: [0, -400],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col"
            >
              {[
                'movies',
                'trailers',
                'watchlist',
                'trending',
                'movies' // Repeated for smooth loop
              ].map((word, index) => (
                <span
                  key={index}
                  className="h-[40px] pl-2 text-brand-gold font-display"
                >
                  {word}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}