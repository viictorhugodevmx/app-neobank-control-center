import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  TransferItem,
  TransfersApiResponse,
} from '../../features/transfers/models/transfer.models';

@Injectable({
  providedIn: 'root',
})
export class TransfersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getTransfers(): Observable<TransferItem[]> {
    return this.http
      .get<TransfersApiResponse>(`${this.apiUrl}/transfers`)
      .pipe(map((response) => response.data));
  }
}
