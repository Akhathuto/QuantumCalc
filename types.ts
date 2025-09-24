
export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: string;
}

export interface Explanation {
  functionName: string;
  formula: string;
  description: string;
  example: string;
}

export type AppTab =
  | 'calculator'
  | 'graphing'
  | 'matrix'
  | 'statistics'
  | 'equations'
  | 'units'
  | 'currency'
  | 'percentage'
  | 'base'
  | 'financial'
  | 'date'
  | 'health'
  | 'history'
  | 'about';
