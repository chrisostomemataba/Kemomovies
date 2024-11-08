// src/components/landing/Footer.tsx
import { 
  Github, 
  Twitter, 
  Instagram, 
  Youtube, 
  Globe,
  ChevronDown 
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: typeof Github;
  href: string;
  label: string;
}

const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety Center", href: "/safety" },
      { label: "Community Guidelines", href: "/guidelines" },
      { label: "Contact Us", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Preferences", href: "/cookies" },
      { label: "Copyright", href: "/copyright" }
    ]
  }
];

const socialLinks: SocialLink[] = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Github, href: "https://github.com", label: "GitHub" }
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' }
];

export default function Footer() {
  return (
    <footer className="bg-kemo-black border-t border-kemo-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <a href="/" className="block">
              <span className="text-2xl font-playfair font-bold 
                bg-gradient-to-r from-brand-gold to-brand-lighter 
                bg-clip-text text-transparent">
                KemoMovies
              </span>
            </a>
            
            <p className="text-kemo-gray-300 text-sm leading-relaxed">
              Your premium destination for entertainment. 
              Stream the latest movies and shows in stunning 4K quality.
            </p>

            {/* Language Selector */}
            <div className="relative inline-block">
              <select
                className="appearance-none bg-kemo-gray-800 text-white px-4 py-2 pr-10 rounded-lg
                  border border-kemo-gray-700 hover:border-brand-gold focus:border-brand-gold
                  transition-colors duration-300 cursor-pointer outline-none text-sm"
                defaultValue="en"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Globe className="w-4 h-4 text-brand-gold" />
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="text-white font-medium mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-kemo-gray-300 hover:text-white text-sm
                        transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-kemo-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-kemo-gray-300 hover:text-brand-gold
                    transform hover:scale-110 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-kemo-gray-300 text-sm">
              © {new Date().getFullYear()} KemoMovies. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}