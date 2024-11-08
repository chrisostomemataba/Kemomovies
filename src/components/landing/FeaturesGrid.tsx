import { useState } from 'react';
import { Play, Tv, Download, Users, Trophy, Film, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

interface FeatureCardProps extends Feature {
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  index,
  isHovered,
  onHover
}: FeatureCardProps) => (
  <div 
    className={`
      relative group rounded-2xl p-8 h-full
      transition-all duration-500 ease-out
      hover:shadow-[0_0_40px_rgba(230,179,37,0.1)]
      ${isHovered ? 'scale-105 z-20' : 'z-10'}
      bg-gradient-to-br from-kemo-dark/80 to-kemo-gray-800/80
      backdrop-blur-sm border border-kemo-gray-700/50
      hover:border-brand-gold/30
    `}
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onHover(null)}
  >
    {/* Hover Gradient Overlay */}
    <div 
      className={`
        absolute inset-0 rounded-2xl transition-opacity duration-500
        bg-gradient-to-br opacity-0 group-hover:opacity-100
      `}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        opacity: isHovered ? 0.15 : 0
      }}
    />

    {/* Content Wrapper */}
    <div className="relative z-10 flex flex-col h-full">
      {/* Icon Container */}
      <div className={`
        w-16 h-16 rounded-2xl mb-6
        flex items-center justify-center
        transition-all duration-500 ease-out
        bg-gradient-to-br from-kemo-gray-700 to-kemo-gray-800
        group-hover:from-brand-gold/20 group-hover:to-brand-darker/20
        shadow-lg shadow-black/30
      `}>
        <Icon 
          className={`
            w-8 h-8 transition-all duration-500
            text-brand-gold group-hover:text-white
            group-hover:scale-110
          `}
        />
      </div>

      {/* Title */}
      <h3 className={`
        text-2xl font-display font-bold mb-4
        transition-colors duration-300
        text-white group-hover:text-brand-gold
      `}>
        {title}
      </h3>

      {/* Description */}
      <p className={`
        text-base leading-relaxed mb-6
        transition-colors duration-300
        text-kemo-gray-300 group-hover:text-white/90
      `}>
        {description}
      </p>

      {/* Learn More Link */}
      <div className={`
        mt-auto flex items-center space-x-2
        text-sm font-medium transition-colors duration-300
        text-brand-gold group-hover:text-white
      `}>
        <span>Learn more</span>
        <span className="transform transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  </div>
);

export default function FeaturesGrid() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features: Feature[] = [
    {
      icon: Play,
      title: "Premium Streaming",
      description: "Experience cinema-quality streaming with 4K HDR and Dolby Atmos sound, bringing Hollywood into your home.",
      gradientFrom: 'rgb(230, 179, 37)',
      gradientTo: 'rgb(230, 160, 15)'
    },
    {
      icon: Download,
      title: "Download & Watch",
      description: "Take your entertainment anywhere. Download your favorite shows and movies for offline viewing.",
      gradientFrom: 'rgb(230, 179, 37)',
      gradientTo: 'rgb(247, 198, 75)'
    },
    {
      icon: Users,
      title: "Multiple Profiles",
      description: "Create up to 5 unique profiles. Each profile gets personalized recommendations based on viewing habits.",
      gradientFrom: 'rgb(230, 179, 37)',
      gradientTo: 'rgb(230, 160, 15)'
    },
    {
      icon: Tv,
      title: "Watch Everywhere",
      description: "Stream seamlessly across all your devices. Start on your phone and continue watching on your TV.",
      gradientFrom: 'rgb(247, 198, 75)',
      gradientTo: 'rgb(230, 160, 15)'
    },
    {
      icon: Trophy,
      title: "Award Winners",
      description: "Access exclusive premieres and award-winning originals before anyone else. Quality content curated just for you.",
      gradientFrom: 'rgb(230, 179, 37)',
      gradientTo: 'rgb(247, 198, 75)'
    },
    {
      icon: Film,
      title: "Latest Releases",
      description: "Stay current with weekly new releases. Get instant access to the latest movies and shows as they premiere.",
      gradientFrom: 'rgb(230, 179, 37)',
      gradientTo: 'rgb(230, 160, 15)'
    }
  ];

  return (
    <section className="relative py-32 bg-kemo-black overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-brand-gold/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-darker/5 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
            Elevate Your
            <span className="bg-gradient-to-r from-brand-gold to-brand-lighter text-transparent bg-clip-text"> Entertainment</span>
          </h2>
          <p className="text-lg md:text-xl text-kemo-gray-300 leading-relaxed max-w-3xl mx-auto">
            Experience movies and shows like never before with our premium features designed for 
            the ultimate entertainment journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
              isHovered={hoveredFeature === index}
              onHover={setHoveredFeature}
            />
          ))}
        </div>

        {/* Devices Showcase */}
        <div className=" relative">
          <div className="max-w-6xl mx-auto relative">
            {/* Glow Effects */}
            <div className="absolute inset-0 bg-gradient-radial from-brand-gold/10 via-transparent to-transparent opacity-60" />
            
            <img
              src="/public/mobile-devices.png"
              alt="Watch on all devices"
              className="w-full h-auto relative z-10 transform hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-kemo-black via-transparent to-transparent" />
          </div>

          <div className="text-center  relative z-10">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Available on All Your Devices
            </h3>
            <p className="text-lg text-kemo-gray-300 max-w-2xl mx-auto">
              Stream seamlessly across all your devices. Start on your phone,
              continue on your tablet, and finish on your smart TV.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}