import { AfterContentInit, Component, inject, OnDestroy, OnInit, WritableSignal } from "@angular/core";
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
    selector: 'start-screen',
    imports: [],
    templateUrl: './start-screen.html',
    styleUrl: './start-screen.scss'
})
export class StartScreen implements OnInit, OnDestroy, AfterContentInit {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the score box component to update its UI accordingly whenever the state changes. This setup enables the score box to display the current team names and scores based on the latest broadcast state received from the service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the score box component to reactively update its UI whenever the broadcast state changes. This signal is used to display the team names and scores in the score box, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  private countdownInterval: ReturnType<typeof setInterval> | undefined = undefined;

  /**
   * Initializes the score box component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }

  /**
   * Initializes the countdown timer that updates the html element every second, and displays a placeholder text if the time has elapsed
   */
  ngAfterContentInit(): void {
    // Check for document undefined, document element isn't still properly rendered after content init
    if(typeof document === 'undefined') return;

    clearInterval(this.countdownInterval);

    const setCountdownTimer = () => {
      const timerElem = document.body.querySelector(".countdown-timer");
      if(!timerElem) return;

      const startTime = new Date(this.state().startTime);
      const diffTime = new Date(startTime.getTime() - Date.now());
      if(diffTime.getTime() <= 0) {
        timerElem.textContent = "SOON™";
        return;
      }

      let hours = diffTime.getHours().toString();
      let minutes = diffTime.getMinutes().toString();
      let seconds = diffTime.getSeconds().toString();
      hours = hours.length > 1 ? hours : "0" + hours;
      minutes = minutes.length > 1 ? minutes : "0" + minutes;
      seconds = seconds.length > 1 ? seconds : "0" + seconds;

      timerElem.textContent = hours + ":" + minutes + ":" + seconds;
    }

    setCountdownTimer();
    this.countdownInterval = setInterval(setCountdownTimer, 1000);
  }

  /**
   * Clears all intervals on component destroy
   */
  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }
}