import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-card',
  imports: [],
  templateUrl: './edit-card.html',
  styleUrl: './edit-card.scss',
})
export class EditCard {
  /**
   * Event emitter that is triggered when the close button of the edit card is clicked. This allows parent components to listen for this event and perform actions such as closing the edit menu or performing cleanup tasks when the user finishes editing a map. The `onCloseClick` event emitter is of type `void`, indicating that it does not emit any data when triggered, and is used solely as a signal to indicate that the close action has occurred.
   */
  @Output() onCloseClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Event emitter that is triggered when the mode selection is changed in the edit card. This allows parent components to listen for this event and update the broadcast state with the new mode selection for the current map. The `onModeChange` event emitter emits a string value representing the selected mode, which can be used by the parent component to identify which mode was selected and apply the necessary changes to the broadcast state accordingly.
   */
  @Output() onModeChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Event emitter that is triggered when the delete action is initiated for the current map in the edit card. This allows parent components to listen for this event and remove the current map from the broadcast state when the user decides to delete it. The `onDeleteMap` event emitter is of type `void`, indicating that it does not emit any data when triggered, and is used solely as a signal to indicate that the delete action has occurred, prompting the parent component to perform the necessary state updates to reflect the removal of the map from the broadcast.
   */
  @Output() onDeleteMap: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Closes the edit menu for the map card by emitting the `onCloseClick` event. This method is typically triggered by a user action, such as clicking a "Close" button within the edit menu. When invoked, it signals to parent components that the user has finished editing and wishes to close the edit interface, allowing the parent component to perform any necessary cleanup or state updates to reflect that the edit menu should no longer be displayed.
   */
  closeEditMenu(): void {
    this.onCloseClick.emit();
  }

  /**
   * Changes the mode for the current map by emitting the `onModeChange` event with the selected mode as its payload. This method is typically triggered by a user action, such as selecting a different mode from a dropdown menu in the edit menu of the map card. When invoked, it signals to parent components that the user has selected a new mode for the current map, allowing the parent component to update the broadcast state accordingly to reflect the new mode selection for that map in the broadcast.
   * @param mode The unique identifier of the selected mode, which is emitted as the payload of the `onModeChange` event. This parameter is essential for ensuring that the correct mode information is communicated to parent components when a user makes a selection, allowing for accurate updates to the broadcast state based on the user's choice.
   */
  changeMode(mode: string): void {
    this.onModeChange.emit(mode);
  }

  /**
   * Deletes the current map from the broadcast state by emitting the `onDeleteMap` event. This method is typically triggered by a user action, such as clicking a "Delete" button in the edit menu of the map card. When invoked, it signals to parent components that the user has decided to remove the current map from the broadcast, allowing the parent component to perform the necessary state updates to reflect the removal of the map from the broadcast.
   */
  deleteMap(): void {
    this.onDeleteMap.emit();
  }
}
