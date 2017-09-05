import {Component, Input} from '@angular/core';

@Component({
	selector: 'opponent',
	template: `
	<h4>{{user.username}}</h4>
	<div class="opponentCards">
	  	<ng-container *ngFor="let card of cards">
			<ng-container *ngIf="card.user == user._id">
				<card [card]=card [size]="'small'"></card>
			</ng-container>
		</ng-container>
	</div>`,
	styleUrls: ['../game/game.component.scss'],
})

export class OpponentComponent {
	@Input() public user: any = "";
	@Input() public cards: Array<any> = [];

	constructor () {
		
	}
}
