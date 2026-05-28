import { Component, inject, OnInit } from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-commentator-box',
  imports: [],
  templateUrl: './commentator-box.html',
  styleUrl: './commentator-box.scss',
})
export class CommentatorBox implements OnInit {
  stateService = inject(BroadcastStateService);

  state = this.stateService.state;
  
  ngOnInit() {
    this.stateService.loadInitialState();
  }
}
