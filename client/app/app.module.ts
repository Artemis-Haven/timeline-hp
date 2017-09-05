import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { ReferenceService } from './services/reference.service';
import { GameService } from './services/game.service';
import { CardService } from './services/card.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { ReferenceComponent } from './reference/reference.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { CardComponent } from './game/card.component';
import { OpponentComponent } from './game/opponent.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { BrowserModule } from '@angular/platform-browser';
import { DndModule } from 'ng2-dnd';

const config: SocketIoConfig = { url: 'http://localhost:8090', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ReferenceComponent,
    GamesComponent,
    GameComponent,
    CardComponent,
    OpponentComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    BrowserModule,
    SocketIoModule.forRoot(config),
    DndModule.forRoot() 
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    ReferenceService,
    GameService,
    CardService,
    UserService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
