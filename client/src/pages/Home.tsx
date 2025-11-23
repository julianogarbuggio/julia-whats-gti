import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Users, MessageSquare, UserCheck, Calendar, FileText, TrendingUp, FileBarChart, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = trpc.reports.dashboard.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">{APP_TITLE}</CardTitle>
            <CardDescription>
              Sistema de gerenciamento de chatbot para qualificação de leads em revisão de empréstimos bancários
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Faça login para acessar o painel de gerenciamento
            </p>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { icon: Users, label: "Leads", path: "/leads" },
    { icon: MessageSquare, label: "Conversas", path: "/conversations" },
    { icon: TrendingUp, label: "Relatórios", path: "/reports" },
    { icon: BarChart3, label: "Estatísticas", path: "/estatisticas" },
    { icon: FileText, label: "Integrações", path: "/integrations" },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do desempenho do chatbot Jul.IA - Assistente de WhatsApp
          </p>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Leads
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.totalLeads || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Todos os contatos capturados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Leads Qualificados
                </CardTitle>
                <UserCheck className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.leadsQualificados || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Taxa: {stats?.taxaQualificacao || 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Leads Convertidos
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.leadsConvertidos || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Taxa: {stats?.taxaConversao || 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Atendimento Humano
                </CardTitle>
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.leadsAtendimentoHumano || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Encaminhados para advogado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Agendamentos
                </CardTitle>
                <Calendar className="h-5 w-5 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.leadsAgendados || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Atendimentos agendados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Documentos Enviados
                </CardTitle>
                <FileText className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.leadsDocumentosEnviados || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Procurações e contratos
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse as principais funcionalidades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/leads")}
              >
                <Users className="mr-2 h-4 w-4" />
                Visualizar Leads
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/conversations")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Histórico de Conversas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/reports")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Gerar Relatórios
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/integrations")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Configurar Integrações
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={async () => {
                  const confirmed = confirm(
                    "Deseja gerar o relatório diário de aprendizados agora?\n\nO relatório será enviado para (44) 99986-9223 via WhatsApp."
                  );
                  if (confirmed) {
                    try {
                      await trpc.learnings.dailyReport.mutate();
                      alert("✅ Relatório enviado com sucesso!");
                    } catch (error: any) {
                      alert(`❌ Erro ao enviar relatório: ${error.message}`);
                    }
                  }
                }}
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                Gerar Relatório Diário (Teste)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sobre o Sistema</CardTitle>
              <CardDescription>
                Informações sobre o chatbot Jul.IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Funcionalidades</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Qualificação automática de leads via WhatsApp</li>
                  <li>• Integração com Z-API e ZapSign</li>
                  <li>• Gerenciamento completo de conversas</li>
                  <li>• Relatórios e exportação de dados</li>
                  <li>• Sincronização com sistemas Jul.IA</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Especialização</h3>
                <p className="text-sm text-gray-600">
                  Direito do Consumidor - Revisão de Empréstimos Bancários
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
