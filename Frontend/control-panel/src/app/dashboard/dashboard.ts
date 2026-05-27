import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private http: HttpClient) {}

  scoreA = 0;
  scoreB = 0;
  matchId = 1; // This should be dynamically set based on the current match

  increaseA() {
    this.scoreA++;
    this.updateScore();
  }

  increaseB() {
    this.scoreB++;
    this.updateScore();
  }

  updateScore() {
    this.http.post(`http://localhost:5285/api/matches/${matchId}/score`, {
      scoreA: this.scoreA,
      scoreB: this.scoreB
    }).subscribe();
  }
}
