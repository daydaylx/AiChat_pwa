import { useCallback } from 'react';
import { AIModel } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export const useModelService = () => {
  const { settings } = useSettings();
  const { showToast } = useToast();

  // Fetch models from OpenRouter API
  const fetchModels = useCallback(async (): Promise<AIModel[]> => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.apiKey && { 'Authorization': `Bearer ${settings.apiKey}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch models');
      }

      const data = await response.json();
      
      // Transform the API response to our AIModel interface
      return data.data.map((model: any) => ({
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
        tags: processTags(model),
        isFree: isFreeModel(model),
        isFiltered: isFilteredModel(model),
        isRecommended: model.featured || false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch models';
      showToast(message, 'error');
      console.error('Error fetching models:', error);
      return [];
    }
  }, [settings.apiKey, showToast]);

  return { fetchModels };
};

// Helper functions to process model data

// Process tags from model data
function processTags(model: any): string[] {
  const tags: string[] = [];
  
  // Add provider as a tag
  if (model.provider?.name) {
    tags.push(model.provider.name);
  }
  
  // Add "Free" tag if applicable
  if (isFreeModel(model)) {
    tags.push('Free');
  }
  
  // Add "Unfiltered" tag if applicable
  if (!isFilteredModel(model)) {
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
function isFreeModel(model: any): boolean {
  return (
    !model.pricing ||
    (model.pricing.prompt === 0 && model.pricing.completion === 0)
  );
}

// Check if a model is filtered/moderated
function isFilteredModel(model: any): boolean {
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
