import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);

      if (error.status === 400) {
        alert('Validation error');
      } else if (error.status === 404) {
        alert('Resource not found');
      } else if (error.status === 500) {
        alert('Server error');
      }

      return throwError(() => error);
    })
  );
};