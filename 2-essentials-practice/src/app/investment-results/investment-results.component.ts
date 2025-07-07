import { Component, Input } from '@angular/core';
import { InvesmentResult } from './investment-results.model';
import { UserInput } from '../user-input/user-input.model';

@Component({
  selector: 'app-investment-results',
  standalone: true,
  imports: [],
  templateUrl: './investment-results.component.html',
  styleUrl: './investment-results.component.css'
})

export class InvestmentResultsComponent {
  @Input({required: true}) investmentData!: UserInput;
  investmentResults?: [InvesmentResult]

}
