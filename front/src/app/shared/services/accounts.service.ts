import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  AccountItem,
  AccountsApiResponse,
} from '../../features/accounts/models/account.models';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAccounts(): Observable<AccountItem[]> {
    return this.http
      .get<AccountsApiResponse>(`${this.apiUrl}/accounts`)
      .pipe(map((response) => response.data));
  }
}
