import React, { useState, useEffect } from 'react';
import { AIModel, SortDirection, SortField } from '../../types';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel | null;
  onSelectModel: (model: AIModel) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

/**
 * ModelSelector component for displaying and selecting AI models
 * Features filtering, sorting, and model cards with details
 * 
 * @param models - Array of available models
 * @param selectedModel - Currently selected model
 * @param onSelectModel - Callback for when a model is selected
 * @param isLoading - Whether models are being loaded
 * @param onRefresh - Callback to refresh the models list
 * @param className - Additional class names
 */
export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  isLoading = false,
  onRefresh,
  className = '',
}) => {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showUnfilteredOnly, setShowUnfilteredOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filteredModels, setFilteredModels] = useState<AIModel[]>(models);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let result = [...models];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        model =>
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply free only filter
    if (showFreeOnly) {
      result = result.filter(model => model.isFree);
    }
    
    // Apply unfiltered only filter
    if (showUnfilteredOnly) {
      result = result.filter(model => !model.isFiltered);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'provider':
          comparison = a.provider.localeCompare(b.provider);
          break;
        case 'contextLength':
          comparison = a.contextLength - b.contextLength;
          break;
        case 'isFree':
          comparison = (a.isFree === b.isFree) ? 0 : a.isFree ? -1 : 1;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredModels(result);
  }, [models, searchQuery, showFreeOnly, showUnfilteredOnly, sortField, sortDirection]);

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle model details expansion
  const toggleModelDetails = (modelId: string) => {
    setExpandedModelId(prev => (prev === modelId ? null : modelId));
  };

  // Calculate pricing display
  const formatPrice = (model: AIModel) => {
    if (!model.pricing) return 'Free';
    
    const inputPrice = model.pricing.input * 1000000; // per 1M tokens
    const outputPrice = model.pricing.output * 1000000;
    
    if (inputPrice === 0 && outputPrice === 0) return 'Free';
    
    return `$${inputPrice.toFixed(2)}/$${outputPrice.toFixed(2)} per 1M tokens`;
  };

  return (
    <div className={`model-selector ${className}`}>
      {/* Filters and search */}
      <div className="mb-4 space-y-3">
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftElement={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          rightElement={
            searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null
          }
        />

        <div className="flex flex-wrap gap-4">
          <Toggle
            isChecked={showFreeOnly}
            onChange={setShowFreeOnly}
            label="Free models only"
          />
          
          <Toggle
            isChecked={showUnfilteredOnly}
            onChange={setShowUnfilteredOnly}
            label="Unfiltered models only"
          />
          
          {onRefresh && (
            <Button
              variant="neutral"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="ml-auto"
            >
              {isLoading ? (
                <span className="loader loader-sm mr-2" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </Button>
          )}
        </div>
        
        {/* Sort controls */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-neutral-500">Sort by:</span>
          {(['name', 'provider', 'contextLength', 'isFree'] as SortField[]).map((field) => (
            <Button
              key={field}
              variant="ghost"
              size="sm"
              onClick={() => handleSort(field)}
              className={sortField === field ? 'font-semibold' : ''}
            >
              {field === 'name' ? 'Name' : 
               field === 'provider' ? 'Provider' : 
               field === 'contextLength' ? 'Context' : 
               'Price'}
              
              {sortField === field && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Models list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loader loader-lg" />
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No models match your filters. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model) => (
            <Card
              key={model.id}
              className={`model-card transition-shadow hover:shadow-lg cursor-pointer ${
                selectedModel?.id === model.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => onSelectModel(model)}
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{model.name}</h3>
                  <div className="text-sm text-neutral-500 mb-2">{model.provider}</div>
                </div>
                
                {/* Model tags */}
                <div className="flex flex-wrap gap-1 justify-end">
                  {model.isFree && (
                    <Badge variant="success">Free</Badge>
                  )}
                  
                  {!model.isFiltered && (
                    <Badge variant="warning">Unfiltered</Badge>
                  )}
                  
                  {model.isRecommended && (
                    <Badge variant="primary">Recommended</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardBody>
                {/* Short description */}
                <p className="text-sm mb-3 line-clamp-2">
                  {model.description || 'No description available.'}
                </p>
                
                {/* Context length & pricing */}
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  <div className="flex justify-between">
                    <span>Context:</span>
                    <span>{model.contextLength.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pricing:</span>
                    <span>{formatPrice(model)}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {model.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Details toggle */}
                <div className="mt-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModelDetails(model.id);
                    }}
                  >
                    {expandedModelId === model.id ? 'Hide details' : 'Show details'}
                  </Button>
                </div>
                
                {/* Expanded details */}
                {expandedModelId === model.id && (
                  <div className="mt-3 text-sm border-t pt-3 border-neutral-200 dark:border-neutral-700">
                    <p className="mb-2">{model.description}</p>
                    
                    <div className="space-y-1">
                      <div><strong>ID:</strong> {model.id}</div>
                      <div><strong>Max tokens:</strong> {model.maxTokens.toLocaleString()}</div>
                      <div><strong>Provider:</strong> {model.provider}</div>
                      <div>
                        <strong>Pricing:</strong>
                        <div className="ml-2">
                          <div>Input: {model.pricing ? `$${(model.pricing.input * 1000000).toFixed(6)} per 1M tokens` : 'Free'}</div>
                          <div>Output: {model.pricing ? `$${(model.pricing.output * 1000000).toFixed(6)} per 1M tokens` : 'Free'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
