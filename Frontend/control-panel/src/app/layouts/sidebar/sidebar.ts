import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  stateService = inject(BroadcastStateService);
  state = this.stateService.state;
}