import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { TransfersService } from '../../../../shared/services/transfers.service';
import { TransferItem } from '../../models/transfer.models';

@Component({
  selector: 'app-transfers-list-page',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './transfers-list-page.component.html',
  styleUrl: './transfers-list-page.component.scss',
})
export class TransfersListPageComponent {
  private readonly transfersService = inject(TransfersService);

  transfers: TransferItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor() {
    this.loadTransfers();
  }

  loadTransfers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.transfersService
      .getTransfers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (transfers) => {
          this.transfers = transfers;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load transfers.';
        },
      });
  }

  getStatusClass(value: string): string {
    return `status-pill status-pill--${value}`;
  }

  getRiskClass(value: string): string {
    return `risk-pill risk-pill--${value}`;
  }
}
