export type ReleaseChannel = 'production' | 'staging' | 'preview' | 'development';

export interface BuildMetadata {
  version: string;
  buildTimestamp: string;
  commitHash: string;
  buildChannel: ReleaseChannel;
  releaseNotes: {
    version: string;
    date: string;
    summary: string;
    changes: string[];
    security: string[];
  };
}

export interface EnvKeyValidation {
  key: string;
  exists: boolean;
  isRequired: boolean;
  description: string;
}

export interface EnvValidationResult {
  isValid: boolean;
  results: EnvKeyValidation[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warn';
  description: string;
  category: 'build' | 'environment' | 'pwa' | 'security';
}

export interface ChecklistSummary {
  score: number; // percentage of passed checks
  passedCount: number;
  totalCount: number;
  items: ChecklistItem[];
}
