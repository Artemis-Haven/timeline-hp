import {Component, Input} from '@angular/core';

@Component({
	selector: 'card',
	template: `
	<div class="card" dnd-draggable [dragEnabled]="true">
		<div class="card-name">{{card.name}}</div>
		<div class="card-date">{{card.displayedDate}}</div>
	</div>`
})

export class CardComponent {
	@Input() public card: any;

	constructor () {
		
	}
}
