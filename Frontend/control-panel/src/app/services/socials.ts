import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SocialsApi } from './socials-api';
import { Signalr } from './signalr';
import { Socials } from '../models/socials';
import { SignalrServiceConnection } from '../enums/SignalrServiceConnection';

@Injectable({
  providedIn: 'root',
})
export class SocialsService {
  private readonly api: SocialsApi = inject(SocialsApi);
  private readonly signalr: Signalr = inject(Signalr);

  /**
   * Initializes the SocialsService by setting up an effect that listens for incoming socials updates from the SignalR service.
   */
  constructor() {
    effect(() => {
      const incoming = this.signalr.liveSocials();

      if (!incoming) return;

      this.socials.set(incoming);
    });

    this.signalr.connectionType = SignalrServiceConnection.Socials;
    this.signalr.start();
  }

  /**
   * The main socials signal that holds the current socials.
   */
  socials: WritableSignal<Socials> = signal<Socials>({
    xHandle: '@Temp',
    discordInvite: 'Temp',
  });

  /**
   * Updates the socials by merging the existing socials with the provided partial socials, then sends the updated socials to the backend API.
   * @param {Partial<Socials>} partial The partial socials containing the properties to be updated in the current socials.
   */
  update(partial: Partial<Socials>): void {
    const newSocials = {
      ...this.socials(),
      ...partial,
    };

    this.socials.set(newSocials);
    this.api.updateSocials(newSocials).subscribe();
  }

  /**
   * Loads the initial broadcast state from the backend API and sets it to the state signal. This method is typically called during the initialization of components that depend on the broadcast state to ensure they have the most up-to-date information when they start.
   */
  loadInitialState(): void {
    this.api.getSocials().subscribe((socials) => {
      this.socials.set(socials);
    });
  }
}
