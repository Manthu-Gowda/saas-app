// Default pricing per 1M tokens (USD) — updated May 2026
const DEFAULT_PRICING = {
  openai:    { inputPer1M: 2.50,  outputPer1M: 10.00 },
  anthropic: { inputPer1M: 3.00,  outputPer1M: 15.00 },
  gemini:    { inputPer1M: 1.25,  outputPer1M: 5.00  },
  mistral:   { inputPer1M: 2.00,  outputPer1M: 6.00  },
  groq:      { inputPer1M: 0.05,  outputPer1M: 0.08  },
};

export const calculateCost = ({ providerSlug, inputTokens = 0, outputTokens = 0, customPricing = null }) => {
  const usdToInr = Number(process.env.USD_TO_INR) || 84;
  const rates = customPricing || DEFAULT_PRICING[providerSlug] || { inputPer1M: 0, outputPer1M: 0 };

  const costUsd =
    (inputTokens / 1_000_000) * rates.inputPer1M +
    (outputTokens / 1_000_000) * rates.outputPer1M;

  const costInr = costUsd * usdToInr;

  return {
    costUsd: Math.round(costUsd * 100000) / 100000,
    costInr: Math.round(costInr * 100) / 100,
  };
};

export const formatInr = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const formatUsd = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
