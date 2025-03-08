
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const elements = heroRef.current.querySelectorAll('.parallax-element');
      
      elements.forEach((element) => {
        const speed = parseFloat((element as HTMLElement).dataset.speed || '0.05');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        
        (element as HTMLElement).style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background decoration elements */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-tutor-blue/5 blur-3xl parallax-element" 
          data-speed="0.03"
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-tutor-blue-light/5 blur-3xl parallax-element" 
          data-speed="0.05"
        ></div>
        <div 
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-tutor-blue/5 blur-3xl parallax-element" 
          data-speed="0.07"
        ></div>
      </div>

      {/* Hero content */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-block mb-6 animate-fade-in">
          <span className="px-3 py-1 text-sm font-medium bg-tutor-blue/10 text-tutor-blue rounded-full">
            Learn blockchain with AI tutors
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 animate-slide-up text-balance">
          <span className="text-gradient">Personalized Learning</span>
          <br /> Powered by Blockchain
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-tutor-neutral-dark mb-8 animate-slide-up animation-delay-200 text-balance">
          Unlock your potential with our AI-driven tutoring service. Experience interactive lessons, secure smart contract payments, and personalized feedback.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-300">
          <Button className="bg-tutor-blue hover:bg-tutor-blue-dark text-white font-medium px-6 py-6 h-auto rounded-xl">
            Find a Tutor
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 font-medium px-6 py-6 h-auto rounded-xl border-tutor-neutral"
          >
            Explore Courses <ArrowRight size={16} />
          </Button>
        </div>
        
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 animate-slide-up animation-delay-400">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tutor-blue">500+</span>
            <span className="text-sm text-tutor-neutral-dark">AI Tutors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tutor-blue">24/7</span>
            <span className="text-sm text-tutor-neutral-dark">Learning Access</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tutor-blue">98%</span>
            <span className="text-sm text-tutor-neutral-dark">Satisfaction Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
