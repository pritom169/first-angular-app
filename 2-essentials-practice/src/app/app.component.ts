import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { UserInputComponent } from "./user-input/user-input.component";
import { UserInput } from "./user-input/user-input.model";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [HeaderComponent, UserInputComponent],
})
export class AppComponent {
  userInevestmentData?: UserInput;
  
  onSubmitInvestmentData(userInput: UserInput): void {
    this.userInevestmentData = userInput;
  }
}
