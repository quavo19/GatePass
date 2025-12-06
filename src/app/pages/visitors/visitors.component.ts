import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-visitors',
  imports: [CommonModule, SidebarComponent],
  standalone: true,
  templateUrl: './visitors.component.html',
})
export class VisitorsComponent {}

