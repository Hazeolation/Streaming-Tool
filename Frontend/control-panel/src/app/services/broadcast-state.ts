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
      mapName: 'Scorch Gorge',
      imageUrl: 'assets/maps/scorch-gorge.png'
    },
    {
      id: 'eeltail-alley',
      mapName: 'Eeltail Alley',
      imageUrl: 'assets/maps/eeltail-alley.png'
    },
    {
      id: 'hagglefish-market',
      mapName: 'Hagglefish Market',
      imageUrl: 'assets/maps/hagglefish-market.png'
    },
    {
      id: 'undertow-spillway',
      mapName: 'Undertow Spillway',
      imageUrl: 'assets/maps/undertow-spillway.png'
    },
    {
      id: 'mincemeat-metalworks',
      mapName: 'Mincemeat Metalworks',
      imageUrl: 'assets/maps/Mincemeat-Metalworks.png'
    },
    {
      id: 'hammerhead-bridge',
      mapName: 'Hammerhead Bridge',
      imageUrl: 'assets/maps/hammerhead-bridge.png'
    },
    {
      id: 'museum-dalfonsino',
      mapName: 'Museum d\'Alfonsino',
      imageUrl: 'assets/maps/museum-dalfonsino.png'
    },
    {
      id: 'mahi-mahi-resort',
      mapName: 'Mahi-Mahi Resort',
      imageUrl: 'assets/maps/mahi-mahi-resort.png'
    },
    {
      id: 'inkblot-art-academy',
      mapName: 'Inkblot Art Academy',
      imageUrl: 'assets/maps/Inkblot-Art-Academy.png'
    },
    {
      id: 'sturgeon-shipyard',
      mapName: 'Sturgeon Shipyard',
      imageUrl: 'assets/maps/Sturgeon-Shipyard.png'
    },
    {
      id: 'makomart',
      mapName: 'MakoMart',
      imageUrl: 'assets/maps/MakoMart.png'
    },
    {
      id: 'wahoo-world',
      mapName: 'Wahoo World',
      imageUrl: 'assets/maps/Wahoo-World.png'
    },
    {
      id: 'brinewater-springs',
      mapName: 'Brinewater Springs',
      imageUrl: 'assets/maps/Brinewater-Springs.png'
    },
    {
      id: 'flounder-heights',
      mapName: 'Flounder Heights',
      imageUrl: 'assets/maps/Flounder-Heights.png'
    },
    {
      id: 'umami-ruins',
      mapName: 'Um\'ami Ruins',
      imageUrl: 'assets/maps/umami-ruins.png'
    },
    {
      id: 'manta-maria',
      mapName: 'Manta Maria',
      imageUrl: 'assets/maps/manta-maria.png'
    },
    {
      id: 'barnacle-dime',
      mapName: 'Barnacle & Dime',
      imageUrl: 'assets/maps/Barnacle__Dime.png'
    },
    {
      id: 'humpback-pump-track',
      mapName: 'Humpback Pump Track',
      imageUrl: 'assets/maps/Humpback_Pump_Track.png'
    },
    {
      id: 'crableg-capital',
      mapName: 'Crableg Capital',
      imageUrl: 'assets/maps/Crableg-Capital.png'
    },
    {
      id: 'shipshape-cargo-co',
      mapName: 'Shipshape Cargo Co.',
      imageUrl: 'assets/maps/Shipshape-Cargo-Co.png'
    },
    {
      id: 'robo-romen',
      mapName: 'Robo ROM-en',
      imageUrl: 'assets/maps/Robo-ROM-en.png'
    },
    {
      id: 'bluefin-depot',
      mapName: 'Bluefin Depot',
      imageUrl: 'assets/maps/bluefin-depot.png'
    },
    {
      id: 'marlin-airport',
      mapName: 'Marlin Airport',
      imageUrl: 'assets/maps/marlin-airport.png'
    },
    {
      id: 'lemuria-hub',
      mapName: 'Lemuria Hub',
      imageUrl: 'assets/maps/Lemuria-Hub.png'
    },
    {
      id: 'urchin-underpass',
      mapName: 'Urchin Underpass',
      imageUrl: 'assets/maps/Urchin_Underpass.png'
    }
  ];

  availableModes = [
    {
      id: 'tw',
      name: 'Turf War'
    },
    {
      id: 'sz',
      name: 'Splat Zones'
    },
    {
      id: 'tc',
      name: 'Tower Control'
    },
    {
      id: 'rm',
      name: 'Rainmaker' 
    },
    {
      id: 'cb',
      name: 'Clam Blitz'
    }
  ]

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
