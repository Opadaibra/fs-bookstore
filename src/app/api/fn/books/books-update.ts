/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { Book } from '../../services/models/book';


export interface BooksUpdate$Params {

/**
 * A unique integer value identifying this book.
 */
  id: any;
  data: Book;
}

export function booksUpdate(http: HttpClient, rootUrl: string, params: BooksUpdate$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, booksUpdate.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {});
    rb.body('data', params.data, {});
  }

  return http.request(
    rb.build({ responseType: 'text', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

booksUpdate.PATH = '/books/{id}/';
