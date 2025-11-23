/**
 * Página de Treinamento da Jul.IA
 * 
 * INSTRUÇÕES PARA ATIVAÇÃO:
 * 1. Descomentar rota em client/src/App.tsx
 * 2. Descomentar rotas de API em server/routers.ts
 * 3. Adicionar link no menu/sidebar
 * 
 * Esta página permite revisar e corrigir aprendizados/falhas da IA
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function Training() {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Buscar logs pendentes
  const { data: pendingLogs, isLoading, refetch } = trpc.training.getPendingLogs.useQuery();

  // Mutações
  const approveMutation = trpc.training.approveLog.useMutation({
    onSuccess: () => {
      toast.success("Aprendizado aprovado!");
      refetch();
      setSelectedLog(null);
      setReviewNotes("");
    },
  });

  const rejectMutation = trpc.training.rejectLog.useMutation({
    onSuccess: () => {
      toast.success("Item rejeitado!");
      refetch();
      setSelectedLog(null);
      setReviewNotes("");
    },
  });

  const correctMutation = trpc.training.correctLog.useMutation({
    onSuccess: () => {
      toast.success("Correção aplicada!");
      refetch();
      setSelectedLog(null);
      setReviewNotes("");
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const learnings = pendingLogs?.filter((log) => log.type === "learning") || [];
  const failures = pendingLogs?.filter((log) => log.type === "failure") || [];
  const doubts = pendingLogs?.filter((log) => log.type === "doubt") || [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🎓 Treinamento da Jul.IA</h1>
        <p className="text-muted-foreground mt-2">
          Revise e corrija os aprendizados, falhas e dúvidas detectados automaticamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Aprendizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learnings.length}</div>
            <p className="text-xs text-muted-foreground">Pendentes de revisão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Falhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failures.length}</div>
            <p className="text-xs text-muted-foreground">Requerem correção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Dúvidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doubts.length}</div>
            <p className="text-xs text-muted-foreground">Precisam de orientação</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="learnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="learnings">Aprendizados ({learnings.length})</TabsTrigger>
          <TabsTrigger value="failures">Falhas ({failures.length})</TabsTrigger>
          <TabsTrigger value="doubts">Dúvidas ({doubts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="learnings" className="space-y-4">
          {learnings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum aprendizado pendente
              </CardContent>
            </Card>
          ) : (
            learnings.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onSelect={() => setSelectedLog(log)}
                isSelected={selectedLog?.id === log.id}
                onApprove={() => approveMutation.mutate({ id: log.id })}
                onReject={() => rejectMutation.mutate({ id: log.id, notes: reviewNotes })}
                onCorrect={(correction) =>
                  correctMutation.mutate({ id: log.id, correction, notes: reviewNotes })
                }
                reviewNotes={reviewNotes}
                setReviewNotes={setReviewNotes}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="failures" className="space-y-4">
          {failures.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma falha pendente
              </CardContent>
            </Card>
          ) : (
            failures.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onSelect={() => setSelectedLog(log)}
                isSelected={selectedLog?.id === log.id}
                onApprove={() => approveMutation.mutate({ id: log.id })}
                onReject={() => rejectMutation.mutate({ id: log.id, notes: reviewNotes })}
                onCorrect={(correction) =>
                  correctMutation.mutate({ id: log.id, correction, notes: reviewNotes })
                }
                reviewNotes={reviewNotes}
                setReviewNotes={setReviewNotes}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="doubts" className="space-y-4">
          {doubts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma dúvida pendente
              </CardContent>
            </Card>
          ) : (
            doubts.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onSelect={() => setSelectedLog(log)}
                isSelected={selectedLog?.id === log.id}
                onApprove={() => approveMutation.mutate({ id: log.id })}
                onReject={() => rejectMutation.mutate({ id: log.id, notes: reviewNotes })}
                onCorrect={(correction) =>
                  correctMutation.mutate({ id: log.id, correction, notes: reviewNotes })
                }
                reviewNotes={reviewNotes}
                setReviewNotes={setReviewNotes}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LogCardProps {
  log: any;
  onSelect: () => void;
  isSelected: boolean;
  onApprove: () => void;
  onReject: () => void;
  onCorrect: (correction: string) => void;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
}

function LogCard({
  log,
  onSelect,
  isSelected,
  onApprove,
  onReject,
  onCorrect,
  reviewNotes,
  setReviewNotes,
}: LogCardProps) {
  const [correction, setCorrection] = useState("");

  const getTypeIcon = () => {
    switch (log.type) {
      case "learning":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failure":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "doubt":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTypeColor = () => {
    switch (log.type) {
      case "learning":
        return "bg-green-100 text-green-800";
      case "failure":
        return "bg-red-100 text-red-800";
      case "doubt":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className={isSelected ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getTypeIcon()}
            <div className="flex-1">
              <CardTitle className="text-lg">{log.title}</CardTitle>
              <CardDescription className="mt-1">{log.description}</CardDescription>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">{log.category}</Badge>
                <Badge className={getTypeColor()}>Confiança: {log.confidence}%</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {isSelected && (
        <CardContent className="space-y-4 border-t pt-4">
          {log.userMessage && (
            <div>
              <p className="text-sm font-medium mb-1">Mensagem do cliente:</p>
              <p className="text-sm bg-muted p-3 rounded">{log.userMessage}</p>
            </div>
          )}

          {log.aiResponse && (
            <div>
              <p className="text-sm font-medium mb-1">Resposta da IA:</p>
              <p className="text-sm bg-muted p-3 rounded">{log.aiResponse}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Suas notas:</label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Adicione observações sobre este item..."
              className="min-h-[80px]"
            />
          </div>

          {log.type === "failure" && (
            <div>
              <label className="text-sm font-medium mb-2 block">Correção (como deveria responder):</label>
              <Textarea
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="Digite a resposta correta que a IA deveria ter dado..."
                className="min-h-[100px]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onApprove} variant="default" className="flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Aprovar
            </Button>

            {log.type === "failure" && correction && (
              <Button onClick={() => onCorrect(correction)} variant="default" className="flex-1">
                Aplicar Correção
              </Button>
            )}

            <Button onClick={onReject} variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
          </div>
        </CardContent>
      )}

      {!isSelected && (
        <CardContent>
          <Button onClick={onSelect} variant="outline" className="w-full">
            Revisar
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
