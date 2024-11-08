// src/components/home/DiscoverySection.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Star,
  ExternalLink,
  Play,
  Info,
  TrendingUp,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Movie } from '../../services/tmdb';
import { tmdbService } from '../../services/tmdb';

// Types
interface Franchise {
  id: string;
  name: string;
  logo: string;
  link: string;
  description: string;
}

interface AwardShow {
  id: string;
  name: string;
  year: string;
  description: string;
  image: string;
  color: string;
  stats: {
    nominations: number;
    categories: number;
    years: number;
  };
  wikiLink: string;
}

// Data
const franchises: Franchise[] = [
  { 
    id: 'netflix',
    name: 'Netflix',
    logo: '/Netflix.png',
    link: 'https://netflix.com',
    description: 'Stream award-winning originals and more'
  },
  { 
    id: 'disney',
    name: 'Disney+',
    logo: '/Disney.png',
    link: 'https://disney.com',
    description: 'Where entertainment comes alive'
  },
  { 
    id: 'hbo',
    name: 'HBO Max',
    logo: '/HBO_Max.png',
    link: 'https://hbomax.com',
    description: 'Premium entertainment experience'
  },
  { 
    id: 'amazon',
    name: 'Prime Video',
    logo: '/amazon.png',
    link: 'https://amazon.com/prime',
    description: 'Watch anywhere, anytime'
  },
  { 
    id: 'hulu',
    name: 'Hulu',
    logo: '/Hulu.png',
    link: 'https://hulu.com',
    description: 'All your TV in one place'
  },
  { 
    id: 'youtube',
    name: 'YouTube',
    logo: '/YouTube.png',
    link: 'https://youtube.com',
    description: 'The home of video content'
  },
  { 
    id: 'apple',
    name: 'Apple TV+',
    logo: '/Apple_TV.png',
    link: 'https://tv.apple.com',
    description: 'Original stories from the best minds'
  },
  { 
    id: 'imdb',
    name: 'IMDb TV',
    logo: '/IMDb.png',
    link: 'https://imdb.com',
    description: 'Your guide to entertainment'
  }
];

const awardShows: AwardShow[] = [
  {
    id: 'oscars',
    name: 'Academy Awards',
    year: '2024',
    description: 'The most prestigious recognition of excellence in cinematic achievements. Celebrating outstanding contributions to the art of motion pictures.',
    image: '/oscars.jpg',
    color: 'from-[#C5A572]',
    stats: {
      nominations: 124,
      categories: 24,
      years: 96
    },
    wikiLink: 'https://en.wikipedia.org/wiki/Academy_Awards'
  },
  {
    id: 'golden-globes',
    name: 'Golden Globe Awards',
    year: '2024',
    description: 'Honoring excellence in both domestic and international film and television. Recognizing the best in entertainment across multiple categories.',
    image: '/golden-globes.jpg',
    color: 'from-[#FFD700]',
    stats: {
      nominations: 89,
      categories: 27,
      years: 81
    },
    wikiLink: 'https://en.wikipedia.org/wiki/Golden_Globe_Awards'
  },
  {
    id: 'bafta',
    name: 'BAFTA Awards',
    year: '2024',
    description: 'The British Academy of Film and Television Arts recognizes excellence in film, celebrating both British and international contributions.',
    image: '/BAFTA.jpg',
    color: 'from-[#7B9BC4]',
    stats: {
      nominations: 92,
      categories: 25,
      years: 77
    },
    wikiLink: 'https://en.wikipedia.org/wiki/BAFTA_Awards'
  }
];

