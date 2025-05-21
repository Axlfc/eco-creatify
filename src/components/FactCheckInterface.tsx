
import React, { useState } from "react";
import { Search, Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import FactCheckCard, { FactCheck, Source } from "./FactCheckCard";
import { useToast } from "@/hooks/use-toast";

// Sample fact checks data
const sampleFactChecks: FactCheck[] = [
  {
    id: "1",
    claim: "Study finds that coffee consumption increases lifespan by up to 5 years",
    status: "disputed",
    explanation: "The original study found a correlation between moderate coffee consumption and longer lifespan, but did not establish causation. Multiple follow-up studies have shown mixed results, suggesting the relationship is more complex than initially reported.",
    sources: [
      {
        id: "s1",
        title: "Association of Coffee Drinking with Mortality",
        url: "https://example.com/coffee-study",
        type: "academic",
        author: "Johnson et al.",
        date: "2023-02-15",
        publishedBy: "Journal of Nutrition"
      },
      {
        id: "s2",
        title: "Meta-analysis: Coffee consumption and mortality risk",
        url: "https://example.com/coffee-meta",
        type: "academic",
        author: "Smith et al.",
        date: "2023-05-10",
        publishedBy: "European Journal of Epidemiology"
      }
    ],
    consensusLevel: 45,
    dateChecked: "2023-06-01",
    category: "health"
  },
  {
    id: "2",
    claim: "Federal voting law requires photo ID in all 50 states",
    status: "refuted",
    explanation: "There is no federal law requiring photo ID for voting in all 50 states. States have different voter identification requirements, and many accept non-photo forms of ID or other verification methods.",
    sources: [
      {
        id: "s3",
        title: "Voter Identification Requirements by State",
        url: "https://example.com/voter-id-requirements",
        type: "government",
        date: "2023-01-20",
        publishedBy: "National Conference of State Legislatures"
      },
      {
        id: "s4",
        title: "Federal Voting Laws Overview",
        url: "https://example.com/federal-voting-laws",
        type: "primary",
        date: "2022-11-05",
        publishedBy: "U.S. Election Assistance Commission"
      }
    ],
    consensusLevel: 95,
    dateChecked: "2023-02-15",
    category: "politics"
  },
  {
    id: "3",
    claim: "Renewable energy is now cheaper than fossil fuels in most major markets",
    status: "verified",
    explanation: "Multiple independent analyses from financial and energy research organizations confirm that new renewable energy installations are now less expensive than new fossil fuel plants in a majority of markets worldwide.",
    sources: [
      {
        id: "s5",
        title: "Renewable Power Generation Costs in 2022",
        url: "https://example.com/renewable-costs-2022",
        type: "organization",
        date: "2023-03-10",
        publishedBy: "International Renewable Energy Agency"
      },
      {
        id: "s6",
        title: "Levelized Cost of Energy Analysis, Version 15.0",
        url: "https://example.com/lcoe-15",
        type: "organization",
        date: "2023-01-18",
        publishedBy: "Lazard"
      },
      {
        id: "s7",
        title: "Energy Market Analysis: Renewables vs Fossil Fuels",
        url: "https://example.com/energy-market-analysis",
        type: "academic",
        author: "Zhang et al.",
        date: "2022-12-05",
        publishedBy: "Energy Economics Journal"
      }
    ],
    consensusLevel: 87,
    dateChecked: "2023-03-25",
    category: "environment"
  },
  {
    id: "4",
    claim: "Historical data shows vaccination rates declined by 50% during the pandemic",
    status: "inconclusive",
    explanation: "Available data shows varied impacts on vaccination rates during the pandemic. Some regions did experience declines, but the global or nationwide average does not support a 50% reduction claim. More comprehensive data collection is needed.",
    sources: [
      {
        id: "s8",
        title: "Impact of COVID-19 on Routine Immunization",
        url: "https://example.com/covid-immunization-impact",
        type: "organization",
        date: "2023-01-30",
        publishedBy: "World Health Organization"
      },
      {
        id: "s9",
        title: "Vaccination Coverage Among Children, 2019-2022",
        url: "https://example.com/vaccination-coverage-children",
        type: "government",
        date: "2022-09-15",
        publishedBy: "Centers for Disease Control and Prevention"
      }
    ],
    consensusLevel: 35,
    dateChecked: "2023-02-28",
    category: "health"
  }
];

const FactCheckInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const handleSourceClick = (source: Source) => {
    // In a real app, you might open the source in a new tab or display it in a modal
    window.open(source.url, "_blank");
    
    toast({
      title: "Source opened",
      description: `Opening ${source.title}`,
      duration: 3000,
    });
  };

  const filteredFactChecks = sampleFactChecks.filter(factCheck => {
    const matchesSearch = 
      factCheck.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factCheck.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || factCheck.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || factCheck.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Fact Checks</h2>
        <Button variant="outline" className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Submit Claim</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search claims..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
            <SelectItem value="refuted">Refuted</SelectItem>
            <SelectItem value="inconclusive">Inconclusive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="politics">Politics</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {filteredFactChecks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredFactChecks.map(factCheck => (
            <FactCheckCard 
              key={factCheck.id} 
              factCheck={factCheck} 
              onSourceClick={handleSourceClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No fact checks found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default FactCheckInterface;
