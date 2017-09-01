import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { GameService } from '../services/game.service';
import { CardService } from '../services/card.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['../cats/cats.component.scss'],
  providers: [GameService]
})
export class GameComponent implements OnInit {

  game = {_id: null};
  isLoading = false;

  constructor(private gameService: GameService,
              private http: Http,
              public toast: ToastComponent,
              public auth: AuthService,
              private route: ActivatedRoute,
              private socket: Socket) 
  {
    var that = this;
    // get URL parameters
    this.route.params.subscribe(params => { this.game._id = params.id; });
    this.getGame();
    this.socket.on('game-updated-'+this.game._id, function() { that.getGame(); });
    this.socket.on('notification', function(data) { that.toast.setMessage(data.message, data.level); });
    this.socket.emit('initSocket', {id: this.auth.currentUser._id});
  }

  ngOnInit() {
    this.getGame();
  }

  getGame() {
    this.gameService.getGame(this.game).subscribe(
      data => this.game = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  drawCard(game) {
    var user = this.auth.currentUser;
    this.gameService.drawCard(game, this.auth.currentUser).subscribe(
      res => {
        this.game = game;
        this.toast.setMessage('new card', 'success');
      },
      error => console.log(error)
    );
  }

  start(game) {
    this.gameService.start(game).subscribe(
      res => {
        this.game = game;
      },
      error => console.log(error)
    );
  }


}