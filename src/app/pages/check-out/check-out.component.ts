import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-check-out',
  imports: [CommonModule, SidebarComponent],
  standalone: true,
  templateUrl: './check-out.component.html',
})
export class CheckOutComponent {}

