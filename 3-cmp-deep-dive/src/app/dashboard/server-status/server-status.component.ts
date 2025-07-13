import { Component, DestroyRef, signal, OnInit, inject, effect } from '@angular/core';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css'
})
export class ServerStatusComponent implements OnInit{
  currentStatus  = signal<'online' | 'offline' | 'unknown'>('online');
  // injecting the DestroyRef service using Angular’s inject() function
  private destroyRef = inject(DestroyRef);

  // In TypeScript, typeof is a type query operator that lets you get the type of a variable, function, or expression.
  // private interval?: ReturnType<typeof setInterval>;

  constructor() {
    // console.log(this.currentStatus);
    effect(() => {
      console.log(this.currentStatus());
    })
  }

  ngOnInit() {
    console.log('ON INIT');

    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.5) {
        this.currentStatus.set('online');
      } else if (random < 0.8) {
        this.currentStatus.set('offline');
      } else {
        this.currentStatus.set('unknown');
      }
    }, 5000);

// register a callback that will run when the component is destroyed (e.g. when it’s removed from the DOM).
// This callback clears the interval, preventing memory leaks or background logic from continuing to run unnecessarily.

    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
    });
  }

  ngAfterViewInit(){
    console.log('After view init.');
  }

  // ngOnDestroy(): void {
  //   console.log('After view init.');
  //   clearTimeout(this.interval);
  // }
}
