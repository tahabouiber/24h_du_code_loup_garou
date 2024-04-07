import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

// Définition de l'interface Player
interface Player {
  id: number;
  name: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})



export class GamePage {

    timeLeft: number = 30; // Temps de discussion initial
    timeOfDay: string = 'day'; // 'day' pour jour, 'night' pour nuit

  players: Player[] = [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' },
    // ajoutez d'autres joueurs selon les besoins
  ];

  constructor(public alertController: AlertController) {}

  async openVotePopup() {
    const inputs = this.players.map((player) => ({
      name: `player${player.id}`,
      type: 'radio' as const, // Correction ici
      label: player.name,
      value: player.id,
      checked: false,
    }));

    const alert = await this.alertController.create({
      header: 'Votez pour éliminer un joueur',
      inputs: inputs,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmation Annuler');
          },
        },
        {
          text: 'Confirmer',
          handler: (playerId) => {
            console.log('Voté pour:', playerId);
            // Implémentez la logique de vote ici
          },
        },
      ],
    });

    await alert.present();
  }
}
