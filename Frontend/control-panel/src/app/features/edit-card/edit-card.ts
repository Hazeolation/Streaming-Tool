import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-card',
  imports: [],
  templateUrl: './edit-card.html',
  styleUrl: './edit-card.scss',
})
export class EditCard {
  @Output() onCloseClick = new EventEmitter<void>();
  @Output() onModeChange = new EventEmitter<string>();
  @Output() onDeleteMap = new EventEmitter<void>();

  closeEditMenu() {
    this.onCloseClick.emit();
  }

  changeMode(mode: string) {
    this.onModeChange.emit(mode);
  }

  deleteMap() {
    this.onDeleteMap.emit();
  }
}
