
import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  BookOpen, 
  Filter, 
  Search, 
  RefreshCw,
  UsersRound
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DeliberationRoom from "./DeliberationRoom";

// Sample data - in a real app, this would come from your database
const deliberationRooms = [
  {
    id: "room1",
    title: "Should Social Media Platforms Regulate Misinformation?",
    description: "Explore different perspectives on platform responsibility vs. free speech concerns.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: "digital-ethics",
    participantCount: 12,
    perspectives: [
      {
        id: "p1",
        title: "Platforms Have a Responsibility",
        content: "Social media companies have reached unprecedented scale and influence, making them de facto public forums. With this position comes responsibility. Unchecked misinformation can lead to real-world harm including health risks, violence, and democratic erosion. Platforms have the technical ability and ethical obligation to limit the spread of clearly false information, especially when it poses public risks.",
        author: "MediaEthicist",
        viewpoint: "Regulation Needed"
      },
      {
        id: "p2",
        title: "Free Speech Must Be Protected",
        content: "Empowering private companies to determine 'truth' is dangerous. Who decides what constitutes misinformation? Even well-intentioned censorship invariably expands beyond its original scope. History shows that speech restrictions are tools that can be weaponized against marginalized voices. The solution to misinformation is better education and more speech, not less.",
        author: "FreeSpeechAdvocate",
        viewpoint: "Minimal Intervention"
      },
      {
        id: "p3",
        title: "A Balanced Approach",
        content: "Both total platform control and complete laissez-faire approaches have significant downsides. The solution lies in transparent processes with democratic oversight. This could include labeling content rather than removing it, focusing enforcement on demonstrably harmful misinformation, and creating appeals processes. Most importantly, platform algorithms should not amplify misinformation for engagement.",
        author: "PolicyAnalyst",
        viewpoint: "Middle Ground"
      }
    ]
  },
  {
    id: "room2",
    title: "Climate Change: Market Solutions vs. Government Regulation",
    description: "Examining different approaches to addressing environmental challenges.",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    category: "environmental-policy",
    participantCount: 8,
    perspectives: [
      {
        id: "p1",
        title: "Market-Based Solutions",
        content: "Free markets drive innovation, and environmental challenges are no exception. When properly incentivized through mechanisms like carbon pricing, private enterprise can develop and scale solutions faster than government programs. Market solutions also avoid the inefficiencies of bureaucracy and can adapt quickly to changing conditions and technologies.",
        author: "EcoCapitalist",
        viewpoint: "Market-Focused"
      },
      {
        id: "p2",
        title: "Government Regulation Essential",
        content: "Climate change represents a massive market failure - the costs of pollution are externalized while profits remain private. Only government has the authority and scope to implement the system-wide changes needed. Regulation creates certainty for businesses while ensuring environmental protection isn't sacrificed for short-term profit. The urgency of the climate crisis requires coordinated action.",
        author: "PolicyExpert",
        viewpoint: "Regulation-Focused"
      },
      {
        id: "p3",
        title: "Public-Private Partnership",
        content: "The most effective approach combines government frameworks with private sector innovation. Government can set long-term goals and boundaries through regulation, while businesses compete to find the most efficient solutions. Public research funding can support early-stage technologies, with private capital scaling proven solutions. This hybrid approach leverages the strengths of both sectors.",
        author: "SustainabilityConsultant",
        viewpoint: "Hybrid Approach"
      }
    ]
  }
];

interface DeliberationRoomsListProps {
  isAuthenticated: boolean;
  userId?: string;
  username?: string;
}

const DeliberationRoomsList: React.FC<DeliberationRoomsListProps> = ({
  isAuthenticated,
  userId,
  username,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateRoomClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a deliberation room",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would navigate to a creation form or open a modal
    toast({
      title: "Coming soon",
      description: "Room creation functionality is under development",
    });
  };

  const filteredRooms = deliberationRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || room.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleRoom = (roomId: string) => {
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search deliberation rooms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="digital-ethics">Digital Ethics</SelectItem>
              <SelectItem value="environmental-policy">Environmental Policy</SelectItem>
              <SelectItem value="political-systems">Political Systems</SelectItem>
              <SelectItem value="economics">Economics</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateRoomClick} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Room</span>
          </Button>
        </div>
      </div>

      {filteredRooms.length > 0 ? (
        <div className="space-y-4">
          {filteredRooms.map(room => (
            <Card key={room.id} className="bg-white border-border/30 hover:border-border/70 transition-colors">
              <CardHeader className="cursor-pointer" onClick={() => toggleRoom(room.id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <UsersRound size={14} />
                      <span>{room.participantCount} participants</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Created {formatDate(room.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 text-sm">
                  <Badge variant="secondary" className="mr-2">
                    {room.category.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{room.perspectives.length} perspectives</span>
                  </Badge>
                </div>
              </CardHeader>
              
              {expandedRoomId === room.id && (
                <CardContent>
                  <DeliberationRoom
                    roomId={room.id}
                    title={room.title}
                    description={room.description}
                    perspectives={room.perspectives}
                    isAuthenticated={isAuthenticated}
                    userId={userId}
                    username={username}
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No deliberation rooms found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default DeliberationRoomsList;
