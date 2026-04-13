import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { CardsService } from '../../../../shared/services/cards.service';
import { CardItem } from '../../models/card.models';

@Component({
  selector: 'app-cards-list-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cards-list-page.component.html',
  styleUrl: './cards-list-page.component.scss',
})
export class CardsListPageComponent {
  private readonly cardsService = inject(CardsService);

  cards: CardItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor() {
    this.loadCards();
  }

  loadCards(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cardsService
      .getCards()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (cards) => {
          this.cards = cards;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load cards.';
        },
      });
  }

  getStatusClass(value: string): string {
    return `status-pill status-pill--${value}`;
  }
}
