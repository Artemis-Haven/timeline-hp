import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CardService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getCards(): Observable<any> {
    return this.http.get('/api/cards').map(res => res.json());
  }

  countCards(): Observable<any> {
    return this.http.get('/api/cards/count').map(res => res.json());
  }

  addCard(card): Observable<any> {
    return this.http.post('/api/card', JSON.stringify(card), this.options);
  }

  getCard(card): Observable<any> {
    return this.http.get(`/api/card/${card._id}`).map(res => res.json());
  }

  editCard(card): Observable<any> {
    return this.http.put(`/api/card/${card._id}`, JSON.stringify(card), this.options);
  }

  deleteCard(card): Observable<any> {
    return this.http.delete(`/api/card/${card._id}`, this.options);
  }

}
