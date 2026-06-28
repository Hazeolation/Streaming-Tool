import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BroadcastApi } from './broadcast-api';
import { Signalr } from './signalr';
import { BroadcastState } from '../models/broadcast-state';
import { Division } from '../models/division';
import { Map } from '../models/map';
import { Mode } from '../models/mode';
import { SignalrServiceConnection } from '../enums/SignalrServiceConnection';
import { LogService } from './log';

@Injectable({
  providedIn: 'root',
})
export class BroadcastStateService {
  private readonly api = inject(BroadcastApi);
  private readonly signalr = inject(Signalr);
  private readonly log = inject(LogService);

  constructor() {
    const scope = this.log.beginScope('BroadcastStateService');

    this.log.info('Initializing BroadcastStateService');

    effect(() => {
      const incoming = this.signalr.liveState();

      if (!incoming) return;

      this.log.debug('SignalR broadcast state received', incoming);

      this.state.set(incoming);

      this.log.info('Broadcast state updated from SignalR');
    });

    this.signalr.connectionType = SignalrServiceConnection.BroadcastState;

    this.signalr.start();

    this.log.info('SignalR connection started (BroadcastState)');

    scope.dispose();
  }

  /**
   * Available data (unchanged but useful for debugging)
   */
  availableMaps: Map[] = [
    {
      id: 'scorch-gorge',
      mapName: 'Sengkluft',
      imageUrl: 'assets/maps/scorch-gorge.png',
    },
    {
      id: 'eeltail-alley',
      mapName: 'Streifenaal-Straße',
      imageUrl: 'assets/maps/eeltail-alley.png',
    },
    {
      id: 'hagglefish-market',
      mapName: 'Schnapperchen-Basar',
      imageUrl: 'assets/maps/hagglefish-market.png',
    },
    {
      id: 'undertow-spillway',
      mapName: 'Schwertmuschel-Reservoir',
      imageUrl: 'assets/maps/undertow-spillway.png',
    },
    {
      id: 'mincemeat-metalworks',
      mapName: 'Aalstahl-Metallwerk',
      imageUrl: 'assets/maps/Mincemeat-Metalworks.png',
    },
    {
      id: 'hammerhead-bridge',
      mapName: 'Makrelenbrücke',
      imageUrl: 'assets/maps/hammerhead-bridge.png',
    },
    {
      id: 'museum-dalfonsino',
      mapName: 'Pinakoithek',
      imageUrl: 'assets/maps/museum-dalfonsino.png',
    },
    {
      id: 'mahi-mahi-resort',
      mapName: 'Mahi-Mahi-Resort',
      imageUrl: 'assets/maps/mahi-mahi-resort.png',
    },
    {
      id: 'inkblot-art-academy',
      mapName: 'Perlmutt-Akademie',
      imageUrl: 'assets/maps/Inkblot-Art-Academy.png',
    },
    {
      id: 'sturgeon-shipyard',
      mapName: 'Störwerft',
      imageUrl: 'assets/maps/Sturgeon-Shipyard.png',
    },
    {
      id: 'makomart',
      mapName: 'Cetacea-Markt',
      imageUrl: 'assets/maps/MakoMart.png',
    },
    {
      id: 'wahoo-world',
      mapName: 'Flunder-Funpark',
      imageUrl: 'assets/maps/Wahoo-World.png',
    },
    {
      id: 'brinewater-springs',
      mapName: 'Kusaya-Quellen',
      imageUrl: 'assets/maps/Brinewater-Springs.png',
    },
    {
      id: 'flounder-heights',
      mapName: 'Schollensiedlung',
      imageUrl: 'assets/maps/Flounder-Heights.png',
    },
    {
      id: 'umami-ruins',
      mapName: "Um'ami-Ruinen",
      imageUrl: 'assets/maps/umami-ruins.png',
    },
    {
      id: 'manta-maria',
      mapName: 'Manta Maria',
      imageUrl: 'assets/maps/manta-maria.png',
    },
    {
      id: 'barnacle-dime',
      mapName: 'Talerfisch & Pock',
      imageUrl: 'assets/maps/Barnacle__Dime.png',
    },
    {
      id: 'humpback-pump-track',
      mapName: 'Buckelwal-Piste',
      imageUrl: 'assets/maps/Humpback_Pump_Track.png',
    },
    {
      id: 'crableg-capital',
      mapName: 'Seespinnen-Skyline',
      imageUrl: 'assets/maps/Crableg-Capital.png',
    },
    {
      id: 'shipshape-cargo-co',
      mapName: 'Frachtschiff Schwerfisch',
      imageUrl: 'assets/maps/Shipshape-Cargo-Co.png',
    },
    {
      id: 'robo-romen',
      mapName: 'ROM & RAMen',
      imageUrl: 'assets/maps/Robo-ROM-en.png',
    },
    {
      id: 'bluefin-depot',
      mapName: 'Blauflossen-Depot',
      imageUrl: 'assets/maps/bluefin-depot.png',
    },
    {
      id: 'marlin-airport',
      mapName: 'La Ola Airport',
      imageUrl: 'assets/maps/marlin-airport.png',
    },
    {
      id: 'lemuria-hub',
      mapName: 'Bahnhof Lemuria',
      imageUrl: 'assets/maps/Lemuria-Hub.png',
    },
    {
      id: 'urchin-underpass',
      mapName: 'Dekabahnstation',
      imageUrl: 'assets/maps/Urchin_Underpass.png',
    },
  ];
  availableModes: Mode[] = [
    {
      id: 'tw',
      name: 'Revierkampf',
    },
    {
      id: 'sz',
      name: 'Herrschaft',
    },
    {
      id: 'tc',
      name: 'Turm-Kommando',
    },
    {
      id: 'rm',
      name: 'Operation Goldfisch',
    },
    {
      id: 'cb',
      name: 'Muschelchaos',
    },
  ];
  availableDivisions: Division[] = [
    { id: 1, name: 'Division 1' },
    { id: 2, name: 'Division 2' },
    { id: 3, name: 'Division 3' },
    { id: 4, name: 'Division 4' },
    { id: 5, name: 'Division 5' },
    { id: 6, name: 'Division 6' },
    { id: 7, name: 'Division 7' },
    { id: 8, name: 'Division 8' },
  ];

