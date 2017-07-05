import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Socket } from 'ng-socket-io';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GameService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, private socket: Socket) { }

  getGames(): Observable<any> {
    return this.http.get('/api/games').map(res => res.json());
  }

  countGames(): Observable<any> {
    return this.http.get('/api/games/count').map(res => res.json());
  }

  addGame(game, user): Observable<any> {
    return this.http.post('/api/game', JSON.stringify({'game': game, 'user': user}), this.options);
  }

  joinGame(game, user): Observable<any> {
    return this.http.put(`/api/game/join/${game._id}/${user._id}`, {}).map(res => res.json());
  }

  quitGame(game, user): Observable<any> {
    return this.http.put(`/api/game/quit/${game._id}/${user._id}`, {}).map(res => res.json());
  }

  startGame(game): Observable<any> {
    return this.http.put(`/api/game/start/${game._id}`, {}).map(res => res.json());
  }

  getGame(game): Observable<any> {
    return this.http.get(`/api/game/${game._id}`).map(res => res.json());
  }

  editGame(game): Observable<any> {
    return this.http.put(`/api/game/${game._id}`, JSON.stringify(game), this.options);
  }

  deleteGame(game): Observable<any> {
    return this.http.delete(`/api/game/${game._id}`, this.options);
  }


  sendMessage(msg: string){
    //this.socket.emit("message", msg);
  }
  
  getMessage() {
    //return this.socket.fromEvent<any>("message").map( data => data );
  }

}
