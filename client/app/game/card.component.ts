import {Component, Input} from '@angular/core';

@Component({
	selector: 'card',
	template: `
	<div class="card" dnd-draggable [dragEnabled]="true" [dragData]="card" [attr.data-id]="card._id">
		<div class="card-name">{{card.name}}</div>
		<div class="card-date">{{card.displayedDate}}</div>
	</div>`
})

export class CardComponent {
	@Input() public card: any;
    receivedData: Array<any> = [];

    transferDataSuccess($event: any) {
        this.receivedData.push($event);
    }

	constructor () {
		
	}
}
