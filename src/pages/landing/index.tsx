// src/pages/Landing.tsx
import { Hero } from '../../components/hero/Hero';
import FeaturesGrid from '../../components/landing/FeaturesGrid';
import MovieShowcase from '../../components/landing/MovieShowcase';
import FAQ from '../../components/landing/FAQ';
import { Header } from '../../components/header/Header';
import Footer from '../../components/layout/Footer';
import { GenreShowcase } from '../../components/authrnticated/home/GenreShowcase';

export default function Landing() {
    return (
        <div className="min-h-screen bg-kemo-black">
          <Header />
          <Hero />
          <FeaturesGrid />
          <GenreShowcase />
          <MovieShowcase />
          <FAQ />
          <Footer />
        </div>
      );
}