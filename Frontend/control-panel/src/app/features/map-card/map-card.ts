import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MapState } from '../../models/map-state';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-map-card',
  imports: [FormsModule, NgFor],
  templateUrl: './map-card.html',
  styleUrl: './map-card.scss',
})
export class MapCard {
  @Input({required: true}) map!: MapState;
  stateService = inject(BroadcastStateService);
  state = this.stateService.state;

  availableMaps = this.stateService.availableMaps;
  availableModes = this.stateService.availableModes;

  setWinner(winner: 'alpha' | 'bravo') {
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

  removeMap() {
    this.stateService.removeMap(this.map.id);
  }

  toggleVisibility() {
    const state = this.stateService.state();
    const updatedMaps = state.maps.map(m => {
      if (m.id === this.map.id)
        return {
          ...m,
          isVisible: !m.isVisible
        };

      return m;
    });

    this.stateService.update({ maps: updatedMaps });
  }

  updateMap(mapId: string) {
    const selected = this.availableMaps.find(m => m.id === mapId);
    if (!selected) return;

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

  updateMode(modeId: string) {
    const selected = this.availableModes.find(m => m.id === modeId);
    if (!selected) return;

    const updatedMaps = this.stateService.state().maps.map(m => {
      if (m.id === this.map.id)
        return {
          ...m,
          modeId,
          modeName: selected.name
        };

      return m;
    });

    this.stateService.update({ maps: updatedMaps });
  }

  openEditMenu() {
    
  }
}
