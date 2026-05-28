import { Component, inject } from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  state = inject(BroadcastStateService).state;
}
