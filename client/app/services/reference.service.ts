import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ReferenceService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getReferences(): Observable<any> {
    return this.http.get('/api/references').map(res => res.json());
  }

  countReferences(): Observable<any> {
    return this.http.get('/api/references/count').map(res => res.json());
  }

  addReference(reference): Observable<any> {
    return this.http.post('/api/reference', JSON.stringify(reference), this.options);
  }

  getReference(reference): Observable<any> {
    return this.http.get(`/api/reference/${reference._id}`).map(res => res.json());
  }

  editReference(reference): Observable<any> {
    return this.http.put(`/api/reference/${reference._id}`, JSON.stringify(reference), this.options);
  }

  deleteReference(reference): Observable<any> {
    return this.http.delete(`/api/reference/${reference._id}`, this.options);
  }

}
