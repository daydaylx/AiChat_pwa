import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AIModel, SortDirection, SortField } from '../types';
import { useModelService } from '../hooks/useModelService';

interface ModelsState {
  models: AIModel[];
  filteredModels: AIModel[];
  selectedModel: AIModel | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    isFree: boolean;
    isUnfiltered: boolean;
    searchQuery: string;
    tags: string[];
  };
  sort: {
    field: SortField;
    direction: SortDirection;
  };
}

type ModelsAction =
  | { type: 'FETCH_MODELS_START' }
  | { type: 'FETCH_MODELS_SUCCESS'; payload: AIModel[] }
  | { type: 'FETCH_MODELS_FAILURE'; payload: string }
  | { type: 'SET_SELECTED_MODEL'; payload: AIModel | string | null }
  | { type: 'SET_FILTER'; payload: { key: keyof ModelsState['filters']; value: any } }
  | { type: 'TOGGLE_FILTER'; payload: keyof ModelsState['filters'] }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_SORT'; payload: { field: SortField; direction: SortDirection } };

interface ModelsContextType {
  state: ModelsState;
  fetchModels: () => Promise<void>;
  selectModel: (model: AIModel | string) => void;
  setFilter: (key: keyof ModelsState['filters'], value: any) => void;
  toggleFilter: (key: keyof ModelsState['filters']) => void;
  resetFilters: () => void;
  setSort: (field: SortField, direction: SortDirection) => void;
}

const initialState: ModelsState = {
  models: [],
  filteredModels: [],
  selectedModel: null,
  isLoading: false,
  error: null,
  filters: {
    isFree: false,
    isUnfiltered: false,
    searchQuery: '',
    tags: [],
  },
  sort: {
    field: 'name',
    direction: 'asc',
  },
};

function modelsReducer(state: ModelsState, action: ModelsAction): ModelsState {
  switch (action.type) {
    case 'FETCH_MODELS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'FETCH_MODELS_SUCCESS': {
      const models = action.payload;
      const filteredModels = applyFiltersAndSort(
        models,
        state.filters,
        state.sort
      );
      
      // Try to keep the same selected model if it exists in the new model list
      let selectedModel = state.selectedModel;
      if (selectedModel) {
        const modelStillExists = models.some(m => m.id === selectedModel?.id);
        if (!modelStillExists) {
          selectedModel = models.length > 0 ? models[0] : null;
        }
      } else {
        // Select the first model if none is selected
        selectedModel = models.length > 0 ? models[0] : null;
      }
      
      return {
        ...state,
        models,
        filteredModels,
        selectedModel,
        isLoading: false,
      };
    }
    
    case 'FETCH_MODELS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      
    case 'SET_SELECTED_MODEL': {
      const payload = action.payload;
      
      // If payload is a string (model ID), find the corresponding model
      if (typeof payload === 'string') {
        const model = state.models.find(m => m.id === payload) || null;
        return {
          ...state,
          selectedModel: model,
        };
      }
      
      // Otherwise, payload is already a model or null
      return {
        ...state,
        selectedModel: payload,
      };
    }
    
    case 'SET_FILTER': {
      const { key, value } = action.payload;
      const newFilters = {
        ...state.filters,
        [key]: value,
      };
      
      return {
        ...state,
        filters: newFilters,
        filteredModels: applyFiltersAndSort(
          state.models,
          newFilters,
          state.sort
        ),
      };
    }
    
    case 'TOGGLE_FILTER': {
      const key = action.payload;
      // Only toggle boolean filters
      if (typeof state.filters[key] !== 'boolean') {
        return state;
      }
      
      const newFilters = {
        ...state.filters,
        [key]: !state.filters[key as keyof typeof state.filters],
      };
      
      return {
        ...state,
        filters: newFilters,
        filteredModels: applyFiltersAndSort(
          state.models,
          newFilters,
          state.sort
        ),
      };
    }
    
    case 'RESET_FILTERS': {
      const newFilters = {
        isFree: false,
        isUnfiltered: false,
        searchQuery: '',
        tags: [],
      };
      
      return {
        ...state,
        filters: newFilters,
        filteredModels: applyFiltersAndSort(
          state.models,
          newFilters,
          state.sort
        ),
      };
    }
    
    case 'SET_SORT': {
      const newSort = action.payload;
      
      return {
        ...state,
        sort: newSort,
        filteredModels: applyFiltersAndSort(
          state.models,
          state.filters,
          newSort
        ),
      };
    }
    
    default:
      return state;
  }
}

// Helper function to apply filters and sorting to models
function applyFiltersAndSort(
  models: AIModel[],
  filters: ModelsState['filters'],
  sort: ModelsState['sort']
): AIModel[] {
  // Apply filters
  let result = [...models];
  
  if (filters.isFree) {
    result = result.filter(model => model.isFree);
  }
  
  if (filters.isUnfiltered) {
    result = result.filter(model => !model.isFiltered);
  }
  
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(
      model =>
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.provider.toLowerCase().includes(query)
    );
  }
  
  if (filters.tags.length > 0) {
    result = result.filter(model =>
      filters.tags.some(tag => model.tags.includes(tag))
    );
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
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
    
    return sort.direction === 'asc' ? comparison : -comparison;
  });
  
  return result;
}

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

export const ModelsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(modelsReducer, initialState);
  const { fetchModels: apiFetchModels } = useModelService();
  
  // Fetch models on mount
  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fetch models from API
  const fetchModels = async () => {
    dispatch({ type: 'FETCH_MODELS_START' });
    
    try {
      const models = await apiFetchModels();
      
      // Filter out premium models (like Claude/GPT/Anthropic) as requested
      const filteredModels = models.filter(model => 
        !model.id.includes('claude') && 
        !model.id.includes('gpt') && 
        !model.id.includes('anthropic') &&
        !model.id.includes('mistral-medium') &&
        !model.id.includes('mistral-large')
      );
      
      dispatch({ type: 'FETCH_MODELS_SUCCESS', payload: filteredModels });
    } catch (error) {
      dispatch({
        type: 'FETCH_MODELS_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to fetch models',
      });
    }
  };
  
  const selectModel = (model: AIModel | string) => {
    dispatch({ type: 'SET_SELECTED_MODEL', payload: model });
  };
  
  const setFilter = (key: keyof ModelsState['filters'], value: any) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };
  
  const toggleFilter = (key: keyof ModelsState['filters']) => {
    dispatch({ type: 'TOGGLE_FILTER', payload: key });
  };
  
  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };
  
  const setSort = (field: SortField, direction: SortDirection) => {
    dispatch({
      type: 'SET_SORT',
      payload: { field, direction },
    });
  };
  
  return (
    <ModelsContext.Provider
      value={{
        state,
        fetchModels,
        selectModel,
        setFilter,
        toggleFilter,
        resetFilters,
        setSort,
      }}
    >
      {children}
    </ModelsContext.Provider>
  );
};

export const useModels = (): ModelsContextType => {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error('useModels must be used within a ModelsProvider');
  }
  return context;
};
