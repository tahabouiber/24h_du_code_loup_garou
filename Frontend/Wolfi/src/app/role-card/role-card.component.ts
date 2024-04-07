import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss'],
})
export class RoleCardComponent implements OnInit {
  @Input() role: any; // Propriété d'entrée pour le rôle
  @Input() nightMode: boolean =false;
  // Position de la carte de rôle
  topPosition: number = 0;
  leftPosition: number = 0;

  constructor(private elRef: ElementRef) {}

  ngOnInit() {}
}