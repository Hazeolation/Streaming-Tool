import { Component, inject, NgZone, OnInit, WritableSignal } from '@angular/core';
import { CommentatorBox } from '../commentator-box/commentator-box';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { NgClass } from '@angular/common';
import { TeamNameSwitchingService } from '../../services/team-name-switching';

@Component({
  selector: 'app-map-screen-display',
  imports: [CommentatorBox, NgClass],
  templateUrl: './map-screen-display.html',
  styleUrl: './map-screen-display.scss',
})
export class MapScreenDisplay implements OnInit {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the score box component to update its UI accordingly whenever the state changes. This setup enables the score box to display the current team names and scores based on the latest broadcast state received from the service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Injects `NgZone` to run DOM manipulations outside of Angular's change detection zone.
   * This prevents ExpressionChangedAfterItHasBeenCheckedError when updating CSS properties.
   */
  ngZone: NgZone = inject(NgZone);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the map screen display component to reactively update its UI whenever the broadcast state changes. This signal is used to display the current map information in the map screen display, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Service for switching the team names around if `state().alphaIsLeft` changes from `true` to `false`, or vice versa
   */
  teamNameSwitchingService: TeamNameSwitchingService = inject(TeamNameSwitchingService);

  /**
   * Sets the color for the winner logo depending on which team won, and if the alpha is team is on the left or not.
   * @param {'alpha' | 'bravo'} winner - Winner team, either `alpha` or `bravo`
   * @returns {'team-alpha-color' | 'team-bravo-color'}
   */
  setWinnerLogoColor(winner: 'alpha' | 'bravo'): string {
    if (
      (winner === 'alpha' && this.state().alphaIsLeft) ||
      (winner === 'bravo' && !this.state().alphaIsLeft)
    ) {
      return 'team-alpha-color';
    }

    return 'team-bravo-color';
  }

  /**
   * Initializes the map screen display component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }
}
