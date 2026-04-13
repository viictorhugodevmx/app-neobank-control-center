import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { AccountsService } from '../../../../shared/services/accounts.service';
import { AccountItem } from '../../models/account.models';

@Component({
  selector: 'app-accounts-list-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './accounts-list-page.component.html',
  styleUrl: './accounts-list-page.component.scss',
})
export class AccountsListPageComponent {
  private readonly accountsService = inject(AccountsService);

  accounts: AccountItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor() {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.accountsService
      .getAccounts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load accounts.';
        },
      });
  }

  getStatusClass(value: string): string {
    return `status-pill status-pill--${value}`;
  }
}
