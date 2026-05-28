import { Component, inject, OnInit } from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-infobox-display',
  imports: [],
  templateUrl: './infobox-display.html',
  styleUrl: './infobox-display.scss',
})
export class InfoboxDisplay implements OnInit {
  stateService = inject(BroadcastStateService);

  state = this.stateService.state;

  ngOnInit() {
    this.stateService.loadInitialState();
  }
}
