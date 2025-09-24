export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: string;
}

export enum AppTab {
  Calculator = 'calculator',
  Graph = 'graph',
  Matrix = 'matrix',
  Statistics = 'statistics',
  EquationSolver = 'equationSolver',
  UnitConverter = 'unitConverter',
  PercentageCalculator = 'percentageCalculator',
  BaseConverter = 'baseConverter',
  Financial = 'financial',
  Date = 'date',
  History = 'history',
  About = 'about',
}

export interface Explanation {
    functionName: string;
    formula: string;
    description: string;
    example: string;
}