  /**
   * Main state
   */
  state: WritableSignal<BroadcastState> = signal<BroadcastState>({
    teamAlphaName: 'Team Alpha',
    teamBravoName: 'Team Bravo',
    alphaIsLeft: true,
    startTime: new Date(0),
    scoreAlpha: 0,
    scoreBravo: 0,
    streamer: '',
    commentator1: '',
    commentator2: '',
    showMapScreen: true,
    showScoreBox: true,
    showCommentatorBox: true,
    showInfobox: true,
    maps: [],
    season: 10,
    division: 1,
    week: 1,
  });

  loadInitialState(): void {
    const scope = this.log.beginScope('BroadcastStateService.loadInitialState');

    this.log.info('Loading initial broadcast state');

    this.api.getState().subscribe({
      next: (state) => {
        this.log.debug('Initial state received from API', state);

        this.state.set(state);

        this.log.info('Initial broadcast state applied');
      },
      error: (err) => {
        this.log.error('Failed to load initial state', err);
      },
    });

    scope.dispose();
  }

  update(partial: Partial<BroadcastState>): void {
    const scope = this.log.beginScope('BroadcastStateService.update');

    try {
      const before = this.state();

      const newState = {
        ...before,
        ...partial,
      };

      this.log.debug('Updating broadcast state', {
        before,
        patch: partial,
        after: newState,
      });

      this.state.set(newState);

      this.api.updateState(newState).subscribe({
        next: (result) => {
          this.log.info('Broadcast state updated via API', result);
        },
        error: (err) => {
          this.log.error('Failed to update broadcast state', err, newState);
        },
      });
    } finally {
      scope.dispose();
    }
  }

  addMap(): void {
    const scope = this.log.beginScope('BroadcastStateService.addMap');

    const state = this.state();
    const defaultMap = this.availableMaps[0];
    const defaultMode = this.availableModes[1];

    const newMap = {
      id: crypto.randomUUID(),
      order: state.maps.length + 1,
      mapId: defaultMap.id,
      mapName: defaultMap.mapName,
      modeId: defaultMode.id,
      modeName: defaultMode.name,
      imageUrl: defaultMap.imageUrl,
      isVisible: true,
    };

    this.log.debug('Adding new map', newMap);

    this.update({
      maps: [...state.maps, newMap],
    });

    scope.dispose();
  }

  removeMap(id: string): void {
    const scope = this.log.beginScope('BroadcastStateService.removeMap');

    const state = this.state();

    this.log.debug('Removing map', { id });

    const maps = state.maps.filter((x) => x.id !== id);

    const reordered = maps.map((map, index) => ({
      ...map,
      order: index + 1,
    }));

    const scoreAlpha = reordered.filter((x) => x.winner === 'alpha').length;

    const scoreBravo = reordered.filter((x) => x.winner === 'bravo').length;

    this.log.debug('Maps reordered and scores recalculated', {
      scoreAlpha,
      scoreBravo,
      mapCount: reordered.length,
    });

    this.update({
      maps: reordered,
      scoreAlpha,
      scoreBravo,
    });

    scope.dispose();
  }
}
