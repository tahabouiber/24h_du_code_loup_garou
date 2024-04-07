import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

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

  // Méthode pour démarrer le jeu
  startGame() {
    this.router.navigate(['/game']); // Rediriger vers la page 'game'
  }
}