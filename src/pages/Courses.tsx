
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard, { CourseProps } from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronRight, ChevronLeft } from 'lucide-react';

// Sample course data
const coursesData: CourseProps[] = [
  {
    id: '1',
    title: 'Blockchain Fundamentals for Beginners',
    description: 'Start your blockchain journey with this comprehensive introduction to decentralized technology fundamentals.',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    duration: '6 hours',
    students: 2145,
    rating: 4.8,
    level: 'Beginner',
    price: 59.99,
    tutor: {
      name: 'Alex Morgan',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  },
  {
    id: '2',
    title: 'Ethereum Smart Contract Development',
    description: 'Learn to build, test, and deploy secure smart contracts on the Ethereum blockchain using Solidity.',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1832&q=80',
    duration: '8 hours',
    students: 1832,
    rating: 4.9,
    level: 'Intermediate',
    price: 79.99,
    tutor: {
      name: 'Sophia Chen',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  },
  {
    id: '3',
    title: 'DeFi: Decentralized Finance Explained',
    description: 'Explore the revolutionary world of DeFi applications, protocols, and investment strategies.',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80',
    duration: '7 hours',
    students: 1456,
    rating: 4.7,
    level: 'Intermediate',
    price: 69.99,
    tutor: {
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=8'
    }
  },
  {
    id: '4',
    title: 'NFTs: Creation to Marketplace',
    description: 'Master the process of creating, minting, and selling NFTs across multiple blockchain platforms.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80',
    duration: '5 hours',
    students: 2310,
    rating: 4.8,
    level: 'All Levels',
    price: 64.99,
    tutor: {
      name: 'Emily Parker',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  },
  {
    id: '5',
    title: 'Advanced Blockchain Security',
    description: 'Protect your blockchain applications with advanced security techniques and vulnerability prevention.',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    duration: '9 hours',
    students: 986,
    rating: 4.9,
    level: 'Advanced',
    price: 89.99,
    tutor: {
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  },
  {
    id: '6',
    title: 'Web3 Development Fundamentals',
    description: 'Build decentralized applications (dApps) with modern Web3 frameworks and blockchain integration.',
    image: 'https://images.unsplash.com/photo-1655720828018-7461cfa2d2c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
    duration: '10 hours',
    students: 1645,
    rating: 4.7,
    level: 'Intermediate',
    price: 79.99,
    tutor: {
      name: 'Michael Johnson',
      avatar: 'https://i.pravatar.cc/150?img=15'
    }
  }
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(coursesData);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = coursesData.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(coursesData);
    }
  }, [searchTerm]);

  const filterByLevel = (level: string) => {
    setActiveFilter(level);
    
    if (level === 'All') {
      setFilteredCourses(coursesData);
    } else {
      const filtered = coursesData.filter(course => course.level === level);
      setFilteredCourses(filtered);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-16 px-6 bg-gradient-to-b from-tutor-neutral to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Our <span className="text-gradient">Blockchain Courses</span>
              </h1>
              <p className="max-w-2xl mx-auto text-tutor-neutral-dark">
                Dive into expert-led courses designed to build your blockchain skills from the ground up, with personalized AI support every step of the way.
              </p>
            </div>
            
            <div className="mb-10">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tutor-neutral-dark" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsFiltering(!isFiltering)}
                >
                  <Filter size={18} />
                  Filter Courses
                </Button>
              </div>
              
              {isFiltering && (
                <div className="glass-card p-4 mb-6 animate-slide-down">
                  <h3 className="font-medium mb-3">Filter by Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((level) => (
                      <button
                        key={level}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          activeFilter === level 
                            ? 'bg-tutor-blue text-white' 
                            : 'bg-tutor-blue/10 text-tutor-neutral-darker hover:bg-tutor-blue/20'
                        }`}
                        onClick={() => filterByLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-tutor-neutral-dark mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('All');
                    setFilteredCourses(coursesData);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {filteredCourses.length > 0 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full">
                  <ChevronLeft size={16} />
                  <span className="sr-only">Previous page</span>
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button 
                    key={page}
                    variant={page === 1 ? "default" : "outline"} 
                    size="sm" 
                    className={`h-9 w-9 p-0 rounded-full ${page === 1 ? 'bg-tutor-blue hover:bg-tutor-blue-dark' : ''}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full">
                  <ChevronRight size={16} />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
