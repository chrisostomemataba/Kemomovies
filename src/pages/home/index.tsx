// src/pages/home/index.tsx
import ContentShowcase from "../../components/authrnticated/home/ContentShowcase";
import { DiscoverySection } from "../../components/authrnticated/home/DiscoverySection";
import { GenreShowcase } from "../../components/authrnticated/home/GenreShowcase";
import { Hero } from "../../components/authrnticated/home/Hero";
import { Navbar } from "../../components/layout/Navbar";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-kemo-black pb-20">
        <Navbar />
      <Hero />
     <ContentShowcase />
     <GenreShowcase />
     <DiscoverySection />
    </div>
  );
}