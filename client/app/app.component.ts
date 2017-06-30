import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  //title = 'Timeline H.P.';
  title = 'Tutorial';

  constructor(public auth: AuthService) { }

}
