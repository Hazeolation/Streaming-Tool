import { Component, inject, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BroadcastState } from '../../models/broadcast-state';
import { Division } from '../../models/division';
import { BroadcastStateService } from '../../services/broadcast-state';
import { Socials } from '../../models/socials';
import { SocialsService } from '../../services/socials';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the sidebar component to update its UI accordingly whenever the state changes. This setup enables the sidebar to show relevant information such as team names, scores, and other broadcast details based on the latest state received from the service. Additionally, the `availableDivisions` property is populated with the list of divisions from the service, allowing users to select or view division-related information in the sidebar.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the sidebar component to reactively update its UI whenever the broadcast state changes. This signal is used to display the current broadcast information in the sidebar, ensuring that it always reflects the most current state of the broadcast as provided by the service.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Injects the `SocialsService` to access social links such as discord server invite, twitter handle, etc. The `socials` signal is used to reactively track changes to the socials state to update the overlay accordingly
   */
  socialsService: SocialsService = inject(SocialsService);

  /**
   * A writable signal that holds the current socials state. It is initialized by referencing the `socials` signal from the `SocialsService`, allowing the end screen display component to reactively update its UI whenever the socials state changes.
   */
  socials: WritableSignal<Socials> = this.socialsService.socials;

  /**
   * An array of `Division` objects representing the available divisions in the broadcasting tool. This property is populated by referencing the `availableDivisions` property from the `BroadcastStateService`, allowing the sidebar component to display a list of divisions for users to select or view. The `Division` interface includes properties such as `id` and `name`, which are used to structure and display division information in the user interface.
   */
  availableDivisions: Division[] = this.stateService.availableDivisions;
}
