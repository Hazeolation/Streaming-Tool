import { Component, EventEmitter, Output, inject, OnDestroy, OnInit } from '@angular/core';
import { LogService } from '../../services/log';

@Component({
  selector: 'app-edit-card',
  imports: [],
  templateUrl: './edit-card.html',
  styleUrl: './edit-card.scss',
})
export class EditCard implements OnInit, OnDestroy {
  /** Local logger instance for edit card operations. */
  private readonly log = inject(LogService);

  /** Logging scope for this component lifecycle and actions. */
  private readonly scope = this.log.beginScope('EditCard');

  /** Event emitter triggered when the close button of the edit card is clicked. */
  @Output() onCloseClick: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitter triggered when the mode selection is changed. */
  @Output() onModeChange: EventEmitter<string> = new EventEmitter<string>();

  /** Event emitter triggered when the delete action is initiated. */
  @Output() onDeleteMap: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Angular lifecycle hook called when the component is initialized.
   */
  ngOnInit(): void {
    this.log.info('EditCard initialized');
  }

  /**
   * Close the edit menu and emit the close event.
   */
  closeEditMenu(): void {
    this.log.debug('Close edit menu clicked');

    this.onCloseClick.emit();

    this.log.trace('Close event emitted');
  }

  /**
   * Change the edit mode and close the menu.
   * @param mode {string} The new mode to select.
   */
  changeMode(mode: string): void {
    this.log.info('Mode change triggered', { mode });

    this.onModeChange.emit(mode);
    this.onCloseClick.emit();

    this.log.debug('Mode change + close emitted', { mode });
  }

  /**
   * Emit the delete map action when the user confirms deletion.
   */
  deleteMap(): void {
    this.log.warn('Delete map triggered');

    this.onDeleteMap.emit();

    this.log.trace('Delete event emitted');
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.info('EditCard destroyed');
    this.scope.dispose();
  }
}
