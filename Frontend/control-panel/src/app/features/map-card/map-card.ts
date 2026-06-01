import { Component, Input, WritableSignal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MapState } from '../../models/map-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { EditCard } from '../edit-card/edit-card';
import { BroadcastState } from '../../models/broadcast-state';

@Component({
  selector: 'app-map-card',
  imports: [FormsModule, EditCard, NgFor, NgIf],
  templateUrl: './map-card.html',
  styleUrl: './map-card.scss',
})
export class MapCard {
  @Input({required: true}) map!: MapState;
  stateService: BroadcastStateService = inject(BroadcastStateService);
  state: WritableSignal<BroadcastState> = this.stateService.state;

  availableMaps = this.stateService.availableMaps;
  availableModes = this.stateService.availableModes;
  showEditMenu: boolean = false;

  setWinner(winner: 'alpha' | 'bravo'): void {
    const state = this.stateService.state();

    const updatedMaps = state.maps.map(m => {
      if (m.id === this.map.id)
      {
        return {
          ...m,
          winner
        };
      }

      return m;
    });

    const scoreAlpha = updatedMaps.filter(x => x.winner === 'alpha').length;
    const scoreBravo = updatedMaps.filter(x => x.winner === 'bravo').length;

    this.stateService.update({
      maps: updatedMaps,
      scoreAlpha,
      scoreBravo
    });
  }

  removeMap(): void {
    this.stateService.removeMap(this.map.id);
  }

  updateMap(mapId: string): void {
    const selected = this.availableMaps.find(m => m.id === mapId);
    if (!selected) return console.error("Selected map not found:", mapId);

    const updatedMaps = this.stateService.state().maps.map(m => {
      if (m.id === this.map.id)
        return {
          ...m,
          mapId,
          mapName: selected.mapName,
          imageUrl: selected.imageUrl
        };

      return m;
    });

    this.stateService.update({ maps: updatedMaps });
  }

  updateMode(modeId: string): void {
    const selected = this.availableModes.find(m => m.id === modeId);
    if (!selected) return console.error('Selected mode not found:', modeId);

    const updatedMaps = this.stateService.state().maps.map(m => {
      if (m.id === this.map.id) {
        return {
          ...m,
          modeId: selected.id,
          modeName: selected.name
        };
      }

      return m;
    });

    this.stateService.update({ maps: updatedMaps });
  }

  openEditMenu(): void {
    this.showEditMenu = !this.showEditMenu;
  }

  closeEditMenu(): void {
    this.showEditMenu = false;
  }
}
