export interface BaseResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
