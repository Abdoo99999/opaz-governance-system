// src/types/assessment.ts

export interface Indicator {
    id: string;
    name: string;
    description?: string;
    weight: number;
    maxScore: number;
    targetDescription?: string;
  }
  
  export interface AssessmentCategory {
    id: string;
    title: string;
    totalWeight: number;
    indicators: Indicator[];
  }
  
  export interface ZoneScore {
    indicatorId: string;
    score: number;
    justification?: string;
  }