import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { ChatboxComponent } from '../chatbox/chatbox.component'; // Assurez-vous de fournir le chemin correct
import { RoleCardComponent } from '../role-card/role-card.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule
  ],
  declarations: [GamePage, ChatboxComponent, RoleCardComponent]
})
export class GamePageModule {}