import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Interceptors = [
  { useClass: TokenInterceptor, provide: HTTP_INTERCEPTORS, multi: true }
];
