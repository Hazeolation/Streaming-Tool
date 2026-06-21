import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BroadcastApi } from './broadcast-api';
import { Signalr } from './signalr';
import { BroadcastState } from '../models/broadcast-state';
import { Division } from '../models/division';
import { Map } from '../models/map';
import { Mode } from '../models/mode';

@Injectable({
  providedIn: 'root',
})
export class BroadcastStateService {
  private readonly api: BroadcastApi = inject(BroadcastApi);
  private readonly signalr: Signalr = inject(Signalr);

  /**
   * Initializes the BroadcastStateService by setting up an effect that listens for incoming broadcast state updates from the SignalR service. When a new state is received, it updates the local state signal with the incoming data. Additionally, it starts the SignalR connection to begin receiving live updates. This ensures that the service always has the most current broadcast state as provided by the backend or other sources sending updates through SignalR.
   */
  constructor() {
    effect(() => {
      const incoming = this.signalr.liveState();

      if (!incoming) return;

      this.state.set(incoming);
    });

    this.signalr.start();
  }

  /**
   * A predefined list of maps that can be selected for the broadcast. Each map has a unique ID, a name, and an image URL. This list is used to populate dropdowns or selection components in the UI where the user can choose the map for each map slot in the current broadcast state.
   */
  availableMaps: Map[] = [
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
      mapName: 'Flunder-Funpark',
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

  /**
   * A predefined list of game modes that can be selected for the broadcast. Each mode has a unique ID and a name. This list is used to populate dropdowns or selection components in the UI where the user can choose the game mode for the current broadcast state.
   */
  availableModes: Mode[] = [
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

  /**
   * A predefined list of divisions that can be selected for the broadcast. Each division has a unique ID and a name. This list is used to populate dropdowns or selection components in the UI where the user can choose the division for the current broadcast state.
   */
  availableDivisions: Division[] = [
    { id: 1, name: 'Division 1' },
    { id: 2, name: 'Division 2' },
    { id: 3, name: 'Division 3' },
    { id: 4, name: 'Division 4' },
    { id: 5, name: 'Division 5' },
    { id: 6, name: 'Division 6' },
    { id: 7, name: 'Division 7' },
    { id: 8, name: 'Division 8' }
  ];

  /**
   * The main state signal that holds the current broadcast state. It is initialized with default values and gets updated either through incoming SignalR messages or when the `update` method is called to change the state and persist it to the backend API.
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
    week: 1
  });

  /**
   * Loads the initial broadcast state from the backend API and sets it to the state signal. This method is typically called during the initialization of components that depend on the broadcast state to ensure they have the most up-to-date information when they start.
   */
  loadInitialState(): void {
    this.api.getState().subscribe(state => {
      this.state.set(state);
    });
  }

  /**
   * Updates the broadcast state by merging the existing state with the provided partial state, then sends the updated state to the backend API.
   * @param {Partial<BroadcastState>} partial The partial state containing the properties to be updated in the current broadcast state.
   */
  update(partial: Partial<BroadcastState>): void {
    const newState = {
      ...this.state(),
      ...partial
    };

    this.state.set(newState);
    this.api.updateState(newState).subscribe();
  }

  /**
   * Adds a new map to the state with default values, then updates the state and recalculates the scores accordingly.
   */
  addMap(): void {
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

  /**
   * Removes a map from the state based on its ID, then reorders the remaining maps and updates the scores accordingly.
   * @param {string} id The unique identifier of the map to be removed.
   */
  removeMap(id: string): void {
    const maps = this.state().maps.filter(x => x.id !== id);
    const reordered = maps.map((map, index) => ({
      ...map, order: index + 1
    }));

    const scoreAlpha = reordered.filter(x => x.winner === 'alpha').length;
    const scoreBravo = reordered.filter(x => x.winner === 'bravo').length;

    this.update({ maps: reordered, scoreAlpha, scoreBravo });
  }
}
