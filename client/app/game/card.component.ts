import {Component, Input} from '@angular/core';

@Component({
	selector: 'card',
	template: `
	<div class="card card-{{size}}" dnd-draggable [dragEnabled]="true" [dragData]="card" [attr.data-id]="card._id">
		<div class="card-name">{{card.name}}</div>
		<div class="card-date">{{card.displayedDate}}</div>
	</div>`,
	styleUrls: ['../game/game.component.scss'],
})

export class CardComponent {
	@Input() public card: any;
	@Input() public size: String;
    receivedData: Array<any> = [];

    transferDataSuccess($event: any) {
        this.receivedData.push($event);
    }

	constructor () {
		this.size = 'normal';
	}
}
