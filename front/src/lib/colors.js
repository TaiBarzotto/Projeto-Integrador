/**
 * Variáveis de cor centralizadas para o sistema
 * Utilize estas constantes para manter consistência visual
 */

// Cores principais
export const COLORS = {
  // Cores semânticas
  SUCCESS: '#10b981',
  SUCCESS_LIGHT: '#d1fae5',
  ERROR: '#ef4444',
  ERROR_LIGHT: '#fee2e2',
  WARNING: '#f59e0b',
  WARNING_LIGHT: '#fef3c7',
  INFO: '#3b82f6',
  INFO_LIGHT: '#dbeafe',

  // Cores específicas do domínio
  VENDAS: '#10b981',      // Verde para vendas/receitas
  DESPESAS: '#ef4444',    // Vermelho para despesas
  PENDENTE: '#f59e0b',    // Laranja para itens pendentes
  PAGO: '#10b981',        // Verde para itens pagos

  // Cores neutras (do tema)
  BACKGROUND: '#F7F3EF',
  FOREGROUND: '#b4b596',
  MUTED: '#ececf0',
  MUTED_FOREGROUND: '#717182',
  BORDER: 'rgba(0, 0, 0, 0.1)',

  // Cores para gráficos
  CHART: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#10b981',
    TERTIARY: '#f59e0b',
    QUATERNARY: '#8b5cf6',
    QUINARY: '#ec4899',
  },
};

// Classes Tailwind pré-definidas para uso comum
export const COLOR_CLASSES = {
  SUCCESS: {
    text: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-600',
  },
  ERROR: {
    text: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-600',
  },
  WARNING: {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-600',
  },
  INFO: {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-600',
  },
};
