export interface IEndpoint {
  api: string;
  endpoints: Record<string, string>;
}

export const ENDPOINTS: Record<string, IEndpoint> = {};
