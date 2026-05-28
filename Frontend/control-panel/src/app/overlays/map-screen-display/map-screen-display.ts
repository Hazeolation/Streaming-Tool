import { Component, inject, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-map-screen-display',
  imports: [NgIf, NgFor],
  templateUrl: './map-screen-display.html',
  styleUrl: './map-screen-display.scss',
})
export class MapScreenDisplay implements OnInit {
  stateService = inject(BroadcastStateService);

  state = this.stateService.state;

  ngOnInit() {
    this.stateService.loadInitialState();
  }
}