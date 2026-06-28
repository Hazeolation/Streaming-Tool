import { Component, inject, NgZone, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { CommentatorBox } from '../commentator-box/commentator-box';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { NgClass } from '@angular/common';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';

@Component({
  selector: 'app-map-screen-display',
  imports: [CommentatorBox, NgClass],
  templateUrl: './map-screen-display.html',
  styleUrl: './map-screen-display.scss',
})
export class MapScreenDisplay implements OnInit, OnDestroy {
  /**
   * Logger used for component diagnostics.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Scope for the MapScreen overlay.
   */
  private readonly scope: LogScope = this.log.beginScope('MapScreen');

  /**
   * Broadcast state service instance.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Angular zone used for change detection.
   */
  ngZone: NgZone = inject(NgZone);

  /**
   * Current broadcast state signal.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Gets the left team's display name.
   * @returns {string} The display name of the left team.
   */
  get leftTeamName(): string {
    return this.state().alphaIsLeft ? this.state().teamAlphaName : this.state().teamBravoName;
  }

  /**
   * Gets the right team's display name.
   * @returns {string} The display name of the right team.
   */
  get rightTeamName(): string {
    return this.state().alphaIsLeft ? this.state().teamBravoName : this.state().teamAlphaName;
  }

  /**
   * Gets the left team's score.
   * @returns {number} The score of the left team.
   */
  get leftScore(): number {
    return this.state().alphaIsLeft ? this.state().scoreAlpha : this.state().scoreBravo;
  }

  /**
   * Gets the right team's score.
   * @returns {number} The score of the right team.
   */
  get rightScore(): number {
    return this.state().alphaIsLeft ? this.state().scoreBravo : this.state().scoreAlpha;
  }

  /**
   * Initializes the component and loads the initial broadcast state.
   */
  ngOnInit(): void {
    const scope = this.log.beginScope('MapScreenDisplay.ngOnInit');

    this.log.info('MapScreenDisplay initialized');

    try {
      this.log.debug('Loading broadcast state for map screen');

      this.stateService.loadInitialState();

      this.log.info('Broadcast state load requested');
    } catch (err) {
      this.log.error('Failed during MapScreenDisplay initialization', err);
    } finally {
      scope.dispose();
    }
  }

  /**
   * Gets the CSS class for the winning team logo.
   * @param winner {'alpha' | 'bravo'} - The winning team identifier.
   * @returns {string} The CSS class for the winning team's logo color.
   */
  setWinnerLogoColor(winner: 'alpha' | 'bravo'): string {
    const isAlphaLeft = this.state().alphaIsLeft;

    const result =
      (winner === 'alpha' && isAlphaLeft) || (winner === 'bravo' && !isAlphaLeft)
        ? 'team-alpha-color'
        : 'team-bravo-color';

    this.log.trace('Computed winner logo color', {
      winner,
      isAlphaLeft,
      result,
    });

    return result;
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.trace('Map Screen destroyed');
    this.scope.dispose();
  }
}
