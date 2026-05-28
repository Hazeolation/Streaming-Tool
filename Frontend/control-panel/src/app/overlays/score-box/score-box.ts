import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-score-box',
  imports: [],
  templateUrl: './score-box.html',
  styleUrl: './score-box.scss',
})
export class ScoreBox implements OnInit {
  stateService = inject(BroadcastStateService);

  state = this.stateService.state;

  ngOnInit() {
    this.stateService.loadInitialState();
  }

  get leftTeamName() {
    return this.state().alphaIsLeft ? this.state().teamAlphaName : this.state().teamBravoName;
  }

  get rightTeamName() {
    return this.state().alphaIsLeft ? this.state().teamBravoName : this.state().teamAlphaName;
  }

  get leftScore() {
    return this.state().alphaIsLeft ? this.state().scoreAlpha : this.state().scoreBravo;
  }

  get rightScore() {
    return this.state().alphaIsLeft ? this.state().scoreBravo : this.state().scoreAlpha;
  }
}
