import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, CheckCircle, XCircle, Clock, Target } from "lucide-react";

export default function Estatisticas() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  
  const { data: learnings, isLoading } = trpc.learnings.list.useQuery({});
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!learnings || learnings.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum dado disponível
          </h3>
          <p className="text-gray-600">
            Adicione treinamentos para visualizar estatísticas
          </p>
        </div>
      </div>
    );
  }
  
  // Filtrar por período
  const now = new Date();
  const filteredLearnings = learnings.filter(l => {
    if (timeRange === "all") return true;
    const createdAt = new Date(l.createdAt);
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return createdAt >= cutoff;
  });
  
  // Métricas gerais
  const totalLearnings = filteredLearnings.length;
  const approved = filteredLearnings.filter(l => l.status === "approved").length;
  const rejected = filteredLearnings.filter(l => l.status === "rejected").length;
  const pending = filteredLearnings.filter(l => l.status === "pending").length;
  const totalApplications = filteredLearnings.reduce((sum, l) => sum + (l.timesApplied || 0), 0);
  const approvalRate = totalLearnings > 0 ? ((approved / totalLearnings) * 100).toFixed(1) : "0";
  
  // Dados para gráfico de evolução (últimos 30 dias)
  const evolutionData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    const count = learnings.filter(l => {
      const createdAt = new Date(l.createdAt);
      return createdAt.toDateString() === date.toDateString();
    }).length;
    evolutionData.push({ date: dateStr, count });
  }
  
  // Dados para gráfico de status
  const statusData = [
    { name: "Aprovados", value: approved, color: "#10b981" },
    { name: "Pendentes", value: pending, color: "#f59e0b" },
    { name: "Rejeitados", value: rejected, color: "#ef4444" },
  ].filter(d => d.value > 0);
  
  // Dados para gráfico de prioridade
  const priorityData = Array.from({ length: 10 }, (_, i) => {
    const priority = i + 1;
    const count = filteredLearnings.filter(l => l.priority === priority).length;
    return { priority: `P${priority}`, count };
  }).filter(d => d.count > 0);
  
  // Top 10 mais aplicados
  const topApplied = [...filteredLearnings]
    .sort((a, b) => (b.timesApplied || 0) - (a.timesApplied || 0))
    .slice(0, 10)
    .map(l => ({
      name: l.context.length > 40 ? l.context.substring(0, 40) + "..." : l.context,
      applications: l.timesApplied || 0,
    }));
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estatísticas de Aprendizado</h1>
          <p className="text-muted-foreground">
            Análise de desempenho e evolução dos treinamentos da Jul.IA
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="all">Todo período</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Treinamentos
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalLearnings}</div>
            <p className="text-xs text-gray-500 mt-1">
              {timeRange === "all" ? "Todo período" : `Últimos ${timeRange.replace("d", " dias")}`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Aprovação
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{approvalRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {approved} aprovados de {totalLearnings}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendentes
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pending}</div>
            <p className="text-xs text-gray-500 mt-1">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Aplicações
            </CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalApplications}</div>
            <p className="text-xs text-gray-500 mt-1">
              Vezes que IA usou treinamentos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução ao longo do tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Treinamentos</CardTitle>
            <CardDescription>Novos treinamentos nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Treinamentos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Aprovados, pendentes e rejeitados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Distribuição por Prioridade */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Prioridade</CardTitle>
            <CardDescription>Quantidade de treinamentos por nível de prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Treinamentos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Top 10 Mais Aplicados */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Mais Aplicados</CardTitle>
            <CardDescription>Treinamentos mais utilizados pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topApplied} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" width={150} fontSize={10} />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#10b981" name="Aplicações" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
