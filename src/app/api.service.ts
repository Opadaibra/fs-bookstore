import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api';
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {
  }



  // GET request
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, httpOptions)
      .pipe(
        retry(1),
        timeout(30000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  // POST request
  post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, httpOptions)
      .pipe(
        timeout(30000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  // PUT request
  put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, data, httpOptions)
      .pipe(
        timeout(30000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  // PATCH request
  update<T>(endpoint: string, data: any, id: string | number, options?: HttpOptions): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    
    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}/${id}/`, data, httpOptions)
      .pipe(
        timeout(30000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  // DELETE request
  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, httpOptions)
      .pipe(
        timeout(30000), // 30 seconds timeout
        catchError(this.handleError)
      );
  }

  // Helper method to get HTTP options
  private getHttpOptions(options?: HttpOptions): HttpOptions {
    return {
      ...options,
      headers: this.headers,
      withCredentials: options?.withCredentials ?? false // Make withCredentials configurable
    };
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Handle specific error codes
      switch (error.status) {
        case 401:
          // Unauthorized - token expired or invalid
          // You could trigger a logout or token refresh here
          break;
        case 403:
          // Forbidden - user doesn't have permission
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
