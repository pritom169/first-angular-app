import { Component, inject } from '@angular/core';
import { InvesmentResult } from './investment-results.model';
import { InvestmentResultsService } from './investment-results.service';

@Component({
  selector: 'app-investment-results',
  standalone: false,
  templateUrl: './investment-results.component.html',
  styleUrl: './investment-results.component.css'
})

export class InvestmentResultsComponent {
  private investmentResultsService = inject(InvestmentResultsService);

  get investmentResults(): InvesmentResult[] {
    const userInput = this.investmentResultsService.getUserInput();
    if (!userInput) {
      return [];
    }
    return this.investmentResultsService.calculateInvestmentResults(userInput);
  }
}
