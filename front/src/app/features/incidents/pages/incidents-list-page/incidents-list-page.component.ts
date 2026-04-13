import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { IncidentsService } from '../../../../shared/services/incidents.service';
import { IncidentItem } from '../../models/incident.models';

@Component({
  selector: 'app-incidents-list-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './incidents-list-page.component.html',
  styleUrl: './incidents-list-page.component.scss',
})
export class IncidentsListPageComponent {
  private readonly incidentsService = inject(IncidentsService);

  incidents: IncidentItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor() {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.incidentsService
      .getIncidents()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (incidents) => {
          this.incidents = incidents;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load incidents.';
        },
      });
  }

  getStatusClass(value: string): string {
    return `status-pill status-pill--${value}`;
  }

  getPriorityClass(value: string): string {
    return `priority-pill priority-pill--${value}`;
  }
}
