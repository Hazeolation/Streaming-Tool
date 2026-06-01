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
  /**
   * Injects the `BroadcastStateService` to manage and access the current broadcast state throughout the main layout component. This service is responsible for providing the necessary data and functionality to handle the broadcast state, allowing child components within the main layout to access and react to changes in the broadcast state as needed. By injecting the service at this level, it ensures that all components within the main layout have a consistent and centralized source of truth for the broadcast state, facilitating better state management and data flow across the application.
   */
  private readonly stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Initializes the main layout component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to be accessed by child components when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }
}
