// AI provider adapters — each returns { text, inputTokens, outputTokens }

export const callOpenAI = async ({ apiKey, model, systemPrompt, userPrompt, config = {} }) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      max_tokens: config.maxTokens || 2000,
      temperature: config.temperature ?? 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI error ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage.prompt_tokens,
    outputTokens: data.usage.completion_tokens,
  };
};

export const callAnthropic = async ({ apiKey, model, systemPrompt, userPrompt, config = {} }) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-6',
      max_tokens: config.maxTokens || 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Anthropic error ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.content[0].text,
    inputTokens: data.usage.input_tokens,
    outputTokens: data.usage.output_tokens,
  };
};

export const callGemini = async ({ apiKey, model, systemPrompt, userPrompt, config = {} }) => {
  const modelId = model || 'gemini-1.5-pro';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: config.maxTokens || 2000,
          temperature: config.temperature ?? 0.7,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.candidates[0].content.parts[0].text,
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
  };
};

export const callMistral = async ({ apiKey, model, systemPrompt, userPrompt, config = {} }) => {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'mistral-large-latest',
      max_tokens: config.maxTokens || 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Mistral error ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage.prompt_tokens,
    outputTokens: data.usage.completion_tokens,
  };
};

export const callGroq = async ({ apiKey, model, systemPrompt, userPrompt, config = {} }) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      max_tokens: config.maxTokens || 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage.prompt_tokens,
    outputTokens: data.usage.completion_tokens,
  };
};

// Main router — picks the right adapter based on provider slug
export const callAiProvider = async ({ provider, apiKey, userPrompt, config }) => {
  const args = {
    apiKey,
    model: provider.defaultModel,
    systemPrompt: config.systemPrompt,
    userPrompt,
    config: provider.config || {},
  };

  switch (provider.slug) {
    case 'openai':    return callOpenAI(args);
    case 'anthropic': return callAnthropic(args);
    case 'gemini':    return callGemini(args);
    case 'mistral':   return callMistral(args);
    case 'groq':      return callGroq(args);
    default:          return callOpenAI(args);
  }
};
