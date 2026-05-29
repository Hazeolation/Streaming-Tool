import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, NgFor],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  stateService = inject(BroadcastStateService);
  state = this.stateService.state;
  availableDivisions = this.stateService.availableDivisions;
}