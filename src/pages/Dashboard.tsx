
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, User, Award, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
    
    // Get enrolled courses from localStorage
    const storedCourses = localStorage.getItem('enrolledCourses');
    if (storedCourses) {
      setEnrolledCourses(JSON.parse(storedCourses));
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="py-12 px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name || user?.email?.split('@')[0] || "Student"}
                </p>
              </div>
              <Link to="/profile">
                <Button variant="outline">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                      <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Tutors</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Certificates Earned</p>
                      <p className="text-2xl font-bold">
                        {enrolledCourses.filter(c => c.progress === 100).length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>Track your progress in enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.progress || 0}%</p>
                        </div>
                        <Progress value={course.progress || 0} className="h-2" />
                        {course.progress === 100 && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Completed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                    <Link to="/courses">
                      <Button>
                        Browse Courses
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="courses" className="mb-10">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="sessions">Tutoring Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="mt-6">
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map(course => (
                    <Card key={course.id}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-2">{course.title}</h3>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                        </div>
                        
                        <Link to={`/courses/${course.id}`}>
                          <Button className="w-full">
                            {course.progress ? 'Continue Course' : 'Start Course'}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10">
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                  <Link to="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sessions" className="mt-6">
              <div className="text-center p-10">
                <p className="text-muted-foreground mb-4">You don't have any tutoring sessions yet</p>
                <Link to="/tutors">
                  <Button>Find a Tutor</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
