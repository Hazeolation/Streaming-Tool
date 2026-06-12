import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-commentator-box',
  imports: [],
  templateUrl: './commentator-box.html',
  styleUrl: './commentator-box.scss',
})
export class CommentatorBox implements OnInit {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the commentator box component to update its UI accordingly whenever the state changes. This setup enables the commentator box to show the current commentator information based on the latest broadcast state received from the service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the commentator box component to reactively update its UI whenever the broadcast state changes. This signal is used to display the current commentator information in the commentator box, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Computed property that gets the name of all commentators, and turns the text into a singular if only one commentator is added in the input fields
   */
  get commentatorsText(): string {
    const commentator1 = this.state().commentator1;
    const commentator2 = this.state().commentator2;
    if(commentator1.length > 0 && !commentator2) {
      return `Kommentator: ${commentator1}`;
    }

    if(commentator2.length > 0 && !commentator1) {
      return `Kommentator: ${commentator2}`;
    }

    return `Kommentatoren: ${commentator1}, ${commentator2}`;
  }

  /**
   * Initializes the commentator box component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }
}
