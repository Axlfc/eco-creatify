
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, Filter } from "lucide-react";
import ProposalCard, { ProposalPhase } from "./ProposalCard";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";


// Fetch proposals desde Supabase con paginación y filtros
// Se puede ampliar para ordenación, scroll infinito, etc.
const fetchProposals = async ({
  page,
  limit,
  search,
  category,
  phase,
}: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  phase?: string;
}) => {
  let query = supabase
    .from('proposals')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Filtros
  if (search && search.trim()) {
    query = query.ilike('title', `%${search}%`);
  }
  if (category && category !== 'All Categories') {
    query = query.eq('category', category);
  }
  if (phase && phase !== 'all') {
    query = query.eq('phase', phase);
  }

  // Paginación
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0 };
};

const categories = [
  "All Categories",
  "Environment",
  "Education",
  "Technology",
  "Governance",
  "Community",
  "Infrastructure",
  "Culture",
  "Health",
  "Safety"
];

const ProposalsList: React.FC = () => {

  // Estados de paginación y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPhase, setCurrentPhase] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // React Query para obtener propuestas con paginación y filtros
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["proposals", { page, limit, searchQuery, categoryFilter, currentPhase }],
    queryFn: () => fetchProposals({
      page,
      limit,
      search: searchQuery,
      category: categoryFilter,
      phase: currentPhase,
    }),
    keepPreviousData: true,
  });

  const proposals = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Refrescar tras crear/editar/eliminar: llamar refetch() desde onSuccess de ProposalForm

  // Manejo de loading y error
  if (isLoading) {
    return <div className="py-10 text-center">Cargando propuestas...</div>;
  }
  if (isError) {
    return <div className="py-10 text-center text-red-500">Error al cargar propuestas</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propuestas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto items-center">
          {/* Botón para crear nueva propuesta, visible solo si autenticado */}
          {isAuthenticated && (
            <Button
              className="flex-1 sm:flex-initial"
              onClick={() => navigate("/proposals/new")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva propuesta
            </Button>
          )}
          <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs de fase */}
      <Tabs defaultValue="all" value={currentPhase} onValueChange={v => { setCurrentPhase(v); setPage(1); }}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="presentation">Presentación</TabsTrigger>
          <TabsTrigger value="discussion">Discusión</TabsTrigger>
          <TabsTrigger value="voting">Votación</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de propuestas */}
      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal: any) => (
            // Pasar el usuario autenticado para control de edición
            <ProposalCard key={proposal.id} {...proposal} currentUser={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No se encontraron propuestas que coincidan con tu búsqueda</p>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Anterior
        </Button>
        <span className="text-sm">Página {page} de {totalPages || 1}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Siguiente
        </Button>
        <select
          className="ml-4 border rounded px-2 py-1 text-sm"
          value={limit}
          onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
        >
          {[5, 10, 20, 50].map(opt => (
            <option key={opt} value={opt}>{opt} por página</option>
          ))}
        </select>
      </div>

      {/* Comentario: Para scroll infinito, reemplazar paginación por observer y concatenar resultados. */}
    </div>
  );
};

export default ProposalsList;
