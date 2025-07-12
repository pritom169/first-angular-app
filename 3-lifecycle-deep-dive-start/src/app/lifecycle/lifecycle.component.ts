import {
  Component,
  Input,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  imports: [],
  templateUrl: './lifecycle.component.html',
  styleUrl: './lifecycle.component.css',
})
export class LifecycleComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input() text?: string;

  // 3. Constructor is not a Angular property, it's a general TS an JS property. As a result, when we do something complex it is recommended not to do it inside constructor. It is rather recommended to do it inside 'ngOnInit()'. ngOnInit() is also the place where one should do all the compone initializazion work.
  constructor() {
    console.log('CONSTRUCTOR');
    console.log(this.text);
  }

  ngOnInit() {
    console.log('ngOnInit');
    console.log(this.text);
  }

// 1. ngOnChanges() life cycle hook method gets triggered when the input variable gets changed. During initialization "ngOnChanges()" runs before ngOnInit()
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    console.log(changes);
  }
// 5. ngDoCheck() runs everytime when Angular things there is a change in the entire applicaiton not only in the component. Hence it is recommended not to use it unless you have to.
  ngDoCheck() {
    console.log('ngDoCheck');
  }
  
  // In order to understand the all the ngAfter methods we need to understand what content and what view is.
  // 1. A view in Angular is the template rendered by a component. It represents the internal structure (DOM) managed and rendered by Angular for a given component.
  // In other withInterceptorsFromDi, view is the component's template.
  // 2. Content refers to the projected content passed from a parent component into a child component using <ng-content>. It's a part of Angular's content projection mechanism.
  // In other words, content might be the content that has been projected inside the view like <ng-content>

  // The content methods gets initialized, when any projected content gets initialized.
  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }

  // The ngAfterContentInit method runs once after all the children nested inside the component (its content) have been initialized.
  ngAfterContentChecked() {
    console.log('ngAfterContentChecked');
  }

  // The view methods includes all the element in the template including the contents also.
  // The ngAfterViewInit method runs once after all the children in the component's template (its view) have been initialized.
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  // The ngAfterContentInit method runs once after all the children nested inside the component (its content) have been initialized.
  // The ngAfterViewChecked method runs every time the children in the component's template (its view) have been checked for changes.
  ngAfterViewChecked() {
    console.log('ngAfterViewChecked');
  }

// 2. ngOnDestroy() life cycle hook gets called when the component lifecycle is about to be destroyed.
  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}