// Components
const FranchiseScroll = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative overflow-hidden py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Edges */}
      <div className="absolute left-0 w-32 h-full bg-gradient-to-r 
        from-kemo-black to-transparent z-10" />
      <div className="absolute right-0 w-32 h-full bg-gradient-to-l 
        from-kemo-black to-transparent z-10" />

      <div className={`flex gap-16 ${!isHovered ? 'animate-scroll' : ''}`}>
        {[...franchises, ...franchises].map((franchise, index) => (
          <a
            key={`${franchise.id}-${index}`}
            href={franchise.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none group"
          >
            <div className="relative transform transition-all duration-500 
              hover:-translate-y-4 hover:scale-110">
              <div className="h-24 md:h-32 relative">
                <img
                  src={franchise.logo}
                  alt={franchise.name}
                  className="h-full w-auto object-contain
                    opacity-75 group-hover:opacity-100
                    transition-all duration-300
                    filter saturate-50 group-hover:saturate-100"
                />
              </div>
              
              {/* Hover Info */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2
                w-48 opacity-0 group-hover:opacity-100 
                transition-all duration-300 scale-95 group-hover:scale-100">
                <div className="bg-kemo-gray-800/90 backdrop-blur-sm
                  rounded-lg p-3 text-center shadow-xl border border-white/10">
                  <p className="text-white font-medium mb-1">
                    {franchise.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    {franchise.description}
                  </p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const AwardsShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {awardShows.map((award, index) => (
        <motion.a
          key={award.id}
          href={award.wikiLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="relative h-[400px] rounded-2xl overflow-hidden
            shadow-lg shadow-black/20">
            {/* Background Image & Overlays */}
            <div className="absolute inset-0">
              <img
                src={award.image}
                alt={award.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t 
                from-kemo-black via-kemo-black/50 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br 
                ${award.color}/20 to-transparent mix-blend-overlay
                group-hover:opacity-75 transition-opacity duration-300`} />
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 
              transform transition-all duration-500 ease-out
              group-hover:translate-y-0 translate-y-12">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2
                    drop-shadow-lg">
                    {award.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-brand-gold" />
                    <span className="text-brand-gold font-medium">
                      {award.year} Edition
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 
                opacity-0 group-hover:opacity-100 
                transition-all duration-300 delay-100
                transform group-hover:translate-y-0 translate-y-4">
                {Object.entries(award.stats).map(([key, value]) => (
                  <div key={key} 
                    className="bg-white/10 rounded-lg p-3 text-center
                      backdrop-blur-sm">
                    <div className="text-xl font-bold text-white">
                      {value}
                    </div>
                    <div className="text-xs text-white/70 capitalize">
                      {key}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-white/90 text-sm mb-4 leading-relaxed
                opacity-0 group-hover:opacity-100 
                transition-all duration-300 delay-150
                transform group-hover:translate-y-0 translate-y-4">
                {award.description}
              </p>

              {/* Learn More Link */}
              <div className="flex items-center text-brand-gold 
                opacity-0 group-hover:opacity-100 
                transition-all duration-300 delay-200">
                <span className="text-sm font-medium">Learn More</span>
                <ExternalLink className="w-4 h-4 ml-2 
                  transform group-hover:translate-x-1 
                  transition-transform duration-300" />
              </div>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
};

const SectionHeader = ({ 
  title, 
  icon: Icon 
}: { 
  title: string;
  icon: React.ElementType;
}) => (
  <div className="flex items-center space-x-3 mb-8">
    <div className="p-2 rounded-lg bg-brand-gold/10">
      <Icon className="w-6 h-6 text-brand-gold" />
    </div>
    <h2 className="text-2xl md:text-3xl font-display font-bold 
      bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
      {title}
    </h2>
  </div>
);

// Main Component
export function DiscoverySection() {
  return (
    <div className="py-24 space-y-24">
      {/* Streaming Services */}
      <section>
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Streaming Platforms" 
            icon={TrendingUp}
          />
          <FranchiseScroll />
        </div>
      </section>

      {/* Awards Section */}
      <section>
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Award Shows" 
            icon={Trophy}
          />
          <AwardsShowcase />
        </div>
      </section>
    </div>
  );
}