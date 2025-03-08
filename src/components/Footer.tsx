
import { Link } from 'react-router-dom';
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github, 
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gradient-to-b from-tutor-neutral to-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-tutor-blue to-tutor-blue-light p-0.5">
                <div className="bg-white rounded-md h-full w-full flex items-center justify-center">
                  <span className="font-bold text-lg text-gradient">BT</span>
                </div>
              </div>
              <span className="font-bold text-xl">Blockchain Tutor</span>
            </Link>
            <p className="text-sm text-tutor-neutral-dark mb-6">
              An AI-driven tutoring service operating on the blockchain, offering personalized learning experiences.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-tutor-neutral-darker/5 flex items-center justify-center text-tutor-neutral-darker hover:bg-tutor-blue/10 hover:text-tutor-blue transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-tutor-neutral-darker/5 flex items-center justify-center text-tutor-neutral-darker hover:bg-tutor-blue/10 hover:text-tutor-blue transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-tutor-neutral-darker/5 flex items-center justify-center text-tutor-neutral-darker hover:bg-tutor-blue/10 hover:text-tutor-blue transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-tutor-neutral-darker/5 flex items-center justify-center text-tutor-neutral-darker hover:bg-tutor-blue/10 hover:text-tutor-blue transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Find a Tutor
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Blockchain Integration
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-tutor-neutral-dark hover:text-tutor-blue transition-colors">
                  Smart Contract License
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-tutor-neutral-dark/10">
          <p className="text-sm text-tutor-neutral-dark mb-4 md:mb-0">
            © {new Date().getFullYear()} Blockchain Tutor. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop} 
            className="flex items-center gap-2 text-sm font-medium text-tutor-neutral-darker hover:text-tutor-blue transition-colors"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
