import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  readonly stats = [
    { title: 'Customers', value: '--', subtitle: 'Onboarding pipeline' },
    { title: 'Accounts', value: '--', subtitle: 'Digital accounts' },
    { title: 'Cards', value: '--', subtitle: 'Issued cards' },
    { title: 'Transfers', value: '--', subtitle: 'Processed transfers' },
  ];
}
