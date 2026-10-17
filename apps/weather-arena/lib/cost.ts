import type { ModelInfo } from './models';

// Цените са за 1 милион токена, затова делим на 1 000 000.
export function calculateCost(
  model: ModelInfo,
  inputTokens: number,
  outputTokens: number,
): number {
  return (
    (inputTokens * model.inputPrice + outputTokens * model.outputPrice) /
    1_000_000
  );
}

// Цените на една заявка са много малки, затова показваме 6 знака.
export function formatCost(usd: number): string {
  return `$${usd.toFixed(6)}`;
}