
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Tutors', path: '/tutors' },
    { name: 'Dashboard', path: '/dashboard' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        isScrolled ? 'glass-effect' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-tutor-blue to-tutor-blue-light p-0.5">
            <div className="bg-white rounded-md h-full w-full flex items-center justify-center">
              <span className="font-bold text-lg text-gradient">BT</span>
            </div>
          </div>
          <span className="font-bold text-xl hidden sm:block">Blockchain Tutor</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-tutor-blue ${
                location.pathname === link.path ? 'text-tutor-blue' : 'text-tutor-neutral-darker'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="text-sm">Sign In</Button>
          <Button className="text-sm bg-tutor-blue hover:bg-tutor-blue-dark">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden rounded-md p-2 text-tutor-neutral-darker hover:bg-secondary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-effect animate-fade-in">
          <nav className="flex flex-col py-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-3 text-sm font-medium transition-colors hover:text-tutor-blue ${
                  location.pathname === link.path ? 'text-tutor-blue' : 'text-tutor-neutral-darker'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Button variant="outline" className="w-full text-sm">Sign In</Button>
              <Button className="w-full text-sm bg-tutor-blue hover:bg-tutor-blue-dark">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
