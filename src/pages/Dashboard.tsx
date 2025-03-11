
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useBlockchain } from '@/context/BlockchainContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Award, BookOpen, User, DollarSign, Calendar as CalendarIcon, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { formatTime, formatPrice } from '@/utils/blockchain';
import { ethers } from 'ethers';

// Types for session data
interface Session {
  id: number;
  tutor: string;
  student: string;
  time: number;
  price: number;
  completed: boolean;
}

// Types for course progress
interface CourseProgress {
  id: number;
  course: string;
  progress: number;
  completed: boolean;
}

const Dashboard = () => {
  const { isConnected, walletAddress, balance, connectWallet, completeSession, contract } = useBlockchain();
  const [isCompleting, setIsCompleting] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const navigate = useNavigate();
  
  // State for session data
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Learning progress data - this would come from your database in a real app
  const [learningProgress, setLearningProgress] = useState<CourseProgress[]>([]);
  
  // Mock learning analytics data (hours spent learning per week)
  // In a real app, this would come from your database
  const learningAnalytics = [
    { name: 'Week 1', hours: 3 },
    { name: 'Week 2', hours: 5 },
    { name: 'Week 3', hours: 4 },
    { name: 'Week 4', hours: 7 },
    { name: 'Week 5', hours: 6 },
    { name: 'Week 6', hours: 8 },
  ];

  // Get session data from contract
  const fetchSessions = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const sessionCount = await contract.sessionCount();
      const upcoming: Session[] = [];
      const past: Session[] = [];
      
      // Get user email or name to match sessions
      const currentUser = localStorage.getItem('user');
      const userInfo = currentUser ? JSON.parse(currentUser) : null;
      const userIdentifier = userInfo?.name || userInfo?.email || walletAddress;
      
      if (!userIdentifier) {
        setIsLoading(false);
        return;
      }
      
      // Fetch all sessions
      for (let i = 0; i < sessionCount; i++) {
        const session = await contract.sessions(i);
        
        // Check if this session belongs to the current user
        if (session.student.toLowerCase() === userIdentifier.toLowerCase() || 
            (typeof userIdentifier === 'string' && userIdentifier.includes('@') && 
             session.student.toLowerCase() === userIdentifier.toLowerCase())) {
          
          const sessionObj: Session = {
            id: i,
            tutor: session.tutor,
            student: session.student,
            time: Number(session.time),
            price: Number(session.price),
            completed: session.completed
          };
          
          if (session.completed) {
            past.push(sessionObj);
          } else {
            upcoming.push(sessionObj);
          }
        }
      }
      
      setUpcomingSessions(upcoming);
      setPastSessions(past);
      
      // Also fetch enrolled courses from localStorage
      const enrolledCoursesData = localStorage.getItem('enrolledCourses');
      if (enrolledCoursesData) {
        const parsedCourses = JSON.parse(enrolledCoursesData);
        const progress: CourseProgress[] = parsedCourses.map((course: any) => ({
          id: course.id,
          course: course.title,
          progress: course.progress || 0,
          completed: course.progress === 100
        }));
        setLearningProgress(progress);
      }
      
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions", {
        description: "There was an error fetching your session data."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // If contract is available, fetch sessions
    if (contract) {
      fetchSessions();
    }
  }, [contract, walletAddress]);

  const handleCompleteSession = async (sessionId: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsCompleting(true);
    try {
      const success = await completeSession(sessionId);
      if (success) {
        toast.success(`Session completed successfully!`);
        // Refresh sessions
        await fetchSessions();
      }
    } catch (error) {
      toast.error("Failed to complete session");
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="py-12 px-6 max-w-7xl mx-auto">
          {!isConnected ? (
            <Card className="text-center p-8 glass-card">
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your wallet to view your dashboard and manage your tutoring sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  onClick={connectWallet} 
                  className="mt-4"
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="glass-card px-4 py-2 rounded-lg">
                        <span className="text-sm text-muted-foreground mr-2">Wallet:</span>
                        <span className="font-mono">{walletAddress?.substring(0, 6)}...{walletAddress?.substring(38)}</span>
                      </div>
                      <div className="glass-card px-4 py-2 rounded-lg">
                        <span className="text-sm text-muted-foreground mr-2">Balance:</span>
                        <span>{balance}</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/profile">
                    <Button variant="outline" className="flex items-center gap-2">
                      <UserCog size={16} />
                      <span>
                        {user?.name || user?.email 
                          ? `Edit profile (${user.name || user.email})` 
                          : 'Edit profile'}
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Learning Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Learning Hours</p>
                          <p className="text-2xl font-bold">
                            {pastSessions.reduce((total, session) => total + session.time/100, 0).toFixed(1)} hours
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                          <p className="text-2xl font-bold">{learningProgress.length}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tutors Engaged</p>
                          <p className="text-2xl font-bold">
                            {new Set([...upcomingSessions, ...pastSessions].map(s => s.tutor)).size}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Certificates Earned</p>
                          <p className="text-2xl font-bold">
                            {learningProgress.filter(c => c.completed).length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Your Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {learningProgress.length > 0 ? (
                      <div className="space-y-4">
                        {learningProgress.map(course => (
                          <div key={course.id} className="space-y-2">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{course.course}</p>
                              <p className="text-sm text-muted-foreground">{course.progress}%</p>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            {course.completed && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Completed
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No courses enrolled yet</p>
                        <Link to="/courses">
                          <Button className="mt-4">Browse Courses</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Learning Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={learningAnalytics}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Hours spent learning per week
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="upcoming" className="mb-10">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                  <TabsTrigger value="past">Past Sessions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="mt-6">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <p>Loading sessions...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingSessions.length > 0 ? (
                        upcomingSessions.map(session => (
                          <Card key={session.id} className="glass-card overflow-hidden">
                            <div className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div>
                                  <h3 className="font-medium">Session with {session.tutor}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Session #{session.id}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Duration: {formatTime(session.time)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">${formatPrice(session.price)}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                                  Scheduled
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  ID: {session.id}
                                </Badge>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  className="flex-1"
                                  onClick={() => handleCompleteSession(session.id)}
                                  disabled={isCompleting}
                                >
                                  Complete Session
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center p-10">
                          <p className="text-muted-foreground">No upcoming sessions found.</p>
                          <Link to="/tutors">
                            <Button className="mt-4">Find a Tutor</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="mt-6">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <p>Loading sessions...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pastSessions.length > 0 ? (
                        pastSessions.map(session => (
                          <Card key={session.id} className="glass-card overflow-hidden">
                            <div className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div>
                                  <h3 className="font-medium">Session with {session.tutor}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Session #{session.id}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Duration: {formatTime(session.time)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">${formatPrice(session.price)}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  Completed
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  ID: {session.id}
                                </Badge>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center p-10">
                          <p className="text-muted-foreground">No past sessions found.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
