
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  ThumbsUp, 
  Award, 
  Clock 
} from 'lucide-react';

export interface TutorProps {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  rating: number;
  reviews: number;
  students: number;
  hourlyRate: number;
  expertise: string[];
  languages: string[];
  availability: {
    days: string[];
    hours: string;
  };
}

const TutorProfile = ({ tutor }: { tutor: TutorProps }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'availability'>('about');

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Profile sidebar */}
        <div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-white/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4 relative">
              <img 
                src={tutor.avatar} 
                alt={tutor.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-tutor-success text-white rounded-full h-7 w-7 flex items-center justify-center border-2 border-white">
                <span className="sr-only">Online</span>
                <span className="block h-2 w-2 rounded-full bg-white"></span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-1">{tutor.name}</h3>
            <p className="text-sm text-tutor-neutral-dark mb-3">{tutor.title}</p>
            
            <div className="flex items-center gap-1 mb-4">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{tutor.rating}</span>
              <span className="text-xs text-tutor-neutral-dark">({tutor.reviews} reviews)</span>
            </div>
            
            <div className="w-full mb-6">
              <p className="text-sm font-medium mb-2">Expertise</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {tutor.expertise.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2.5 py-1 text-xs bg-tutor-blue/10 text-tutor-blue rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Hourly Rate</p>
                <p className="text-lg font-bold">${tutor.hourlyRate}/hr</p>
              </div>
              
              <Button className="w-full bg-tutor-blue hover:bg-tutor-blue-dark mb-3">
                Book a Session
              </Button>
              
              <Button variant="outline" className="w-full">
                <MessageCircle size={16} className="mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:w-2/3 p-6">
          {/* Tab navigation */}
          <div className="flex border-b border-white/20 mb-6">
            <button 
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'about' ? 'text-tutor-blue border-b-2 border-tutor-blue' : 'text-tutor-neutral-dark'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'reviews' ? 'text-tutor-blue border-b-2 border-tutor-blue' : 'text-tutor-neutral-dark'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'availability' ? 'text-tutor-blue border-b-2 border-tutor-blue' : 'text-tutor-neutral-dark'
              }`}
              onClick={() => setActiveTab('availability')}
            >
              Availability
            </button>
          </div>
          
          {/* About tab */}
          {activeTab === 'about' && (
            <div className="animate-fade-in">
              <h4 className="text-lg font-bold mb-3">About {tutor.name}</h4>
              <p className="text-tutor-neutral-dark mb-6">{tutor.bio}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-tutor-blue/10 flex items-center justify-center text-tutor-blue">
                    <ThumbsUp size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Satisfaction Rate</h5>
                    <p className="text-sm text-tutor-neutral-dark">98% from {tutor.students} students</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-tutor-blue/10 flex items-center justify-center text-tutor-blue">
                    <Award size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Experience Level</h5>
                    <p className="text-sm text-tutor-neutral-dark">5+ years in blockchain</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-tutor-blue/10 flex items-center justify-center text-tutor-blue">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Languages</h5>
                    <p className="text-sm text-tutor-neutral-dark">{tutor.languages.join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-tutor-blue/10 flex items-center justify-center text-tutor-blue">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Response Time</h5>
                    <p className="text-sm text-tutor-neutral-dark">Usually within 1 hour</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold">Student Reviews</h4>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{tutor.rating}</span>
                  <span className="text-xs text-tutor-neutral-dark">({tutor.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Sample reviews */}
                <div className="border-b border-white/20 pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src="https://i.pravatar.cc/150?img=32" 
                        alt="Student" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Alex Johnson</h5>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-tutor-neutral-dark ml-1">1 month ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-tutor-neutral-dark">
                    Excellent tutor! Made complex blockchain concepts easy to understand. The smart contract demos were particularly helpful for my project.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src="https://i.pravatar.cc/150?img=44" 
                        alt="Student" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Maria Chen</h5>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <Star size={12} className="text-tutor-neutral" />
                        <span className="text-xs text-tutor-neutral-dark ml-1">2 months ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-tutor-neutral-dark">
                    Very knowledgeable about Ethereum development. Sessions were well-structured and helped me improve my coding skills significantly.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Availability tab */}
          {activeTab === 'availability' && (
            <div className="animate-fade-in">
              <h4 className="text-lg font-bold mb-3">Schedule a Session</h4>
              <p className="text-tutor-neutral-dark mb-6">
                {tutor.name} is available on {tutor.availability.days.join(', ')} from {tutor.availability.hours}.
              </p>
              
              <div className="mb-6">
                <div className="bg-tutor-blue/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-tutor-blue" />
                    <h5 className="font-medium">Select a Date & Time</h5>
                  </div>
                  <p className="text-sm text-tutor-neutral-dark">
                    Calendar widget would be displayed here. Sessions are confirmed via smart contract with automatic reminders.
                  </p>
                </div>
              </div>
              
              <Button className="w-full bg-tutor-blue hover:bg-tutor-blue-dark">
                Book a Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
