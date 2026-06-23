import {
  Component,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBoxTimeDataService } from '../../services/commentator-box-time-data';
import { CommentatorBoxTimeData } from '../../models/commentator-box-time-data';
import { SocialsService } from '../../services/socials';
import { Socials } from '../../models/socials';

@Component({
  host: {
    '[class.interval-hidden]': 'intervalHidden()',
  },
  selector: 'app-commentator-box',
  imports: [],
  templateUrl: './commentator-box.html',
  styleUrl: './commentator-box.scss',
})
export class CommentatorBox implements OnInit, OnDestroy {
  /**
   * Input on HTML component of `CommentatorBox` that checks if we're on the map screen currently and want periodic hiding/displaying of commentator box, or if we're on any other element where the box is always visible
   */
  @Input() onMapScreen: boolean = false;

  /**
   * Signal that sets the class `interval-hidden` on the host component element and hides our element
   */
  intervalHidden: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the commentator box component to update its UI accordingly whenever the state changes. This setup enables the commentator box to show the current commentator information based on the latest broadcast state received from the service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the commentator box component to reactively update its UI whenever the broadcast state changes. This signal is used to display the current commentator information in the commentator box, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Injects the `CommentatorBoxTimeDataService` to access the display and hide times for the commentator box on the map screen overlay
   */
  // prettier-ignore
  commentatorBoxTimeDataService: CommentatorBoxTimeDataService = inject(CommentatorBoxTimeDataService);

  /**
   * A writable signal the holds the current commentator box time data state. It is initialized by referencing the `commentatorBoxTimeData` signal from the `CommentatorBoxTimeDataService`, allowing the display times for the commentator box to be updated reactively
   */
  commentatorBoxTimeData: WritableSignal<CommentatorBoxTimeData> =
    this.commentatorBoxTimeDataService.commentatorBoxTimeData;

  /**
   * Injects the `SocialsService` to access social links such as discord server invite, twitter handle, etc. The `socials` signal is used to reactively track changes to the socials state to update the overlay accordingly
   */
  socialsService: SocialsService = inject(SocialsService);

  /**
   * A writable signal that holds the current socials state. It is initialized by referencing the `socials` signal from the `SocialsService`, allowing the end screen display component to reactively update its UI whenever the socials state changes.
   */
  socials: WritableSignal<Socials> = this.socialsService.socials;

  /**
   * Timeouts for both timeouts that periodically hide and show our commentator box. Both intervals can be changed via the sidebar, thus needing 2 seperate timeouts
   */
  private hideDisplayTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
  private showDisplayTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  /**
   * Computed property that gets the name of all commentators, and turns the text into a singular if only one commentator is added in the input fields
   */
  get commentatorsText(): string {
    const commentator1 = this.state().commentator1;
    const commentator2 = this.state().commentator2;
    if (commentator1 && !commentator2) {
      return `Kommentator: ${commentator1}`;
    }

    if (commentator2 && !commentator1) {
      return `Kommentator: ${commentator2}`;
    }

    return `Kommentatoren: ${commentator1 || 'Kommentator 1'}, ${commentator2 || 'Kommentator 2'}`;
  }

  /**
   * Effect that checks for changes in the interval values for hiding and showing the display. If one of the values is 0, the display will always be visible
   */
  private commBoxDisplayIntervalEffect = effect(() => {
    clearTimeout(this.hideDisplayTimeout);
    clearTimeout(this.showDisplayTimeout);

    if (
      !this.onMapScreen ||
      this.commentatorBoxTimeData().hideDisplayIntervalInSeconds === 0 ||
      this.commentatorBoxTimeData().showDisplayIntervalInSeconds === 0
    ) {
      this.intervalHidden.set(false);
      return;
    }

    this.intervalHidden.set(true);
    this.setHideDisplayIntervalTimeout();
  });

  /**
   * Function that sets the timeout for when the display will move from it's shown state into it's hidden state by the amount of seconds the user inputs on the dashboard
   */
  private setShowDisplayIntervalTimeout(): void {
    this.hideDisplayTimeout = setTimeout(() => {
      this.intervalHidden.set(true);
      this.setHideDisplayIntervalTimeout();
    }, this.commentatorBoxTimeData().showDisplayIntervalInSeconds * 1000);
  }

  /**
   * Function that sets the timeout for when the display will move from it's hidden state into it's shown state by the amount of seconds the user inputs on the dashboard
   */
  private setHideDisplayIntervalTimeout(): void {
    this.showDisplayTimeout = setTimeout(() => {
      this.intervalHidden.set(false);
      this.setShowDisplayIntervalTimeout();
    }, this.commentatorBoxTimeData().hideDisplayIntervalInSeconds * 1000);
  }

  /**
   * Initializes the commentator box component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
    this.commentatorBoxTimeDataService.loadInitialState();
    this.socialsService.loadInitialState();
  }

  /**
   * Destroys all effects and intervals needed by the `CommentatorBox` component
   */
  ngOnDestroy(): void {
    clearTimeout(this.hideDisplayTimeout);
    clearTimeout(this.showDisplayTimeout);

    this.commBoxDisplayIntervalEffect.destroy();
  }
}
