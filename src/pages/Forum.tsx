import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  File, 
  Filter,
  Search,
  Globe,
  History,
  Handshake,
  ShieldCheck,
  Cog
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ThreadForm from "@/components/ThreadForm";

type ForumThread = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
};

const sampleThreads: ForumThread[] = [
  {
    id: "1",
    title: "How to identify misinformation in social media",
    content: "In this thread, we'll discuss techniques to identify manipulated content and misinformation campaigns that spread on social media platforms...",
    category: "source-evaluation",
    author: "MediaLiteracy101",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Understanding confirmation bias in news consumption",
    content: "Confirmation bias affects how we consume news. Let's explore ways to diversify information sources and recognize our own biases...",
    category: "critical-thinking",
    author: "CriticalThinker",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "3",
    title: "Debunking recent climate change myth",
    content: "This popular article claiming that climate scientists are backing away from consensus has several factual errors. Let's analyze the claims...",
    category: "fact-checking",
    author: "ScienceMinded",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "4",
    title: "Is this election news report accurate?",
    content: "I've seen this article shared widely, but some claims about voting statistics seem suspicious. Can we verify this information?",
    category: "fact-checking",
    author: "InformedCitizen",
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    id: "5",
    title: "Resolving polarization in political discussions",
    content: "How can we bridge the gap between opposing political viewpoints and find common ground for productive dialogue?",
    category: "common-ground",
    author: "PeaceBuilder",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "6",
    title: "Analyzing newspaper front page design techniques",
    content: "Let's examine how newspapers use visual hierarchy, image placement, and headline sizing to influence reader perception of news importance.",
    category: "media-analysis",
    author: "DesignThinker",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "7",
    title: "Strategies for mediating family conflicts over misinformation",
    content: "What techniques have worked for you when family members are divided by different information sources and facts?",
    category: "solutions-workshop",
    author: "FamilyMediator",
    createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString(),
  },
  {
    id: "8",
    title: "How historical conflicts inform modern political divides",
    content: "Examining how unresolved historical tensions continue to shape current political discourse and social divisions...",
    category: "historical-context",
    author: "HistoryScholar",
    createdAt: new Date(Date.now() - 86400000 * 3.2).toISOString(),
  },
  {
    id: "9",
    title: "Comparing news reporting across different countries",
    content: "Analysis of how the same world events are reported differently based on cultural context and national interests...",
    category: "cultural-perspectives",
    author: "GlobalCitizen",
    createdAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
  }
];

const categories = [
  { 
    id: "all", 
    name: "All Topics", 
    icon: Book,
    description: "All discussions across all categories"
  },
  { 
    id: "media-analysis", 
    name: "Media Analysis", 
    icon: File,
    description: "Examining media techniques, formats, and presentation"
  },
  { 
    id: "fact-checking", 
    name: "Fact Checking", 
    icon: Search,
    description: "Verification of claims and information accuracy"
  },
  { 
    id: "critical-thinking", 
    name: "Critical Thinking", 
    icon: Book,
    description: "Developing skills to evaluate information objectively"
  },
  { 
    id: "source-evaluation", 
    name: "Source Evaluation", 
    icon: ShieldCheck,
    description: "Assessing reliability and bias of information sources"
  },
  { 
    id: "common-ground", 
    name: "Common Ground", 
    icon: Handshake,
    description: "Finding shared values and agreements"
  },
  { 
    id: "cultural-perspectives", 
    name: "Cultural Perspectives", 
    icon: Globe,
    description: "Understanding different cultural contexts of conflicts"
  },
  { 
    id: "historical-context", 
    name: "Historical Context", 
    icon: History,
    description: "Examining how history shapes current conflicts"
  },
  { 
    id: "solutions-workshop", 
    name: "Solutions Workshop", 
    icon: Cog,
    description: "Collaborative problem-solving and proposal development"
  }
];

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useState(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    };
    checkAuth();
  });

  const filteredThreads = sampleThreads
    .filter(thread => {
      const matchesSearch = 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = currentCategory === "all" || thread.category === currentCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateThreadClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a new thread",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setIsCreatingThread(true);
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-secondary py-12">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-medium mb-6">Truth Empowers Peace</h1>
          <p className="text-base max-w-2xl mx-auto mb-8 text-foreground/80">
            A space for verified information, critical thinking, and thoughtful dialogue. 
            Building understanding leads to lasting peace.
          </p>
          <Button 
            variant="outline" 
            className="text-primary"
            onClick={() => document.getElementById('forum-content')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Join The Conversation
          </Button>
        </div>
      </div>

      <div id="forum-content" className="container mx-auto max-w-4xl py-10 px-4">
        <header className="mb-10">
          <h2 className="text-2xl font-medium mb-4">Discussions</h2>
          <p className="text-base text-muted-foreground">
            A focused space for dialogue and information verification.
          </p>
        </header>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search threads..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handleCreateThreadClick} variant="outline" className="flex-1 sm:flex-auto">
                New Thread
              </Button>
              <Button variant="ghost" onClick={() => setCurrentCategory("all")} className="sm:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="hidden sm:block">
            <Tabs defaultValue="all" onValueChange={setCurrentCategory}>
              <TabsList className="mb-6">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isCreatingThread && (
            <ThreadForm 
              onCancel={() => setIsCreatingThread(false)}
              onSubmit={() => setIsCreatingThread(false)}
              categories={categories}
            />
          )}

          {filteredThreads.length > 0 ? (
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <Card key={thread.id} className="bg-white border-border/30 hover:border-border/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">{thread.title}</h3>
                        <span className="text-xs text-muted-foreground">{formatDate(thread.createdAt)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {categories.find(c => c.id === thread.category)?.name || "General"} • {thread.author}
                      </p>
                      <p className="text-sm mt-2 line-clamp-3">{thread.content}</p>
                      <div className="pt-2">
                        <Button variant="ghost" size="sm" className="px-0 text-primary/80 hover:text-primary">
                          Read full thread
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No threads found matching your criteria</p>
            </div>
          )}
          
          <div className="py-6 mt-4">
            <h3 className="text-lg font-medium mb-3">About This Forum</h3>
            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                This is a space dedicated to thoughtful dialogue, fact verification, and 
                building understanding between differing viewpoints.
              </p>
              <p>
                Our philosophy is that meaningful connections happen when we focus on the
                content of the conversation rather than popularity metrics.
              </p>
              <p>
                We've intentionally designed this forum to be distraction-free, with chronological 
                post sorting and no engagement statistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
