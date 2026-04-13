import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CustomersService } from '../../../../shared/services/customers.service';
import { CustomerItem } from '../../models/customer.models';

@Component({
  selector: 'app-customers-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers-list-page.component.html',
  styleUrl: './customers-list-page.component.scss',
})
export class CustomersListPageComponent {
  private readonly customersService = inject(CustomersService);
  private readonly router = inject(Router);

  customers: CustomerItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor() {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customersService
      .getCustomers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (customers) => {
          this.customers = customers;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load customers.';
        },
      });
  }

  getStatusClass(value: string): string {
    return `status-pill status-pill--${value}`;
  }

  openCustomerDetail(id: string): void {
    this.router.navigateByUrl(`/customers/${id}`);
  }
}
