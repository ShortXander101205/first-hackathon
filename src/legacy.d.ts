import '@/types/career';
import '@/types/api';

declare module '@/types/career' {
  export interface TriageSummary {
    student_archetype: string;
    triage_narrative: string;
  }
  export interface TriageGenerationMeta {
    engine: string;
    generation_latency_ms: number;
    fallback_used: boolean;
  }
  export interface TriageResult {
    summary: TriageSummary;
    careers: [
      import('@/types/career').PathwayCard,
      import('@/types/career').PathwayCard,
      import('@/types/career').PathwayCard,
      import('@/types/career').PathwayCard
    ];
  }
}

declare module '@/types/api' {
  export interface TriageSuccessResponse {
    success: true;
    summary: import('@/types/career').TriageSummary;
    careers: [
      import('@/types/career').PathwayCard,
      import('@/types/career').PathwayCard,
      import('@/types/career').PathwayCard,
      import('@/types/career').PathwayCard
    ];
    meta: import('@/types/career').TriageGenerationMeta;
  }
  export interface TriageRequestBody {
    answers: any;
    studentNickname?: string;
  }
  export type TriageApiResponse = TriageSuccessResponse | import('@/types/api').ProblemDetails;
}
