import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css'
})
export class ServerStatusComponent implements OnInit, OnDestroy{
  currentStatus: 'online' | 'offline' | 'unknown'  = 'online';
  private interval?: ReturnType<typeof setInterval>;

  constructor() {
    
  }

  ngOnInit() {
    console.log('ON INIT');

    this.interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.5) {
        this.currentStatus = 'online';
      } else if (random < 0.8) {
        this.currentStatus = 'offline';
      } else {
        this.currentStatus = 'unknown';
      }
    }, 5000
    )
  }

  ngAfterViewInit(){
    console.log('After view init.');
  }

  ngOnDestroy(): void {
    console.log('After view init.');
    clearTimeout(this.interval);
  }
}
