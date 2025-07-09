import { Component, ViewEncapsulation, input, HostBinding, HostListener, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'control',
    '(click)' : 'onClick()'
  }
})

export class ControlComponent {
  // @HostBinding('class') className = 'control';
  // @HostListener('click') onClick() {
  //   console.log('Control clicked!')
  // }
  label = input.required<string>();
  private el = inject(ElementRef);

  onClick() {
    console.log('Control clicked!');
    console.log(this.el);
  }
}

