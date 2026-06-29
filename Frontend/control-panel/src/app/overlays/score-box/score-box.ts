import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBox } from '../commentator-box/commentator-box';
import { TeamNameSwitchingService } from '../../services/team-name-switching';
import { ResizableText } from '../../features/resizable-text/resizable-text';

@Component({
  selector: 'app-score-box',
  imports: [CommentatorBox, ResizableText],
  templateUrl: './score-box.html',
  styleUrl: './score-box.scss',
})
export class ScoreBox implements OnInit {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the score box component to update its UI accordingly whenever the state changes. This setup enables the score box to display the current team names and scores based on the latest broadcast state received from the service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the score box component to reactively update its UI whenever the broadcast state changes. This signal is used to display the team names and scores in the score box, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Service for switching the team names around if `state().alphaIsLeft` changes from `true` to `false`, or vice versa
   */
  teamNameSwitchingService: TeamNameSwitchingService = inject(TeamNameSwitchingService);

  /**
   * Initializes the score box component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }
}
