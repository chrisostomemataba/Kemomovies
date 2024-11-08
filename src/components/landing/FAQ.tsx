// src/components/landing/FAQ.tsx
import { useState } from 'react';
import { ChevronDown, Mail, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'billing';
}

const faqs: FAQItem[] = [
  {
    question: "What is KemoMovies and how does it work?",
    answer: "KemoMovies is a premium streaming platform that offers unlimited access to movies, TV shows, and exclusive content. Watch anywhere, anytime on your favorite devices. Our platform uses advanced streaming technology to ensure the highest quality viewing experience.",
    category: 'general'
  },
  {
    question: "What devices can I watch on?",
    answer: "Watch KemoMovies on any device including smart TVs, smartphones, tablets, gaming consoles, and computers. Download our app from your device's app store or access through any modern web browser for the best experience.",
    category: 'technical'
  },
  {
    question: "Can I download movies to watch offline?",
    answer: "Yes! Premium subscribers can download their favorite content to watch offline. Perfect for travel or when you're on the go. Simply look for the download icon on compatible titles and enjoy watching without an internet connection.",
    category: 'technical'
  },
  {
    question: "How much does KemoMovies cost?",
    answer: "KemoMovies offers flexible subscription plans starting from $9.99/month. Choose between Basic, Standard, and Premium plans to find the perfect fit for your entertainment needs. All plans come with a 30-day free trial.",
    category: 'billing'
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! There are no long-term contracts or commitments. You can easily cancel your subscription at any time through your account settings. If you cancel, you'll continue to have access until the end of your billing period.",
    category: 'billing'
  },
  {
    question: "What content is available on KemoMovies?",
    answer: "Enjoy our vast library of blockbuster movies, critically acclaimed TV series, exclusive KemoMovies originals, documentaries, and more. We regularly update our content with new releases and keep adding exciting titles every week.",
    category: 'general'
  }
];

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ item, isOpen, onToggle }: AccordionItemProps) => (
  <div className="border-b border-kemo-gray-700">
    <button
      className="w-full py-6 flex items-center justify-between text-left group"
      onClick={onToggle}
    >
      <span className="text-lg md:text-xl font-medium text-white group-hover:text-brand-gold
        transition-colors duration-300">
        {item.question}
      </span>
      <ChevronDown className={`w-6 h-6 text-brand-gold transform transition-transform duration-300
        ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
      />
    </button>
    
    <div className={`grid transition-all duration-300 ease-in-out
      ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <p className="text-kemo-gray-300 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-kemo-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-brand-gold/5 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-kemo-gray-300 text-lg">
            Got questions? We've got answers. If you can't find what you're looking for,
            reach out to our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center pt-8">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
            Still have questions?
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contact" className="group flex items-center space-x-2 px-6 py-3 
              bg-kemo-gray-800 hover:bg-kemo-gray-700 rounded-lg transition-colors duration-300">
              <Mail className="w-5 h-5 text-brand-gold" />
              <span className="text-white">Contact Support</span>
            </a>
            
            <button className="group flex items-center space-x-2 px-6 py-3 
              bg-brand-gold hover:bg-brand-darker rounded-lg
              transition-all duration-300 text-kemo-black font-medium">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}