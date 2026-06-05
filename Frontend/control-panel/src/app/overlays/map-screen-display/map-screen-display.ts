import { afterRenderEffect, Component, inject, NgZone, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-map-screen-display',
  imports: [],
  templateUrl: './map-screen-display.html',
  styleUrl: './map-screen-display.scss',
})
export class MapScreenDisplay implements OnInit, OnDestroy {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the map screen display component to update its UI accordingly whenever the state changes. This setup enables the map screen display to show the current map information based on the latest broadcast state received from the service.
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
   * Effect that watches for division changes and updates the CSS custom property
   * `--current-division-color` to match the corresponding division color variable.
   * This ensures the header background gradient always reflects the current division's color scheme.
   */
  private divisionEffect = afterRenderEffect(() => {
    const division = this.state().division;
    if (!division) return;
    
    document.documentElement.style.setProperty(
      '--current-division-color',
      `var(--division-${division}-color)`
    );
  });

  /**
   * Initializes the map screen display component by calling the `loadInitialState` method on the `BroadcastStateService`. This ensures that the component has the initial broadcast state loaded and ready to display when it is first rendered. The `ngOnInit` lifecycle hook is used to perform this initialization logic, which is a common practice in Angular components to set up necessary data or state before the component is displayed to the user.
   */
  ngOnInit(): void {
    this.stateService.loadInitialState();
  }

  /**
   * Destroys all effects on component destroy
   */
  ngOnDestroy(): void {
    this.divisionEffect.destroy();
  }
}