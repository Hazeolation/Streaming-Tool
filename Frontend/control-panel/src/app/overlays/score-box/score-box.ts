import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBox } from '../commentator-box/commentator-box';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';

@Component({
  selector: 'app-score-box',
  imports: [CommentatorBox],
  templateUrl: './score-box.html',
  styleUrl: './score-box.scss',
})
export class ScoreBox implements OnInit {
  /**
   * Logger used to trace score box lifecycle events.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Scope for the ScopeBox overlay.
   */
  private readonly scope: LogScope = this.log.beginScope('ScoreBox');

  /**
   * Service that exposes the current broadcast state.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Writable signal containing the current broadcast state.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Gets the team name displayed on the left side of the score box.
   * @returns {string} The left-side team name.
   */
  get leftTeamName(): string {
    return this.state().alphaIsLeft ? this.state().teamAlphaName : this.state().teamBravoName;
  }

  /**
   * Gets the team name displayed on the right side of the score box.
   * @returns {string} The right-side team name.
   */
  get rightTeamName(): string {
    return this.state().alphaIsLeft ? this.state().teamBravoName : this.state().teamAlphaName;
  }

  /**
   * Gets the score for the left-side team.
   * @returns {number} The left-side team score.
   */
  get leftScore(): number {
    return this.state().alphaIsLeft ? this.state().scoreAlpha : this.state().scoreBravo;
  }

  /**
   * Gets the score for the right-side team.
   * @returns {number} The right-side team score.
   */
  get rightScore(): number {
    return this.state().alphaIsLeft ? this.state().scoreBravo : this.state().scoreAlpha;
  }

  /**
   * Initializes the component and requests the initial broadcast state.
   */
  ngOnInit(): void {
    const scope = this.log.beginScope('ScoreBox.ngOnInit');

    this.log.info('ScoreBox initialized');

    try {
      this.log.debug('Requesting broadcast state load');

      this.stateService.loadInitialState();

      this.log.info('Broadcast state load requested');
    } catch (err) {
      this.log.error('Failed during ScoreBox initialization', err);
    } finally {
      scope.dispose();
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.trace('Score Box destroyed');
    this.scope.dispose();
  }
}
