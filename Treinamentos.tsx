import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Pause, Play, Plus, Search, TrendingUp } from "lucide-react";

type LearningStatus = "pending" | "approved" | "rejected";
type LearningType = "real" | "simulated";

export default function Treinamentos() {
  const utils = trpc.useUtils();
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<LearningStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<LearningType | "all">("all");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minPriority, setMinPriority] = useState<number | "">("");
  const [maxPriority, setMaxPriority] = useState<number | "">("");
  const [minApplications, setMinApplications] = useState<number | "">("");
  const [maxApplications, setMaxApplications] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "timesApplied">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Formulário de novo treinamento
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "simulated" as LearningType,
    context: "",
    correctResponse: "",
    avoidResponse: "",
    keywords: "",
    priority: 5,
    notes: "",
    trainedBy: "5544999869223",
  });
  
  // Queries
  const { data: learnings, isLoading } = trpc.learnings.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
    ativo: undefined,
  });
  
  // Filtrar e ordenar no frontend
  const filteredLearnings = learnings
    ?.filter(l => {
      // Filtro por keyword
      if (keywordFilter && !(
        l.context.toLowerCase().includes(keywordFilter.toLowerCase()) ||
        l.correctResponse.toLowerCase().includes(keywordFilter.toLowerCase()) ||
        (l.keywords && l.keywords.toLowerCase().includes(keywordFilter.toLowerCase()))
      )) return false;
      
      // Filtro por data
      if (dateFrom && new Date(l.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(l.createdAt) > new Date(dateTo + "T23:59:59")) return false;
      
      // Filtro por prioridade
      if (minPriority !== "" && l.priority < minPriority) return false;
      if (maxPriority !== "" && l.priority > maxPriority) return false;
      
      // Filtro por número de aplicações
      if (minApplications !== "" && l.timesApplied < minApplications) return false;
      if (maxApplications !== "" && l.timesApplied > maxApplications) return false;
      
      return true;
    })
    ?.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "priority") {
        comparison = a.priority - b.priority;
      } else if (sortBy === "timesApplied") {
        comparison = a.timesApplied - b.timesApplied;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  
  const { data: pendingCount } = trpc.learnings.pending.useQuery();
  
  // Mutations
  const saveMutation = trpc.learnings.save.useMutation({
    onSuccess: () => {
      toast.success("Treinamento salvo com sucesso!");
      utils.learnings.list.invalidate();
      utils.learnings.pending.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    },
  });
  
  const approveMutation = trpc.learnings.approve.useMutation({
    onSuccess: () => {
      toast.success("Treinamento aprovado!");
      utils.learnings.list.invalidate();
      utils.learnings.pending.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao aprovar: ${error.message}`);
    },
  });
  
  const rejectMutation = trpc.learnings.reject.useMutation({
    onSuccess: () => {
      toast.success("Treinamento rejeitado!");
      utils.learnings.list.invalidate();
      utils.learnings.pending.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao rejeitar: ${error.message}`);
    },
  });
  
  const deactivateMutation = trpc.learnings.deactivate.useMutation({
    onSuccess: () => {
      toast.success("Treinamento desativado!");
      utils.learnings.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao desativar: ${error.message}`);
    },
  });
  
  const resetForm = () => {
    setFormData({
      type: "simulated",
      context: "",
      correctResponse: "",
      avoidResponse: "",
      keywords: "",
      priority: 5,
      notes: "",
      trainedBy: "5544999869223",
    });
  };
  
  const handleSave = () => {
    if (!formData.context || !formData.correctResponse) {
      toast.error("Preencha contexto e resposta correta");
      return;
    }
    
    saveMutation.mutate({
      type: formData.type,
      context: formData.context,
      correctResponse: formData.correctResponse,
      avoidResponse: formData.avoidResponse || undefined,
      keywords: JSON.stringify(formData.keywords.split(",").map(k => k.trim()).filter(Boolean)),
      priority: formData.priority,
      notes: formData.notes || undefined,
      trainedBy: "5544999869223",
    });
  };
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "outline", label: "Pendente" },
      approved: { variant: "secondary", label: "Aprovado" },
      rejected: { variant: "destructive", label: "Rejeitado" },
      active: { variant: "default", label: "Ativo" },
      inactive: { variant: "outline", label: "Inativo" },
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  const getTypeBadge = (type: string) => {
    return type === "real" ? (
      <Badge variant="destructive">Real</Badge>
    ) : (
      <Badge variant="secondary">Simulado</Badge>
    );
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treinamentos da Jul.IA</h1>
          <p className="text-muted-foreground">
            Gerencie os aprendizados da assistente virtual
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Treinamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Treinamento</DialogTitle>
              <DialogDescription>
                Ensine a Jul.IA a responder melhor em situações específicas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as LearningType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simulated">Simulado (novo cenário)</SelectItem>
                    <SelectItem value="real">Real (corrigir erro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Contexto / Situação *</Label>
                <Textarea
                  placeholder="Ex: Cliente pergunta se pode cancelar empréstimo consignado"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Resposta Correta *</Label>
                <Textarea
                  placeholder="Ex: Explique que consignado não pode ser cancelado, mas pode ser revisado se tiver juros abusivos"
                  value={formData.correctResponse}
                  onChange={(e) => setFormData({ ...formData, correctResponse: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div>
                <Label>O que Evitar</Label>
                <Textarea
                  placeholder="Ex: Nunca diga que é impossível fazer nada"
                  value={formData.avoidResponse}
                  onChange={(e) => setFormData({ ...formData, avoidResponse: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Palavras-chave (separadas por vírgula)</Label>
                <Input
                  placeholder="Ex: cancelar, empréstimo, consignado"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Prioridade (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 5 })}
                />
              </div>
              
              <div>
                <Label>Notas Internas</Label>
                <Textarea
                  placeholder="Observações internas (opcional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learnings?.filter(l => l.status === "approved" && l.ativo).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Usos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learnings?.reduce((sum, l) => sum + (l.timesApplied || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learnings?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filtros Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                    <SelectItem value="approved">Aprovados</SelectItem>
                    <SelectItem value="rejected">Rejeitados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tipo</Label>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="real">Real</SelectItem>
                      <SelectItem value="simulated">Simulado</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Palavra-chave</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
            
            {/* Filtros Avançados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label>Data de Criação (De)</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Data de Criação (Até)</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Prioridade Mínima</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1-10"
                  value={minPriority}
                  onChange={(e) => setMinPriority(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              
              <div>
                <Label>Prioridade Máxima</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1-10"
                  value={maxPriority}
                  onChange={(e) => setMaxPriority(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              
              <div>
                <Label>Aplicações Mínimas</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Mín"
                  value={minApplications}
                  onChange={(e) => setMinApplications(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              
              <div>
                <Label>Aplicações Máximas</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Máx"
                  value={maxApplications}
                  onChange={(e) => setMaxApplications(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              
              <div>
                <Label>Ordenar Por</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Data de Criação</SelectItem>
                    <SelectItem value="priority">Prioridade</SelectItem>
                    <SelectItem value="timesApplied">Número de Aplicações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Ordem</Label>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Decrescente</SelectItem>
                    <SelectItem value="asc">Crescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Botão Limpar Filtros */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setKeywordFilter("");
                  setDateFrom("");
                  setDateTo("");
                  setMinPriority("");
                  setMaxPriority("");
                  setMinApplications("");
                  setMaxApplications("");
                  setSortBy("createdAt");
                  setSortOrder("desc");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Lista de Treinamentos */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Carregando...
            </CardContent>
          </Card>
        ) : filteredLearnings && filteredLearnings.length > 0 ? (
          filteredLearnings.map((learning) => (
            <Card key={learning.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{learning.context}</CardTitle>
                      {getTypeBadge(learning.type)}
                      {getStatusBadge(learning.status)}
                    </div>
                    <CardDescription>
                      Prioridade: {learning.priority} | Usado {learning.timesApplied} vezes
                      {learning.lastAppliedAt && ` | Último uso: ${new Date(learning.lastAppliedAt).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    {learning.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => approveMutation.mutate({ id: learning.id })}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate({ id: learning.id })}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                    
                    {learning.status === "approved" && learning.ativo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deactivateMutation.mutate({ id: learning.id })}
                        disabled={deactivateMutation.isPending}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Desativar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resposta Correta:</p>
                  <p className="text-sm">{learning.correctResponse}</p>
                </div>
                
                {learning.avoidResponse && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">O que Evitar:</p>
                    <p className="text-sm">{learning.avoidResponse}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Palavras-chave:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {learning.keywords && (JSON.parse(learning.keywords) as string[]).map((keyword, i) => (
                      <Badge key={i} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                </div>
                
                {learning.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notas:</p>
                    <p className="text-sm text-muted-foreground">{learning.notes}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <span>Criado em: {new Date(learning.trainedAt).toLocaleString()}</span>
                  {learning.approvedAt && (
                    <span>Aprovado em: {new Date(learning.approvedAt).toLocaleString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum treinamento encontrado
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
