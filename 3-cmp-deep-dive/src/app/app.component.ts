import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ServerStatusComponent } from './dashobard/server-status/server-status.component';
import { TrafficComponent } from "./dashobard/traffic/traffic.component";
import { TicketsComponent } from './dashobard/tickets/tickets.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ServerStatusComponent, TrafficComponent, TicketsComponent],
  templateUrl: './app.component.html'
})

export class AppComponent {
  
}
