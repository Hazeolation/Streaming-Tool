import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { MapCard } from '../../features/map-card/map-card';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, MapCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stateService = inject(BroadcastStateService);
  state = this.stateService.state;

  addMap() {
    this.stateService.addMap();
  }
}
