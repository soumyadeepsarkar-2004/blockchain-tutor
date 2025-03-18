
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      {/* Hero content */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-block mb-6">
          <span className="px-3 py-1 text-sm font-medium bg-tutor-blue/10 text-tutor-blue rounded-full">
            Learn blockchain with expert tutors
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 text-balance">
          <span className="text-gradient">Effective Learning</span>
          <br /> Powered by Blockchain
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-tutor-neutral-dark mb-8 text-balance">
          Unlock your potential with our blockchain tutoring service. Experience interactive lessons, secure payments, and expert guidance from industry professionals.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/tutors">
            <Button className="bg-tutor-blue hover:bg-tutor-blue-dark text-white font-medium px-6 py-6 h-auto rounded-xl">
              Find a Tutor
            </Button>
          </Link>
          <Link to="/courses">
            <Button 
              variant="outline" 
              className="gap-2 font-medium px-6 py-6 h-auto rounded-xl border-tutor-neutral"
            >
              Explore Courses <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tutor-blue">200+</span>
            <span className="text-sm text-tutor-neutral-dark">Expert Tutors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tutor-blue">24/7</span>
            <span className="text-sm text-tutor-neutral-dark">Learning Access</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-tutor-blue">95%</span>
            <span className="text-sm text-tutor-neutral-dark">Success Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
