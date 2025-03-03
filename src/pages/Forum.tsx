import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  Brain, 
  Shield, 
  Search, 
  MessageSquare,
  Users,
  Lightbulb,
  HeartHandshake
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

type ForumThread = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  upvotes: number;
  commentCount: number;
  credibilityScore: number;
  isFact: boolean | null;
};

// Sample forum data for demonstration
const sampleThreads: ForumThread[] = [
  {
    id: "1",
    title: "How to identify misinformation in social media",
    content: "In this thread, we'll discuss techniques to identify manipulated content and misinformation campaigns that spread on social media platforms...",
    category: "media-literacy",
    author: "MediaLiteracy101",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    upvotes: 124,
    commentCount: 37,
    credibilityScore: 92,
    isFact: true
  },
  {
    id: "2",
    title: "Understanding confirmation bias in news consumption",
    content: "Confirmation bias affects how we consume news. Let's explore ways to diversify information sources and recognize our own biases...",
    category: "critical-thinking",
    author: "CriticalThinker",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    upvotes: 78,
    commentCount: 43,
    credibilityScore: 88,
    isFact: true
  },
  {
    id: "3",
    title: "Debunking recent climate change myth",
    content: "This popular article claiming that climate scientists are backing away from consensus has several factual errors. Let's analyze the claims...",
    category: "fact-check",
    author: "ScienceMinded",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    upvotes: 231,
    commentCount: 87,
    credibilityScore: 95,
    isFact: true
  },
  {
    id: "4",
    title: "Is this election news report accurate?",
    content: "I've seen this article shared widely, but some claims about voting statistics seem suspicious. Can we verify this information?",
    category: "fact-check",
    author: "InformedCitizen",
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    upvotes: 52,
    commentCount: 29,
    credibilityScore: 45,
    isFact: null
  },
];

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useState(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    };
    checkAuth();
  });

  // Filter threads based on search query and category
  const filteredThreads = sampleThreads.filter(thread => {
    const matchesSearch = 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = currentCategory === "all" || thread.category === currentCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle thread creation
  const handleCreateThread = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a new thread",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your thread",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would save to the database here
    toast({
      title: "Thread submitted",
      description: "Your thread has been submitted for review and will be published soon.",
    });

    // Reset form
    setNewThreadTitle("");
    setNewThreadContent("");
    setIsCreatingThread(false);
  };

  // Format date for display
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
      
      {/* Mission Statement Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <HeartHandshake className="h-12 w-12 mr-4" />
            <h1 className="text-4xl font-bold">Truth Empowers Peace</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            We're building a global network where verified information flows freely, 
            AI helps identify manipulation, and critical thinking skills are strengthened—creating 
            a foundation for understanding that leads to lasting peace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-indigo-700 hover:bg-gray-100"
              onClick={() => document.getElementById('forum-content')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join The Conversation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>

      <div id="forum-content" className="container mx-auto max-w-7xl py-10 px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <Globe className="mr-3 h-8 w-8" />
            Global Information Network
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            A decentralized platform for free and verified information, using AI to combat manipulation 
            and educating users in critical thinking skills.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
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
              <Button onClick={() => setIsCreatingThread(true)} className="w-full sm:w-auto">
                Start New Thread
              </Button>
            </div>

            <Tabs defaultValue="all" onValueChange={setCurrentCategory}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Topics</TabsTrigger>
                <TabsTrigger value="media-literacy">Media Literacy</TabsTrigger>
                <TabsTrigger value="critical-thinking">Critical Thinking</TabsTrigger>
                <TabsTrigger value="fact-check">Fact Checks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {isCreatingThread && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Create New Thread</CardTitle>
                      <CardDescription>Share information or ask questions to verify facts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Input 
                          placeholder="Thread title" 
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Textarea 
                          placeholder="Thread content" 
                          value={newThreadContent}
                          onChange={(e) => setNewThreadContent(e.target.value)}
                          rows={5}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreatingThread(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateThread}>
                        Submit Thread
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {filteredThreads.length > 0 ? (
                  filteredThreads.map((thread) => (
                    <Card key={thread.id} className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-xl">{thread.title}</CardTitle>
                          {thread.isFact === true && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                          {thread.isFact === false && (
                            <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Misleading
                            </div>
                          )}
                        </div>
                        <CardDescription>
                          Posted by {thread.author} • {formatDate(thread.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{thread.content}</p>
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {thread.commentCount} comments
                          </div>
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Credibility: {thread.credibilityScore}%
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No threads found matching your criteria</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="media-literacy" className="space-y-6">
                {filteredThreads
                  .filter(thread => thread.category === "media-literacy")
                  .map((thread) => (
                    <Card key={thread.id} className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-xl">{thread.title}</CardTitle>
                          {thread.isFact === true && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                        </div>
                        <CardDescription>
                          Posted by {thread.author} • {formatDate(thread.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{thread.content}</p>
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {thread.commentCount} comments
                          </div>
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Credibility: {thread.credibilityScore}%
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="critical-thinking" className="space-y-6">
                {filteredThreads
                  .filter(thread => thread.category === "critical-thinking")
                  .map((thread) => (
                    <Card key={thread.id} className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-xl">{thread.title}</CardTitle>
                          {thread.isFact === true && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                        </div>
                        <CardDescription>
                          Posted by {thread.author} • {formatDate(thread.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{thread.content}</p>
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {thread.commentCount} comments
                          </div>
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Credibility: {thread.credibilityScore}%
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="fact-check" className="space-y-6">
                {filteredThreads
                  .filter(thread => thread.category === "fact-check")
                  .map((thread) => (
                    <Card key={thread.id} className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-xl">{thread.title}</CardTitle>
                          {thread.isFact === true && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                          {thread.isFact === false && (
                            <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Misleading
                            </div>
                          )}
                          {thread.isFact === null && (
                            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Under Review
                            </div>
                          )}
                        </div>
                        <CardDescription>
                          Posted by {thread.author} • {formatDate(thread.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{thread.content}</p>
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {thread.commentCount} comments
                          </div>
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Credibility: {thread.credibilityScore}%
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Critical Thinking Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Check Multiple Sources</h3>
                  <p className="text-sm text-muted-foreground">Verify information across different reputable sources before accepting claims as fact.</p>
                </div>
                <div>
                  <h3 className="font-medium">Identify Cognitive Biases</h3>
                  <p className="text-sm text-muted-foreground">Be aware of confirmation bias, availability bias, and other mental shortcuts that can distort reasoning.</p>
                </div>
                <div>
                  <h3 className="font-medium">Look for Evidence</h3>
                  <p className="text-sm text-muted-foreground">Ask for data, studies, or concrete examples that support claims, not just opinions or hearsay.</p>
                </div>
                <Button variant="outline" className="w-full">View All Tips</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Active Fact-Checkers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-xs text-blue-800">SM</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ScienceMinded</p>
                      <p className="text-xs text-muted-foreground">231 facts verified</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-xs text-green-800">ML</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">MediaLiteracy101</p>
                      <p className="text-xs text-muted-foreground">124 facts verified</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-xs text-purple-800">CT</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">CriticalThinker</p>
                      <p className="text-xs text-muted-foreground">78 facts verified</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  AI Verification System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our AI system analyzes content across thousands of sources to detect 
                  misinformation patterns, manipulated media, and deceptive claims.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fact-checked items</span>
                    <span className="font-medium">12,483</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Manipulated media identified</span>
                    <span className="font-medium">3,927</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Community verifications</span>
                    <span className="font-medium">28,651</span>
                  </div>
                </div>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
