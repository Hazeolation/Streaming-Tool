import { NgClass } from '@angular/common';
import { Component, Input, WritableSignal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditCard } from '../edit-card/edit-card';
import { BroadcastState } from '../../models/broadcast-state';
import { MapState } from '../../models/map-state';
import { Map } from '../../models/map';
import { Mode } from '../../models/mode';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-map-card',
  imports: [FormsModule, EditCard, NgClass],
  templateUrl: './map-card.html',
  styleUrl: './map-card.scss',
})
export class MapCard {
  /**
   * Defines an input property `map` of type `MapState`, which is required for the `MapCard` component. This property represents the state of a specific map being played in the broadcast, including details such as the map's name, mode, image URL, winner, and visibility status. The `@Input` decorator indicates that this property will receive its value from a parent component, allowing the `MapCard` to display and manage the information related to the map it represents. The component uses this `map` property to render the appropriate UI elements and provide functionality for updating the map's state within the broadcast.
   */
  @Input({required: true}) map!: MapState;

  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the map card component to update its UI accordingly whenever the state changes. This setup enables the map card to show the current map information based on the latest broadcast state received from the service, and to provide interactive controls for modifying the map's state within the broadcast.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the map card component to reactively update its UI whenever the broadcast state changes. This signal is used to display the current map information in the map card, ensuring that it always reflects the most current state of the broadcast as provided by the service, and to facilitate updates to the map's state when user interactions occur within the component.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * An array of `Map` objects representing the available maps in the broadcasting tool. This property is populated by referencing the `availableMaps` property from the `BroadcastStateService`, allowing the map card component to display a list of maps for users to select from when updating the map's state. The `Map` interface includes properties such as `id`, `mapName`, and `imageUrl`, which are used to structure and display map information in the user interface, enabling users to easily identify and visualize the maps available in the broadcasting tool.
   */
  availableMaps: Map[] = this.stateService.availableMaps;

  /**
   * An array of `Mode` objects representing the available game modes in the broadcasting tool. This property is populated by referencing the `availableModes` property from the `BroadcastStateService`, allowing the map card component to display a list of modes for users to select from when updating the map's state. The `Mode` interface includes properties such as `id` and `name`, which are used to structure and display mode information in the user interface, enabling users to easily identify and differentiate between various game modes available in the broadcasting tool.
   */
  availableModes: Mode[] = this.stateService.availableModes;

  /**
   * A boolean property that controls the visibility of the edit menu for the map card. When `showEditMenu` is set to `true`, the edit menu is displayed, allowing users to modify the map's state, such as changing the selected map, mode, or winner. When set to `false`, the edit menu is hidden from view. This property is typically toggled in response to user interactions, such as clicking an "Edit" button on the map card, providing a way for users to access and manage the map's settings within the broadcast.
   */
  showEditMenu: boolean = false;

  /**
   * Handles the selection of a winner for the map. When a user selects a winner (either 'alpha' or 'bravo'), this method checks if the selected winner is already marked as the winner for the current map. If it is, it calls `setWinner` with `null` to clear the winner selection. If it is not, it calls `setWinner` with the selected winner to update the map's state accordingly. This method allows users to easily toggle the winner selection for a map, providing an intuitive way to manage the outcome of each map in the broadcast.
   * @param winner The team selected as the winner for the map, which can be either 'alpha' or 'bravo'. This parameter is used to determine which team is currently marked as the winner for the map and to update the state accordingly when a user interacts with the winner selection in the UI.
   */
  handleWinnerSelection(winner: 'alpha' | 'bravo'): void {
    if (this.state().maps.find(m => m.id === this.map.id)?.winner === winner) {
      
      return this.setWinner(null);
    }
    
    this.setWinner(winner);
  }

  /**
   * Sets the winner for the current map by updating the broadcast state through the `BroadcastStateService`. This method takes a `winner` parameter, which can be 'alpha', 'bravo', or `null` to indicate no winner. It updates the `maps` array in the broadcast state to reflect the new winner for the current map, and also recalculates the scores for both teams based on the updated winners of all maps. Finally, it calls the `update` method on the `BroadcastStateService` to apply these changes to the overall broadcast state, ensuring that all components that depend on this state will reactively update their UI to reflect the new winner and scores.
   * @param winner The team selected as the winner for the map, which can be 'alpha', 'bravo', or `null` to indicate no winner. This parameter is used to update the state of the current map in the broadcast, allowing users to manage the outcome of each map and see the corresponding changes in team scores based on the winners selected.
   */
  setWinner(winner: 'alpha' | 'bravo' | null): void {
    const state = this.stateService.state();

    const updatedMaps = state.maps.map((m) => {
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

  /**
   * Removes the current map from the broadcast state by calling the `removeMap` method on the `BroadcastStateService` with the ID of the current map. This method is typically triggered by a user action, such as clicking a "Remove" button in the edit menu of the map card. When invoked, it updates the broadcast state to exclude the current map, allowing users to manage the maps being played in the broadcast and ensure that only relevant maps are included in the state.
   */
  removeMap(): void {
    this.stateService.removeMap(this.map.id);
  }

  /**
   * Updates the map information for the current map in the broadcast state by finding the selected map from the available maps based on the provided `mapId`, and then updating the corresponding map entry in the `maps` array of the broadcast state with the new map details (such as `mapId`, `mapName`, and `imageUrl`). This method is typically triggered by a user action, such as selecting a different map from a dropdown menu in the edit menu of the map card. When invoked, it ensures that the broadcast state reflects the new map selection, allowing users to manage and customize the maps being played in the broadcast effectively.
   * @param mapId The unique identifier of the selected map, which is used to find the corresponding map details from the `availableMaps` array and update the current map's state in the broadcast accordingly. This parameter is essential for ensuring that the correct map information is applied to the current map in the broadcast when a user makes a selection.
   */
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

  /**
   * Updates the mode information for the current map in the broadcast state by finding the selected mode from the available modes based on the provided `modeId`, and then updating the corresponding map entry in the `maps` array of the broadcast state with the new mode details (such as `modeId` and `modeName`). This method is typically triggered by a user action, such as selecting a different mode from a dropdown menu in the edit menu of the map card. When invoked, it ensures that the broadcast state reflects the new mode selection for the current map, allowing users to manage and customize both the maps and modes being played in the broadcast effectively.
   * @param modeId The unique identifier of the selected mode, which is used to find the corresponding mode details from the `availableModes` array and update the current map's state in the broadcast accordingly. This parameter is essential for ensuring that the correct mode information is applied to the current map in the broadcast when a user makes a selection, allowing for accurate representation of the game mode being played on that map. 
   */
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

  /**
   * Toggles the visibility of the edit menu for the map card. When this method is called, it inverts the current value of `showEditMenu`, allowing users to open or close the edit menu by clicking an "Edit" button or similar UI element on the map card. This provides an interactive way for users to access the settings and options for managing the map's state within the broadcast, such as changing the selected map, mode, or winner.
   */
  openEditMenu(): void {
    this.showEditMenu = true;
  }

  /**
   * Closes the edit menu for the map card by setting `showEditMenu` to `false`. This method is typically triggered by a user action, such as clicking a "Close" button within the edit menu or clicking outside the menu area. When invoked, it ensures that the edit menu is hidden from view, allowing users to exit the editing interface for the map card and return to the main display of the map information in the broadcast.
   */
  closeEditMenu(): void {
    this.showEditMenu = false;
  }
}
