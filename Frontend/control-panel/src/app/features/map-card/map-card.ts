import { NgClass } from '@angular/common';
import { Component, Input, WritableSignal, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditCard } from '../edit-card/edit-card';
import { BroadcastState } from '../../models/broadcast-state';
import { MapState } from '../../models/map-state';
import { Map } from '../../models/map';
import { Mode } from '../../models/mode';
import { BroadcastStateService } from '../../services/broadcast-state';
import { LogService } from '../../services/log';

@Component({
  selector: 'app-map-card',
  imports: [FormsModule, EditCard, NgClass],
  templateUrl: './map-card.html',
  styleUrl: './map-card.scss',
})
export class MapCard implements OnInit, OnDestroy {
  /** Logger instance for this component. */
  private readonly log = inject(LogService);

  /** Scoped logger lifecycle manager. */
  private readonly scope = this.log.beginScope('MapCard');

  /** The map state bound to this component. */
  @Input({ required: true }) map!: MapState;

  /** Service managing broadcast state updates. */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /** Signal representing the current broadcast state. */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /** Available maps sorted alphabetically by name. */
  availableMaps: Map[] = this.stateService.availableMaps.sort((a, b) => {
    if (a.mapName < b.mapName) return -1;
    if (a.mapName > b.mapName) return 1;
    return 0;
  });

  /** Available modes for map selection. */
  availableModes: Mode[] = this.stateService.availableModes;

  /** Whether the edit menu is visible. */
  showEditMenu: boolean = false;

  /** Initialize the component and log startup details. */
  ngOnInit(): void {
    this.log.debug('MapCard initialized', {
      mapId: this.map?.id,
      mapName: this.map?.mapName,
    });
  }

  /**
   * Get the CSS class for a team button based on the current winner.
   * @param team {'alpha' | 'beta'} Team identifier
   * @returns {string} CSS class string for the team button
   */
  getTeamButtonClass(team: 'alpha' | 'bravo'): string {
    const winner = this.state().maps.find((m) => m.id === this.map.id)?.winner ?? null;

    return winner === null
      ? `teamButton ${team}`
      : winner === team
        ? `teamButton ${team}-win`
        : 'teamButton';
  }

  /**
   * Handle a winner selection for this map card.
   * @param winner {'alpha' | 'bravo'} Selected winner
   */
  handleWinnerSelection(winner: 'alpha' | 'bravo'): void {
    const current = this.state().maps.find((m) => m.id === this.map.id)?.winner ?? null;

    if (current === winner) {
      this.log.info('Winner cleared', {
        mapId: this.map.id,
        previousWinner: winner,
      });

      return this.setWinner(null);
    }

    this.log.info('Winner selected', {
      mapId: this.map.id,
      winner,
    });

    this.setWinner(winner);
  }

  /**
   * Update the winner for the current map and refresh score totals.
   * @param winner {'alpha' | 'bravo' | null} Winner identifier or null to clear the selection
   */
  setWinner(winner: 'alpha' | 'bravo' | null): void {
    this.log.debug('Updating winner', {
      mapId: this.map.id,
      winner,
    });

    const state = this.stateService.state();

    const updatedMaps = state.maps.map((m) => {
      if (m.id === this.map.id) {
        return { ...m, winner };
      }
      return m;
    });

    const scoreAlpha = updatedMaps.filter((x) => x.winner === 'alpha').length;
    const scoreBravo = updatedMaps.filter((x) => x.winner === 'bravo').length;

    this.stateService.update({
      maps: updatedMaps,
      scoreAlpha,
      scoreBravo,
    });
  }

  /** Remove this map from the broadcast state. */
  removeMap(): void {
    this.log.warn('Map removed', {
      mapId: this.map.id,
    });

    this.stateService.removeMap(this.map.id);
  }

  /**
   * Update the current map selection using the provided map id.
   * @param mapId {string} Identifier of the selected map
   */
  updateMap(mapId: string): void {
    this.log.info('Map update requested', {
      mapId,
      currentMapId: this.map.id,
    });

    const selected = this.availableMaps.find((m) => m.id === mapId);

    if (!selected) {
      this.log.error('Selected map not found', {
        mapId,
      });
      return;
    }

    const updatedMaps = this.stateService.state().maps.map((m) => {
      if (m.id === this.map.id) {
        return {
          ...m,
          mapId,
          mapName: selected.mapName,
          imageUrl: selected.imageUrl,
        };
      }
      return m;
    });

    this.stateService.update({ maps: updatedMaps });
  }

  /**
   * Update the game mode for the current map.
   * @param modeId {string} Identifier of the selected mode
   */
  updateMode(modeId: string): void {
    this.log.info('Mode update requested', {
      modeId,
      mapId: this.map.id,
    });

    const selected = this.availableModes.find((m) => m.id === modeId);

    if (!selected) {
      this.log.error('Selected mode not found', {
        modeId,
      });
      return;
    }

    const updatedMaps = this.stateService.state().maps.map((m) => {
      if (m.id === this.map.id) {
        return {
          ...m,
          modeId: selected.id,
          modeName: selected.name,
        };
      }
      return m;
    });

    this.stateService.update({ maps: updatedMaps });
  }

  /** Open the edit menu for this map card. */
  openEditMenu(): void {
    this.log.debug('Edit menu opened', {
      mapId: this.map.id,
    });

    this.showEditMenu = true;
  }

  /** Close the edit menu for this map card. */
  closeEditMenu(): void {
    this.log.debug('Edit menu closed', {
      mapId: this.map.id,
    });

    this.showEditMenu = false;
  }

  /** Cleanup component resources when destroyed. */
  ngOnDestroy(): void {
    this.log.info('MapCard destroyed', {
      mapId: this.map.id,
    });

    this.scope.dispose();
  }
}
