import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.html',
  styleUrl: './scoreboard.css',
})
export class Scoreboard implements OnInit {
  teamA = "Team Alpha";
  teamB = "Team Bravo";
  scoreA = 0;
  scoreB = 0;

  async ngOnInit() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5285/overlayHub')
      .withAutomaticReconnect()
      .build();

    connection.on('scoreUpdated', data => 
      {
        this.scoreA = data.scoreA;
        this.scoreB = data.scoreB;
      }
    );

    await connection.start();

    console.log('Connected to SignalR');
  }
}
