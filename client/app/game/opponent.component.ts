import {Component, Input} from '@angular/core';

@Component({
	selector: 'opponent',
	template: `
	<h3>{{user.username}}</h3>
  	<ng-container *ngFor="let card of cards">
		<ng-container *ngIf="card.user == user._id">
			<card [card]=card></card>
		</ng-container>
	</ng-container>`,
	styleUrls: ['../game/game.component.scss'],
})

export class OpponentComponent {
	@Input() public user: any = "";
	@Input() public cards: Array<any> = [];

	constructor () {
		
	}
}
