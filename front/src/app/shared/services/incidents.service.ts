import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  IncidentItem,
  IncidentsApiResponse,
} from '../../features/incidents/models/incident.models';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getIncidents(): Observable<IncidentItem[]> {
    return this.http
      .get<IncidentsApiResponse>(`${this.apiUrl}/incidents`)
      .pipe(map((response) => response.data));
  }
}
