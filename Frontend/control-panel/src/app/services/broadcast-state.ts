import { effect, inject, Injectable, signal } from '@angular/core';
import { BroadcastApi } from './broadcast-api';
import { Signalr } from './signalr';
import { BroadcastState } from '../models/broadcast-state';

@Injectable({
  providedIn: 'root',
})
export class BroadcastStateService {
  private readonly api = inject(BroadcastApi);
  private readonly signalr = inject(Signalr);

  constructor() {
    effect(() => {
      const incoming = this.signalr.liveState();

      if (!incoming) return;

      this.state.set(incoming);
    });

    this.signalr.start();
  }

  availableMaps = [
    {
      id: 'scorch-gorge',
      mapName: 'Sengkluft',
      imageUrl: 'assets/maps/scorch-gorge.png'
    },
    {
      id: 'eeltail-alley',
      mapName: 'Streifenaal-Straße',
      imageUrl: 'assets/maps/eeltail-alley.png'
    },
    {
      id: 'hagglefish-market',
      mapName: 'Schnapperchen-Basar',
      imageUrl: 'assets/maps/hagglefish-market.png'
    },
    {
      id: 'undertow-spillway',
      mapName: 'Schwertmuschel-Reservoir',
      imageUrl: 'assets/maps/undertow-spillway.png'
    },
    {
      id: 'mincemeat-metalworks',
      mapName: 'Aalstahl-Metallwerk',
      imageUrl: 'assets/maps/Mincemeat-Metalworks.png'
    },
    {
      id: 'hammerhead-bridge',
      mapName: 'Makrelenbrücke',
      imageUrl: 'assets/maps/hammerhead-bridge.png'
    },
    {
      id: 'museum-dalfonsino',
      mapName: 'Pinakoithek',
      imageUrl: 'assets/maps/museum-dalfonsino.png'
    },
    {
      id: 'mahi-mahi-resort',
      mapName: 'Mahi-Mahi-Resort',
      imageUrl: 'assets/maps/mahi-mahi-resort.png'
    },
    {
      id: 'inkblot-art-academy',
      mapName: 'Perlmutt-Akademie',
      imageUrl: 'assets/maps/Inkblot-Art-Academy.png'
    },
    {
      id: 'sturgeon-shipyard',
      mapName: 'Störwerft',
      imageUrl: 'assets/maps/Sturgeon-Shipyard.png'
    },
    {
      id: 'makomart',
      mapName: 'Cetacea-Markt',
      imageUrl: 'assets/maps/MakoMart.png'
    },
    {
      id: 'wahoo-world',
      mapName: 'Flundere-Funpark',
      imageUrl: 'assets/maps/Wahoo-World.png'
    },
    {
      id: 'brinewater-springs',
      mapName: 'Kusaya-Quellen',
      imageUrl: 'assets/maps/Brinewater-Springs.png'
    },
    {
      id: 'flounder-heights',
      mapName: 'Schollensiedlung',
      imageUrl: 'assets/maps/Flounder-Heights.png'
    },
    {
      id: 'umami-ruins',
      mapName: 'Um\'ami-Ruinen',
      imageUrl: 'assets/maps/umami-ruins.png'
    },
    {
      id: 'manta-maria',
      mapName: 'Manta Maria',
      imageUrl: 'assets/maps/manta-maria.png'
    },
    {
      id: 'barnacle-dime',
      mapName: 'Talerfisch & Pock',
      imageUrl: 'assets/maps/Barnacle__Dime.png'
    },
    {
      id: 'humpback-pump-track',
      mapName: 'Buckelwal-Piste',
      imageUrl: 'assets/maps/Humpback_Pump_Track.png'
    },
    {
      id: 'crableg-capital',
      mapName: 'Seespinnen-Skyline',
      imageUrl: 'assets/maps/Crableg-Capital.png'
    },
    {
      id: 'shipshape-cargo-co',
      mapName: 'Frachtschiff Schwerfisch',
      imageUrl: 'assets/maps/Shipshape-Cargo-Co.png'
    },
    {
      id: 'robo-romen',
      mapName: 'ROM & RAMen',
      imageUrl: 'assets/maps/Robo-ROM-en.png'
    },
    {
      id: 'bluefin-depot',
      mapName: 'Blauflossen-Depot',
      imageUrl: 'assets/maps/bluefin-depot.png'
    },
    {
      id: 'marlin-airport',
      mapName: 'La Ola Airport',
      imageUrl: 'assets/maps/marlin-airport.png'
    },
    {
      id: 'lemuria-hub',
      mapName: 'Bahnhof Lemuria',
      imageUrl: 'assets/maps/Lemuria-Hub.png'
    },
    {
      id: 'urchin-underpass',
      mapName: 'Dekabahnstation',
      imageUrl: 'assets/maps/Urchin_Underpass.png'
    }
  ];

  availableModes = [
    {
      id: 'tw',
      name: 'Revierkampf'
    },
    {
      id: 'sz',
      name: 'Herrschaft'
    },
    {
      id: 'tc',
      name: 'Turm-Kommando'
    },
    {
      id: 'rm',
      name: 'Operation Goldfisch' 
    },
    {
      id: 'cb',
      name: 'Muschelchaos'
    }
  ]

  availableDivisions = [
    { id: 1, name: 'Division 1' },
    { id: 2, name: 'Division 2' },
    { id: 3, name: 'Division 3' },
    { id: 4, name: 'Division 4' },
    { id: 5, name: 'Division 5' },
    { id: 6, name: 'Division 6' },
    { id: 7, name: 'Division 7' },
    { id: 8, name: 'Division 8' }
  ];

  state = signal<BroadcastState>({
    teamAlphaName: 'Team Alpha',
    teamBravoName: 'Team Bravo',
    alphaIsLeft: true,
    scoreAlpha: 0,
    scoreBravo: 0,
    commentator1: '',
    commentator2: '',
    showMapScreen: true,
    showScoreBox: true,
    showCommentatorBox: true,
    showInfobox: true,
    maps: [],
    season: 10,
    division: 1
  });

  loadInitialState() {
    this.api.getState().subscribe(state => {
      this.state.set(state);
    });
  }

  update(partial: Partial<BroadcastState>) {
    const newState = {
      ...this.state(),
      ...partial
    };

    this.state.set(newState);
    this.api.updateState(newState).subscribe();
  }

  addMap() {
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
      isVisible: true
    };

    this.update({ maps: [...state.maps, newMap] });
  }

  removeMap(id: string) {
    const maps = this.state().maps.filter(x => x.id !== id);
    const reordered = maps.map((map, index) => ({
      ...map, order: index + 1
    }));

    this.update({ maps: reordered });

    this.recalculateScore();
  }

  recalculateScore() {
    const maps = this.state().maps;
    const scoreAlpha = maps.filter(x => x.winner === 'alpha').length;
    const scoreBravo = maps.filter(x => x.winner === 'bravo').length;

    this.update({ scoreAlpha, scoreBravo });
  }
}
