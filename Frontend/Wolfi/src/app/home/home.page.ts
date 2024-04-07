import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private alertController: AlertController) {}

  roles = [
    { 
      imageUrl: 'https://i.imgur.com/R9YJymr.png',
      name: 'Villageois',
      description: 'Le villageois est un personnage qui incarne l habitant basique d un village. Son rôle est de découvrir l identité des loups-garous et de les éliminer avant qu ils ne tuent tous les villageois. Il gagne lors ce que tous les loups garous sont morts. Le villageois n a aucun pouvoir spécial, si ce n est de voter au conseil du village contre celui qu il suspecte être loup garou.'
    },
    { 
      imageUrl: 'https://i.imgur.com/qklKzwl.png',
      name: 'Loup-Garou',
      description: 'Le loup-garou incarne l un des rôles de l équipe des loups-garous. Il connaît l identité des autres loups-garous et doit essayer de tuer tous les villageois sans se faire découvrir. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime. Il gagne si tout le village est éliminé.'
    },
  ];

  async startGame() {
    const alert = await this.alertController.create({
      header: 'Choisissez un rôle',
      inputs: this.roles.map(role => ({
        name: 'role',
        type: 'radio',
        label: role.name,
        value: role.name.toLowerCase(),
        checked: false
      })),
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: (data: string) => {
            const selectedRole = this.roles.find(role => role.name.toLowerCase() === data);
            if (selectedRole) {
              this.router.navigate(['/game'], { queryParams: { role: selectedRole.name.toLowerCase() } });
            }
          }
        }
      ]
    });

    await alert.present();
  }
}