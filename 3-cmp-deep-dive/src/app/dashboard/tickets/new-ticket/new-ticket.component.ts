import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../shared/button/button.component";
import { ControlComponent } from "../../../shared/control/control.component";

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, ControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})

export class NewTicketComponent {
  // @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  // @ViewChild lets you query a DOM element or Angular component from your template and access it in your component class after view initialization.
  // 'form' — matches the #form in the template.
  // Optional (?) means it might not be available at first.
  // ElementRef<T> — gives you access to the actual DOM element.

  private form = viewChild<ElementRef<HTMLFormElement>>('form');
  // This is a new signal-based ViewChild in Angular 17+ (no decorator needed).
  // `viewChild` returns a signal function you can call like `this.form()` to get the reference.
  // Works only after the view is initialized.

  onSubmit(input: string, text: string){
    console.log(input);
    console.log(text);

    this.form()?.nativeElement.reset();
    // Use nativeElement to directly call DOM methods like reset().
    // Safe access with optional chaining (?.) in case it's undefined.
  }
}
