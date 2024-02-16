export interface IResponse<T> {
  status: 'error' | 'success';
  data?: T;
  errorMessage?: string;
}
