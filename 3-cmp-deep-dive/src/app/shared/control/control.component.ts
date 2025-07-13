import { Component, ViewEncapsulation, input, HostBinding, HostListener, ElementRef, inject, ContentChild, contentChild, AfterContentInit, afterNextRender, afterRender } from '@angular/core';

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

export class ControlComponent implements AfterContentInit {
  // @HostBinding('class') className = 'control';
  // @HostListener('click') onClick() {
  //   console.log('Control clicked!')
  // }
  label = input.required<string>();
  // private el = inject(ElementRef);
  // @ContentChild('input') private control?: ElementRef <HTMLInputElement | HTMLTextAreaElement>;
  private control = contentChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('input');

  constructor(){
    // All the functionalities of after Render are for the whole application not for individual component.
    // After render executes on all future changes 
    afterRender(() => {
      console.log('afterNextrender');
    })

    // AfterNextRender exectures only on the next change on entire application
    afterNextRender(() => {
      console.log('afterRender');
    })
  }

  ngAfterContentInit(): void {
    //..
  }

  onClick() {
    console.log('Control clicked!');
    // console.log(this.el);
    console.log(this.control());
  }
}

