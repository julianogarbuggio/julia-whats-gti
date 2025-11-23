import { describe, it, expect } from 'vitest';

describe('OpenAI API Key Validation', () => {
  it('should validate OpenAI API Key by calling a lightweight endpoint', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^sk-/);
    
    // Test with a lightweight API call (list models)
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  }, 10000); // 10 second timeout
});
