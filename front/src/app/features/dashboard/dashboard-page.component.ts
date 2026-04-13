import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DashboardSummary } from './models/dashboard.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);

  summary: DashboardSummary | null = null;
  isLoading = true;
  errorMessage = '';

  constructor() {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService
      .getSummary()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (summary) => {
          this.summary = summary;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load dashboard summary.';
        },
      });
  }

  get statCards() {
    return [
      {
        title: 'Customers',
        value: this.summary?.totals.customers ?? 0,
        subtitle: 'Onboarding pipeline',
      },
      {
        title: 'Accounts',
        value: this.summary?.totals.accounts ?? 0,
        subtitle: 'Digital accounts',
      },
      {
        title: 'Cards',
        value: this.summary?.totals.cards ?? 0,
        subtitle: 'Issued cards',
      },
      {
        title: 'Transfers',
        value: this.summary?.totals.transfers ?? 0,
        subtitle: 'Processed transfers',
      },
      {
        title: 'Incidents',
        value: this.summary?.totals.incidents ?? 0,
        subtitle: 'Operational cases',
      },
      {
        title: 'Unread alerts',
        value: this.summary?.totals.unreadNotifications ?? 0,
        subtitle: 'Pending notifications',
      },
    ];
  }
}
