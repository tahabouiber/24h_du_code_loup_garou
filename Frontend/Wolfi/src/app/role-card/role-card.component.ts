import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss'],
})
export class RoleCardComponent implements OnInit {
  @Input() role: any; // Propriété d'entrée pour le rôle

  constructor() {}

  ngOnInit() {}

  startAnimation() {
    // Ajoutez votre logique pour l'animation de survol
  }

  stopAnimation() {
    // Ajoutez votre logique pour arrêter l'animation de survol
  }
}
