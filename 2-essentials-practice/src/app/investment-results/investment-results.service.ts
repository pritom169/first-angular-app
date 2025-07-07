import {Injectable} from '@angular/core';
import { UserInput } from '../user-input/user-input.model';
import { InvesmentResult } from './investment-results.model';

@Injectable({providedIn: 'root'})
export class InvestmentResultsService {
    private userInput?: UserInput;

    getUserInput(): UserInput | undefined {
        return this.userInput;
    }

    setUserInput(userInput: UserInput): void {
        this.userInput = userInput;
    }

    calculateInvestmentResults(userInput: UserInput): InvesmentResult[] {
        const results: InvesmentResult[] = [];
        const { initialInvestment, annualInvestment, expectedReturn, investmentDuration } = userInput;
    
        let totalInterest = 0;
        let investedCapital = initialInvestment + annualInvestment;
        let interestRate = expectedReturn / 100;
    
        for (let year = 1; year <= investmentDuration; year++) {
            const interest = investedCapital * (interestRate / 100);
            totalInterest += interest;
            const investmentValue = investedCapital + interest;
        
            results.push({
                year,
                investmentValue,
                interest,
                totalInterest,
                investedCapital
            });
        
            investedCapital = investmentValue;
        }
    
        return results;
    }
}