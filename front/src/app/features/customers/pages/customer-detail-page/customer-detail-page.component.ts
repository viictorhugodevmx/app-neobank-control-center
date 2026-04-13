import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CustomersService } from '../../../../shared/services/customers.service';
import { CustomerItem } from '../../models/customer.models';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './customer-detail-page.component.html',
  styleUrl: './customer-detail-page.component.scss',
})
export class CustomerDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customersService = inject(CustomersService);

  customer: CustomerItem | null = null;
  isLoading = true;
  errorMessage = '';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Customer id not provided.';
      this.isLoading = false;
      return;
    }

    this.loadCustomer(id);
  }

  loadCustomer(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customersService
      .getCustomerById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (customer) => {
          this.customer = customer;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to load customer detail.';
        },
      });
  }

  backToCustomers(): void {
    this.router.navigateByUrl('/customers');
  }

  getStatusClass(value: string): string {
    return `status-pill status-pill--${value}`;
  }
}
