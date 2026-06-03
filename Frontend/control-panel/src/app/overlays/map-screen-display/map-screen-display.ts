import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-map-screen-display',
  imports: [],
  templateUrl: './map-screen-display.html',
  styleUrl: './map-screen-display.scss',
})
export class MapScreenDisplay implements OnInit {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the score box component to update its UI accordingly whenever the state changes. This setup enables the score box to display the current team names and scores based on the latest broadcast state received from the service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the score box component to reactively update its UI whenever the broadcast state changes. This signal is used to display the team names and scores in the score box, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Initializes the score box component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }

  /**
   * Computed property that returns the name of the team on the left side of the score box based on the current broadcast state. It checks the `alphaIsLeft` boolean in the state to determine which team is on the left and returns the appropriate team name accordingly. This allows the score box to dynamically display the correct team names based on the current configuration of the broadcast state.
   */
  get leftTeamName(): string {
    return this.state().alphaIsLeft ? this.state().teamAlphaName : this.state().teamBravoName;
  }

  /**
   * Computed property that returns the name of the team on the right side of the score box based on the current broadcast state. Similar to `leftTeamName`, it checks the `alphaIsLeft` boolean in the state to determine which team is on the right and returns the appropriate team name accordingly. This ensures that the score box accurately reflects the team names based on the current configuration of the broadcast state.
   */
  get rightTeamName(): string {
    return this.state().alphaIsLeft ? this.state().teamBravoName : this.state().teamAlphaName;
  }

  /**
   * Computed property that returns the score of the team on the left side of the score box based on the current broadcast state. It checks the `alphaIsLeft` boolean in the state to determine which team's score should be displayed on the left and returns the appropriate score accordingly. This allows the score box to dynamically display the correct scores based on the current configuration of the broadcast state.
   */
  get leftScore(): number {
    return this.state().alphaIsLeft ? this.state().scoreAlpha : this.state().scoreBravo;
  }

  /**
   * Computed property that returns the score of the team on the right side of the score box based on the current broadcast state. Similar to `leftScore`, it checks the `alphaIsLeft` boolean in the state to determine which team's score should be displayed on the right and returns the appropriate score accordingly. This ensures that the score box accurately reflects the scores based on the current configuration of the broadcast state.
   */
  get rightScore(): number {
    return this.state().alphaIsLeft ? this.state().scoreBravo : this.state().scoreAlpha;
  }
}