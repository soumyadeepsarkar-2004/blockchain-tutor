import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Award, BookOpen, CheckCircle, LockIcon } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock courses data
const coursesData = [
  {
    id: '1',
    title: 'Blockchain Fundamentals',
    description: 'A comprehensive introduction to blockchain technology, cryptocurrencies, and decentralized applications. Learn the core concepts that power the blockchain revolution.',
    image: '/placeholder.svg',
    level: 'Beginner',
    duration: '4 weeks',
    enrolled: 1240,
    rating: 4.8,
    reviews: 214,
    price: 299,
    instructor: {
      name: 'Dr. Sarah Johnson',
      avatar: '/placeholder.svg',
      title: 'Blockchain Architecture Specialist',
      bio: 'Former lead developer at Ethereum, specializing in smart contract development and security auditing with over 8 years of experience.'
    },
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Blockchain',
        lessons: [
          { id: 'l1', title: 'What is Blockchain Technology?', duration: '15:30', free: true, completed: true },
          { id: 'l2', title: 'Distributed Ledger Systems', duration: '22:45', free: true, completed: true },
          { id: 'l3', title: 'Consensus Mechanisms', duration: '18:20', free: false, completed: false },
          { id: 'l4', title: 'Blockchain vs. Traditional Databases', duration: '20:10', free: false, completed: false }
        ]
      },
      {
        id: 'm2',
        title: 'Cryptocurrencies',
        lessons: [
          { id: 'l5', title: 'Bitcoin: The First Cryptocurrency', duration: '28:15', free: false, completed: false },
          { id: 'l6', title: 'Altcoins and Token Economics', duration: '24:30', free: false, completed: false },
          { id: 'l7', title: 'Wallets and Exchanges', duration: '19:45', free: false, completed: false },
          { id: 'l8', title: 'Security and Best Practices', duration: '26:10', free: false, completed: false }
        ]
      },
      {
        id: 'm3',
        title: 'Smart Contracts',
        lessons: [
          { id: 'l9', title: 'Introduction to Smart Contracts', duration: '21:30', free: false, completed: false },
          { id: 'l10', title: 'Ethereum and the EVM', duration: '25:45', free: false, completed: false },
          { id: 'l11', title: 'Basic Solidity Programming', duration: '35:20', free: false, completed: false },
          { id: 'l12', title: 'Testing and Deployment', duration: '28:10', free: false, completed: false }
        ]
      },
      {
        id: 'm4',
        title: 'Decentralized Applications',
        lessons: [
          { id: 'l13', title: 'DApp Architecture', duration: '23:30', free: false, completed: false },
          { id: 'l14', title: 'Web3.js and Ethers.js', duration: '27:15', free: false, completed: false },
          { id: 'l15', title: 'Frontend Integration', duration: '24:45', free: false, completed: false },
          { id: 'l16', title: 'Building Your First DApp', duration: '40:10', free: false, completed: false }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced Smart Contract Development',
    description: 'Take your smart contract skills to the next level. Learn advanced Solidity patterns, security best practices, and how to build complex decentralized applications.',
    image: '/placeholder.svg',
    level: 'Intermediate',
    duration: '6 weeks',
    enrolled: 870,
    rating: 4.9,
    reviews: 156,
    price: 399,
    instructor: {
      name: 'Michael Chen',
      avatar: '/placeholder.svg',
      title: 'Smart Contract Security Expert',
      bio: 'Security researcher and smart contract auditor with experience working on major DeFi protocols and NFT platforms.'
    },
    modules: [
      {
        id: 'm1',
        title: 'Advanced Solidity Concepts',
        lessons: [
          { id: 'l1', title: 'Solidity Design Patterns', duration: '28:30', free: true, completed: false },
          { id: 'l2', title: 'Gas Optimization Techniques', duration: '32:15', free: false, completed: false },
          { id: 'l3', title: 'Custom Data Structures', duration: '25:40', free: false, completed: false },
          { id: 'l4', title: 'Assembly and Low-Level Calls', duration: '35:20', free: false, completed: false }
        ]
      },
      {
        id: 'm2',
        title: 'Smart Contract Security',
        lessons: [
          { id: 'l5', title: 'Common Vulnerabilities', duration: '30:45', free: false, completed: false },
          { id: 'l6', title: 'Security Best Practices', duration: '27:30', free: false, completed: false },
          { id: 'l7', title: 'Audit Methodologies', duration: '35:15', free: false, completed: false },
          { id: 'l8', title: 'Automated Testing', duration: '28:50', free: false, completed: false }
        ]
      },
    ]
  }
];

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected, connectWallet } = useBlockchain();
  const [activeTab, setActiveTab] = useState('overview');
  
  const course = coursesData.find(c => c.id === id);
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Button>View All Courses</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate total lessons and completed lessons
  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.filter(lesson => lesson.completed).length;
  }, 0);
  
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  const handleEnroll = () => {
    if (!isConnected) {
      toast("Wallet not connected", {
        description: "Please connect your wallet to enroll in this course.",
      });
      return;
    }
    
    toast.success("Enrollment Successful", {
      description: `You've successfully enrolled in ${course.title}`,
    });
  };
  
  const handlePlayLesson = (lesson: any) => {
    if (lesson.free) {
      toast.success(`Playing: ${lesson.title}`);
    } else if (!isConnected) {
      toast.error("Please connect your wallet to access this lesson");
    } else {
      toast.success(`Playing: ${lesson.title}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Course Header */}
        <section className="relative py-12 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="outline" className="font-normal">
                  {course.level}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {course.duration}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.enrolled} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">★</span>
                  <span>{course.rating} ({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full border-2 border-primary/20"
                />
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Course progress</span>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                
                <div className="flex gap-2">
                  {!isConnected ? (
                    <Button onClick={connectWallet} className="flex-1">
                      Connect Wallet to Enroll
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll} className="flex-1">
                      Enroll for ${course.price}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        
        {/* Course Content */}
        <section className="py-12 px-6 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">What You'll Learn</h2>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span>Understand the fundamental concepts of blockchain technology</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span>Learn how cryptocurrencies work and their underlying mechanisms</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span>Explore smart contracts and the Ethereum Virtual Machine</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span>Build and deploy your first decentralized application</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span>Understand the security implications of blockchain systems</span>
                      </li>
                    </ul>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-6">Course Features</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>{totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>24/7 Support</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary" />
                        <span>Certificate</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Community Access</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Course Description</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        This comprehensive course on blockchain fundamentals will take you from 
                        a complete beginner to having a solid understanding of blockchain technology 
                        and its applications.
                      </p>
                      <p>
                        Starting with the basic concepts of distributed ledgers and consensus mechanisms, 
                        we'll progress to explore cryptocurrencies, smart contracts, and decentralized 
                        applications. By the end of this course, you'll have built your first dApp and 
                        understand the core principles that make blockchain technology revolutionary.
                      </p>
                      <p>
                        Whether you're looking to build blockchain applications, invest in cryptocurrencies, 
                        or simply understand the technology that's changing finance and beyond, this course 
                        provides the foundation you need.
                      </p>
                    </div>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-6">Who This Course is For</h2>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Developers interested in blockchain application development</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Business professionals who want to understand blockchain use cases</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Cryptocurrency enthusiasts who want to deepen their technical knowledge</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Students and researchers interested in decentralized systems</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="mt-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Course Curriculum</h2>
                  
                  <div className="space-y-6">
                    {course.modules.map((module, moduleIndex) => (
                      <Card key={module.id} className="overflow-hidden glass-card">
                        <div className="bg-muted/50 p-4 border-b">
                          <h3 className="font-medium">
                            Module {moduleIndex + 1}: {module.title}
                          </h3>
                        </div>
                        <CardContent className="p-0">
                          <ul>
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li 
                                key={lesson.id} 
                                className={`p-4 border-b last:border-b-0 flex justify-between items-center ${
                                  lesson.completed ? 'bg-green-50/50' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-muted-foreground text-xs">
                                      {moduleIndex + 1}.{lessonIndex + 1}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{lesson.title}</p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration}
                                      </span>
                                      {lesson.free && (
                                        <Badge variant="secondary" className="text-xs">Free</Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="ml-4"
                                  onClick={() => handlePlayLesson(lesson)}
                                >
                                  {lesson.free || isConnected ? (
                                    "Play"
                                  ) : (
                                    <LockIcon className="h-4 w-4" />
                                  )}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="instructor" className="mt-8">
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name}
                        className="w-full h-full object-cover"  
                      />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">{course.instructor.name}</h2>
                      <p className="text-muted-foreground mb-6">{course.instructor.title}</p>
                      
                      <div className="space-y-4">
                        <p>
                          {course.instructor.bio}
                        </p>
                        <p>
                          With a passion for teaching complex concepts in an accessible way, 
                          {course.instructor.name} has helped thousands of students understand 
                          blockchain technology and its practical applications.
                        </p>
                        <p>
                          Their teaching approach combines theoretical knowledge with hands-on 
                          projects, ensuring students gain both conceptual understanding and 
                          practical skills.
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline">View Full Profile</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
