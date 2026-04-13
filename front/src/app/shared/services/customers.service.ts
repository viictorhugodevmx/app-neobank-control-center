import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  CustomerDetailApiResponse,
  CustomerItem,
  CustomersApiResponse,
} from '../../features/customers/models/customer.models';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCustomers(): Observable<CustomerItem[]> {
    return this.http
      .get<CustomersApiResponse>(`${this.apiUrl}/customers`)
      .pipe(map((response) => response.data));
  }

  getCustomerById(id: string): Observable<CustomerItem> {
    return this.http
      .get<CustomerDetailApiResponse>(`${this.apiUrl}/customers/${id}`)
      .pipe(map((response) => response.data));
  }
}
