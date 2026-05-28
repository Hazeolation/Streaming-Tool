import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, Topbar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private readonly stateService = inject(BroadcastStateService);

  ngOnInit() {
    this.stateService.loadInitialState();
  }
}
