import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  CardItem,
  CardsApiResponse,
} from '../../features/cards/models/card.models';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCards(): Observable<CardItem[]> {
    return this.http
      .get<CardsApiResponse>(`${this.apiUrl}/cards`)
      .pipe(map((response) => response.data));
  }
}
