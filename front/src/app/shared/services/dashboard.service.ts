import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  DashboardSummary,
  DashboardSummaryApiResponse,
} from '../../features/dashboard/models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getSummary(): Observable<DashboardSummary> {
    return this.http
      .get<DashboardSummaryApiResponse>(`${this.apiUrl}/dashboard/summary`)
      .pipe(map((response) => response.data));
  }
}
