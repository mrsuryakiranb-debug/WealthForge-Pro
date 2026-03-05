import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_ENDPOINTS = ['/auth/login', '/api/auth/login', '/auth/register', '/api/auth/register'];

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldSkip = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));
  if (shouldSkip) {
    return next(req);
  }

  const token = localStorage.getItem('wf_token');
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
