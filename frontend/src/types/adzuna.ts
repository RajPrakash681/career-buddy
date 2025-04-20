export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  created: string;
  location: {
    area: string[];
    display_name: string;
  };
  salary_min?: number;
  salary_max?: number;
  company: {
    display_name: string;
  };
  category: {
    label: string;
    tag: string;
  };
  contract_type: string;
  redirect_url: string;
}

export interface AdzunaResponse {
  count: number;
  mean: number;
  results: AdzunaJob[];
}