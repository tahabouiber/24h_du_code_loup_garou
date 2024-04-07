import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
export class GamePage implements OnInit {
  selectedRole: any;
  nightDuration: number = 5; // 5 seconds for night
  dayDuration: number = 12; // 120 seconds for day
  timeLeft: number = 0; // Current timer
  nightMode: boolean = true; // Night mode is default
  timerInterval: any; // To store the interval
  showToggleButton: boolean = false; // Flag to show toggle button

  players: Player[] = [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' },
    // ajoutez d'autres joueurs selon les besoins
  ];

  roles = [
    { 
      imageUrl: 'https://static.wikia.nocookie.net/loupgaroumal/images/d/d6/Carte_SimpleVillaegois.png/revision/latest/scale-to-width-down/185?cb=20210104170925&path-prefix=fr',
      name: 'Villageois',
      description: 'Le villageois est un personnage qui incarne l habitant basique d un village. Son rôle est de découvrir l identité des loups-garous et de les éliminer avant qu ils ne tuent tous les villageois. Il gagne lors ce que tous les loups garous sont morts. Le villageois n a aucun pouvoir spécial, si ce n est de voter au conseil du village contre celui qu il suspecte être loup garou.'
    },
    { 
      imageUrl: 'https://static.wikia.nocookie.net/loupgaroumal/images/1/1e/Carte2.png/revision/latest/scale-to-width-down/185?cb=20210104171045&path-prefix=fr',
      name: 'Loup-Garou',
      description: 'Le loup-garou incarne l un des rôles de l équipe des loups-garous. Il connaît l identité des autres loups-garous et doit essayer de tuer tous les villageois sans se faire découvrir. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime. Il gagne si tout le village est éliminé.'
    },
  ];

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  async openVotePopup() {
    const inputs = this.players.map((player) => ({
      name: `player${player.id}`,
      type: 'radio' as const,
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const roleName = params['role']; // Récupérer le rôle à partir des paramètres de requête
      this.selectedRole = this.roles.find(role => role.name.toLowerCase() === roleName);
    });

    // Commencer par la nuit
    this.startNightTimer();
  }

  startNightTimer() {
    this.nightMode = true;
    this.timeLeft = this.nightDuration;
    this.startTimer();
  }

  startDayTimer() {
    this.nightMode = false;
    this.timeLeft = this.dayDuration;
    this.startTimer();
  }

  startTimer() {
    // Clear any existing timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.showToggleButton = true; // Afficher le bouton de bascule lorsque le temps est écoulé
      }
    }, 1000); // Mettre à jour chaque seconde
  }

  toggleDayNight() {
    this.showToggleButton = false; // Cacher le bouton de bascule
    if (this.nightMode) {
      this.startDayTimer();
    } else {
      this.startNightTimer();
    }
  }

}
