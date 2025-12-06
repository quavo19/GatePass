import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-check-in',
  imports: [CommonModule, SidebarComponent],
  standalone: true,
  templateUrl: './check-in.component.html',
})
export class CheckInComponent {}

