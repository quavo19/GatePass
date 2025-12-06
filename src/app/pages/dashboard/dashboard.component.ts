import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}

