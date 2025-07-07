import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import { HeaderComponent } from "./header/header.component";
import { UserInputComponent } from "./user-input/user-input.component";
import { InvestmentResultsComponent } from "./investment-results/investment-results.component";

import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";

@NgModule({
    declarations: [AppComponent, HeaderComponent, UserInputComponent, InvestmentResultsComponent],
    imports: [BrowserModule, FormsModule, CurrencyPipe],
    bootstrap: [AppComponent]
})

export class AppModule {
    
}