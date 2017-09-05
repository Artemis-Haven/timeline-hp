import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GameService } from '../services/game.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  providers: [GameService]
})
export class GamesComponent implements OnInit {

  game = {};
  games = [];
  isLoading = false;
  isEditing = false;

  addGameForm: FormGroup;
  name = new FormControl('', Validators.required);

  constructor(private gameService: GameService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent,
              public auth: AuthService,
              private socket: Socket) 
  {
    var that = this;
    this.socket.on('games-updated', function() { that.getGames(); });
    this.socket.on('notification', function(data) { that.toast.setMessage(data.message, data.level); });
    this.socket.emit('initSocket', {id: this.auth.currentUser._id});
  }

  ngOnInit() {
    this.getGames();
    this.addGameForm = this.formBuilder.group({
      name: this.name
    });
  }

  getGames() {
    this.gameService.getGames().subscribe(
      data => this.games = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addGame() {
    this.gameService.addGame(this.addGameForm.value, this.auth.currentUser).subscribe(
      res => {
        const newGame = res.json();
        this.games.push(newGame);
        this.addGameForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
        this.socket.emit('joinedGame', {id: newGame._id});
      },
      error => console.log(error)
    );
  }

  joinGame(game) {
    game.users.push(this.auth.currentUser);
    this.gameService.joinGame(game, this.auth.currentUser).subscribe(
      res => {
        this.game = game;
        this.toast.setMessage('you joined successfully.', 'success');
        this.socket.emit('joinedGame', {id: game._id});
      },
      error => console.log(error)
    );
  }

  quitGame(game) {
    if (this.hasJoined(this.auth.currentUser, game)) {
      if (game.users.length == 1) {
        this.deleteGame(game);
        this.socket.emit('leavedGame', {id: game._id});
      } else {
        game.users.splice(game.users.map(user => user._id).indexOf(this.auth.currentUser._id), 1);
        this.gameService.quitGame(game, this.auth.currentUser).subscribe(
          res => {
            this.game = game;
            this.toast.setMessage('you quitted successfully.', 'info');
            this.socket.emit('leavedGame', {id: game._id});
          },
          error => console.log(error)
        );
      }
    } else {
      this.toast.setMessage("you don't own this game.", 'error');
    }
  }

  hasJoined(user, game) {
    return game.users.map(user => user._id).indexOf(user._id) !== -1;
  }

  isDeletable(game) {
    return this.hasJoined(this.auth.currentUser, game) && !game.started && (game.users.length == 1);
  }

  enableEditing(game) {
    this.isEditing = true;
    this.game = game;
  }

  cancelEditing() {
    this.isEditing = false;
    this.game = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the games to reset the editing
    this.getGames();
  }

  editGame(game) {
    this.gameService.editGame(game).subscribe(
      res => {
        this.isEditing = false;
        this.game = game;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteGame(game) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      game.users.splice(game.users.indexOf(this.auth.currentUser), 1);
      this.gameService.deleteGame(game).subscribe(
        res => {
          const pos = this.games.map(elem => elem._id).indexOf(game._id);
          this.games.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
