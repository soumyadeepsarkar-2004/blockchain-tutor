import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock data for tutors
const tutorsData = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    avatar: '/placeholder.svg',
    title: 'Blockchain Architecture Specialist',
    rating: 4.9,
    reviews: 127,
    specialties: ['Smart Contracts', 'DeFi', 'Solidity'],
    hourlyRate: 75,
    availability: 'Available in 2 days',
    description: 'Former lead developer at Ethereum, I specialize in smart contract development and security auditing. Passionate about teaching blockchain fundamentals to beginners.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: '/placeholder.svg',
    title: 'Cryptocurrency Expert',
    rating: 4.8,
    reviews: 94,
    specialties: ['Bitcoin', 'Trading Strategies', 'Market Analysis'],
    hourlyRate: 65,
    availability: 'Available today',
    description: 'Cryptocurrency analyst with 6 years of experience. I help students understand market trends, technical analysis, and long-term investment strategies in blockchain assets.'
  },
  {
    id: 3,
    name: 'Elena Petrov',
    avatar: '/placeholder.svg',
    title: 'Blockchain Developer & Educator',
    rating: 4.7,
    reviews: 83,
    specialties: ['Full-Stack Blockchain', 'Hyperledger', 'dApps'],
    hourlyRate: 80,
    availability: 'Available in 3 days',
    description: 'Full-stack blockchain developer and educator. I focus on practical, project-based learning to help students build real decentralized applications.'
  },
  {
    id: 4,
    name: 'James Williams',
    avatar: '/placeholder.svg',
    title: 'NFT & Digital Assets Specialist',
    rating: 4.9,
    reviews: 61,
    specialties: ['NFTs', 'Digital Art', 'Tokenization'],
    hourlyRate: 70,
    availability: 'Available tomorrow',
    description: 'Expert in NFT creation, marketplaces, and digital asset tokenization. I teach the technical and artistic aspects of blockchain-based digital ownership.'
  },
  {
    id: 5,
    name: 'Aisha Mohammed',
    avatar: '/placeholder.svg',
    title: 'Blockchain Legal & Compliance Expert',
    rating: 4.6,
    reviews: 42,
    specialties: ['Regulation', 'Compliance', 'Legal Frameworks'],
    hourlyRate: 85,
    availability: 'Available in 5 days',
    description: 'Attorney specializing in blockchain regulation and compliance. I help students navigate the complex legal landscape of cryptocurrency and blockchain projects.'
  },
  {
    id: 6,
    name: 'Carlos Mendoza',
    avatar: '/placeholder.svg',
    title: 'Web3 Infrastructure Architect',
    rating: 4.8,
    reviews: 76,
    specialties: ['Web3.js', 'Decentralized Storage', 'IPFS'],
    hourlyRate: 75,
    availability: 'Available today',
    description: 'Passionate about decentralized infrastructure and storage solutions. I teach students how to build resilient applications using IPFS, Filecoin, and other Web3 technologies.'
  }
];

const Tutors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTutors, setFilteredTutors] = useState(tutorsData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = tutorsData.filter(tutor => 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredTutors(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-12 px-6 md:py-16 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Expert Blockchain Tutors</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with industry-leading blockchain experts for personalized 1-on-1 tutoring sessions
            </p>
          </div>

          <div className="mb-10">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search by name, specialty, or topic..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          <Tabs defaultValue="all" className="mb-10">
            <TabsList className="mx-auto flex justify-center">
              <TabsTrigger value="all">All Tutors</TabsTrigger>
              <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
              <TabsTrigger value="cryptocurrency">Cryptocurrency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutors.map(tutor => (
                  <Card key={tutor.id} className="overflow-hidden glass-card hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <img src={tutor.avatar} alt={tutor.name} />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{tutor.name}</h3>
                          <p className="text-sm text-muted-foreground">{tutor.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-medium">{tutor.rating}</span>
                          <span className="text-sm text-muted-foreground">({tutor.reviews} reviews)</span>
                        </div>
                        <span className="text-sm font-medium">${tutor.hourlyRate}/hr</span>
                      </div>
                      
                      <p className="text-sm mb-4 line-clamp-2">{tutor.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tutor.specialties.map(specialty => (
                          <Badge key={specialty} variant="secondary" className="font-normal">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">{tutor.availability}</span>
                        <Button>Book Session</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Other tab contents would filter tutors by specialty */}
            <TabsContent value="smart-contracts" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutors
                  .filter(tutor => tutor.specialties.includes('Smart Contracts'))
                  .map(tutor => (
                    /* Same tutor card UI as above */
                    <Card key={tutor.id} className="overflow-hidden glass-card hover:shadow-lg transition-shadow duration-300">
                      
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <img src={tutor.avatar} alt={tutor.name} />
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{tutor.name}</h3>
                            <p className="text-sm text-muted-foreground">{tutor.title}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500">★</span>
                            <span className="font-medium">{tutor.rating}</span>
                            <span className="text-sm text-muted-foreground">({tutor.reviews} reviews)</span>
                          </div>
                          <span className="text-sm font-medium">${tutor.hourlyRate}/hr</span>
                        </div>
                        
                        <p className="text-sm mb-4 line-clamp-2">{tutor.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tutor.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-600">{tutor.availability}</span>
                          <Button>Book Session</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            {/* Similar TabsContent components for other tabs */}
          </Tabs>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tutors;
