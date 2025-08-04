import { 
  OpenRouterCompletionRequest, 
  OpenRouterCompletionResponse, 
  AIModel, 
  ApiError 
} from '../types';

export class ApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1'\;
  }

  // Update API key
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Get all models from OpenRouter
  public async getModels(): Promise<AIModel[]> {
    try {
      const response = await this.makeRequest<{data: any[]}>('/models', 'GET');
      
      // Transform response to our AIModel interface
      return response.data.map(model => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description || '',
        maxTokens: model.max_output_tokens || 4000,
        contextLength: model.context_length || 4000,
        provider: model.provider?.name || 'Unknown',
        pricing: model.pricing ? {
          input: model.pricing.prompt,
          output: model.pricing.completion,
        } : undefined,
        tags: this.processModelTags(model),
        isFree: this.isModelFree(model),
        isFiltered: this.isModelFiltered(model),
        isRecommended: model.featured || false,
      }));
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  // Send message to OpenRouter API
  public async sendMessage(
    modelId: string, 
    messages: { role: string; content: string }[],
    options: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      stream?: boolean;
    } = {}
  ): Promise<OpenRouterCompletionResponse> {
    const requestBody: OpenRouterCompletionRequest = {
      model: modelId,
      messages,
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      stream: options.stream || false,
    };

    return this.makeRequest<OpenRouterCompletionResponse>(
      '/chat/completions', 
      'POST', 
      requestBody
    );
  }

  // Generic request method
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AiChat PWA',
      };
      
      // Only add Authorization header if API key is available
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      };

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.message || `Error ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      return await response.json() as T;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handling
  private handleError(error: unknown): void {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.status}): ${error.message}`);
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
  }

  // Process tags from model data
  private processModelTags(model: any): string[] {
    const tags: string[] = [];
    
    // Add provider as a tag
    if (model.provider?.name) {
      tags.push(model.provider.name);
    }
    
    // Add "Free" tag if applicable
    if (this.isModelFree(model)) {
      tags.push('Free');
    }
    
    // Add "Unfiltered" tag if applicable
    if (!this.isModelFiltered(model)) {
      tags.push('Unfiltered');
    }
    
    // Add context length tag
    if (model.context_length) {
      tags.push(`${model.context_length} ctx`);
    }
    
    // Add specialized capability tags
    if (model.capabilities?.includes('vision')) {
      tags.push('Vision');
    }
    
    if (model.capabilities?.includes('tools') || model.capabilities?.includes('function_calling')) {
      tags.push('Tools');
    }
    
    if (model.capabilities?.includes('coding')) {
      tags.push('Code');
    }
    
    // Check for speed tag
    const name = model.name?.toLowerCase() || '';
    if (name.includes('fast') || name.includes('instant') || name.includes('lightning')) {
      tags.push('Fast');
    }
    
    return tags;
  }

  // Check if a model is free (no pricing data or zero cost)
  private isModelFree(model: any): boolean {
    return (
      !model.pricing ||
      (model.pricing.prompt === 0 && model.pricing.completion === 0)
    );
  }

  // Check if a model is filtered/moderated
  private isModelFiltered(model: any): boolean {
    // Models that explicitly mention "unfiltered" are not filtered
    const name = model.name?.toLowerCase() || '';
    const description = model.description?.toLowerCase() || '';
    
    if (
      name.includes('unfiltered') ||
      name.includes('uncensored') ||
      description.includes('unfiltered') ||
      description.includes('uncensored') ||
      description.includes('no filtering')
    ) {
      return false;
    }
    
    // Check if model has safety filters mentioned
    if (
      description.includes('safety') ||
      description.includes('filtered') ||
      description.includes('moderation') ||
      description.includes('guardrails')
    ) {
      return true;
    }
    
    // Default to filtered for safety unless explicitly mentioned otherwise
    return true;
  }
}

// Custom error class for API errors
class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}
