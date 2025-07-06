import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
    declarations: [AppComponent, HeaderComponent],
    bootstrap: [AppComponent],
    imports: [BrowserModule, UserComponent, TasksComponent]
})

export class AppModule {

}