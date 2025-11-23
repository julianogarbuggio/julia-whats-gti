    } else {
      report += "\nNenhum aprendizado aplicado nos últimos 7 dias.\n";
    }

    return report;
  } catch (error) {
    console.error("[AI Learning] Error generating report:", error);
    return "❌ Erro ao gerar relatório";
  }
}
