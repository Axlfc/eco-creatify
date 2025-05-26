
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Plus,
  Shield,
  Users,
  TrendingUp
} from "lucide-react";

// Mock data for fact checks
const mockFactChecks = [
  {
    id: "1",
    claim: "Climate change policies reduce economic growth by 15% annually",
    status: "false" as const,
    confidence: 85,
    submittedBy: "ClimateResearcher",
    submittedAt: "2024-01-15",
    category: "Environment",
    sources: 12,
    votes: { support: 45, oppose: 8 }
  },
  {
    id: "2", 
    claim: "Renewable energy creates more jobs than fossil fuel industries",
    status: "mostly-true" as const,
    confidence: 78,
    submittedBy: "EnergyAnalyst",
    submittedAt: "2024-01-14",
    category: "Economics",
    sources: 8,
    votes: { support: 32, oppose: 12 }
  },
  {
    id: "3",
    claim: "Local organic farming reduces transportation emissions by 40%",
    status: "pending" as const,
    confidence: 0,
    submittedBy: "FarmAdvocate",
    submittedAt: "2024-01-16",
    category: "Agriculture",
    sources: 3,
    votes: { support: 15, oppose: 3 }
  }
];

const statusConfig = {
  "true": { 
    icon: CheckCircle, 
    color: "text-green-600", 
    bg: "bg-green-50", 
    label: "Verified True",
    border: "border-green-200"
  },
  "false": { 
    icon: XCircle, 
    color: "text-red-600", 
    bg: "bg-red-50", 
    label: "Verified False",
    border: "border-red-200"
  },
  "mostly-true": { 
    icon: CheckCircle, 
    color: "text-blue-600", 
    bg: "bg-blue-50", 
    label: "Mostly True",
    border: "border-blue-200"
  },
  "pending": { 
    icon: Clock, 
    color: "text-amber-600", 
    bg: "bg-amber-50", 
    label: "Under Review",
    border: "border-amber-200"
  }
};

const FactCheckInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [newClaim, setNewClaim] = useState("");
  const [newSources, setNewSources] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const filteredFactChecks = mockFactChecks.filter(factCheck =>
    factCheck.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    factCheck.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitClaim = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para enviar claims para verificación",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!newClaim.trim()) {
      toast({
        title: "Claim requerido",
        description: "Por favor ingresa un claim para verificar",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implementar envío real de claim
    toast({
      title: "Claim enviado",
      description: "Tu claim ha sido enviado para verificación y será revisado por la comunidad",
      variant: "default"
    });

    setNewClaim("");
    setNewSources("");
    setSelectedCategory("");
    setShowSubmissionForm(false);
  };

  const handleViewDetail = (factCheckId: string) => {
    // TODO: Implementar vista de detalle de fact check
    toast({
      title: "Vista de detalle",
      description: `Detalle completo del fact check ${factCheckId} estará disponible próximamente`,
      variant: "default"
    });
  };

  const handleVote = (factCheckId: string, voteType: 'support' | 'oppose') => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para votar en fact checks",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // TODO: Implementar sistema de votación real
    toast({
      title: "Voto registrado",
      description: `Tu voto de ${voteType === 'support' ? 'apoyo' : 'oposición'} ha sido registrado`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Community Fact Checking
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sistema colaborativo de verificación de información. La comunidad evalúa claims y proporciona evidencia.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fact checks o categorías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Autenticación requerida",
                    description: "Debes iniciar sesión para enviar claims",
                    variant: "destructive"
                  });
                  navigate("/auth");
                  return;
                }
                setShowSubmissionForm(!showSubmissionForm);
              }}
              className="flex items-center gap-2"
              variant={showSubmissionForm ? "outline" : "default"}
            >
              <Plus className="h-4 w-4" />
              {showSubmissionForm ? "Cancelar" : "Submit Claim"}
            </Button>
          </div>

          {showSubmissionForm && (
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Submit New Claim for Verification</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Envía un claim para que la comunidad lo verifique con evidencia y fuentes.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Claim to verify</label>
                  <Textarea
                    placeholder="Ingresa el claim que quieres que la comunidad verifique..."
                    value={newClaim}
                    onChange={(e) => setNewClaim(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="Environment">Environment</option>
                    <option value="Economics">Economics</option>
                    <option value="Health">Health</option>
                    <option value="Technology">Technology</option>
                    <option value="Politics">Politics</option>
                    <option value="Science">Science</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Initial sources (optional)</label>
                  <Textarea
                    placeholder="Proporciona enlaces o referencias iniciales que apoyen o cuestionen este claim..."
                    value={newSources}
                    onChange={(e) => setNewSources(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSubmitClaim} disabled={!newClaim.trim()}>
                    Submit Claim
                  </Button>
                  <Button variant="outline" onClick={() => setShowSubmissionForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {filteredFactChecks.length > 0 ? (
              filteredFactChecks.map((factCheck) => {
                const config = statusConfig[factCheck.status];
                const StatusIcon = config.icon;
                
                return (
                  <Card key={factCheck.id} className={`${config.border} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{factCheck.category}</Badge>
                            <Badge className={`${config.bg} ${config.color} border-0`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            {factCheck.status !== 'pending' && (
                              <Badge variant="outline">
                                {factCheck.confidence}% confidence
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-lg mb-2">{factCheck.claim}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Por: {factCheck.submittedBy}</span>
                            <span>{new Date(factCheck.submittedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {factCheck.sources} sources
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {factCheck.votes.support + factCheck.votes.oppose} votes
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(factCheck.id)}
                          className="ml-4"
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Detail
                        </Button>
                      </div>
                      
                      {factCheck.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <span className="text-sm text-muted-foreground">Community evaluation:</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleVote(factCheck.id, 'support')}
                            disabled={!isAuthenticated}
                            title={!isAuthenticated ? "Inicia sesión para votar" : "Apoyar este fact check"}
                          >
                            Support ({factCheck.votes.support})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleVote(factCheck.id, 'oppose')}
                            disabled={!isAuthenticated}
                            title={!isAuthenticated ? "Inicia sesión para votar" : "Oponerse a este fact check"}
                          >
                            Oppose ({factCheck.votes.oppose})
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-md">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No fact checks found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery 
                    ? "No se encontraron fact checks que coincidan con tu búsqueda"
                    : "No hay fact checks disponibles. ¡Sé el primero en contribuir!"
                  }
                </p>
                {!searchQuery && isAuthenticated && (
                  <Button 
                    onClick={() => setShowSubmissionForm(true)} 
                    className="mt-4"
                    variant="outline"
                  >
                    Submit First Claim
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactCheckInterface;
