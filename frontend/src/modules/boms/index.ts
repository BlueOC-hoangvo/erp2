// BOM Module Exports
export * from './api/bom.api';
export * from './hooks/useBoms';
export * from './components/BomList';
export * from './components/BomForm';
export * from './components/BomDetail';
export * from './components/BomExplosion';
export * from './components/BomVersion';
export * from './components/BomTemplates';
export * from './components/BomCostAnalysis';
export * from './components/BomComparison';
export * from './bom.routes';

// Re-export types to avoid duplicate export issues
export type {
  Bom,
  BomLine,
  BomVersion as BomVersionType,
  BomCostAnalysis as BomCostAnalysisType,
  BomExplosionResult
} from './types/bom.types';
