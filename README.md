# Introduction

## String Interpolation

String Interpolation uses double curly braces {{ }} to embed expressions directly into your HTML template. Angular evaluates the expression inside the braces and converts the result to a string, then displays it in the DOM.

For example, {{ userName }} would display the value of the userName property from your component. You can use it for simple expressions like {{ 2 + 2 }}, method calls like {{ getUserName() }}, or property access like {{ user.firstName }}.

## Property Binding

Property Binding uses square brackets [ ] around an HTML attribute or DOM property to bind it to a component property or expression. Instead of setting static values, you're dynamically assigning values from your component.

For instance, [src]="imageUrl" binds the src attribute of an img element to the imageUrl property in your component. Property binding works with any DOM property - [disabled]="isDisabled", [hidden]="shouldHide", or [className]="cssClass". Unlike string interpolation, property binding can handle non-string values directly, so you can bind boolean values, objects, or arrays without conversion.

## Getters

Getters in Angular are a powerful way to create properties that are calculated dynamically based on other component dat. They are essentially functions
that look and behave like properties, automatically recalculate when the underline data changes.

```ts
export class ProductComponent {
  products = [
    { name: "Laptop", price: 999, category: "Electronics" },
    { name: "Book", price: 15, category: "Education" },
    { name: "Phone", price: 699, category: "Electronics" },
  ];

  selectedCategory = "Electronics";

  get filteredProducts() {
    return this.products.filter((p) => p.category === this.selectedCategory);
  }

  get totalValue(): number {
    return this.filteredProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
  }

  get averagePrice(): string {
    const avg = this.totalValue / this.filteredProducts.length;
    return avg.toFixed(2);
  }
}
```

Okay, we have showed how to render dynamic events. However that is not enough. What if we need to react to events. Means if I want
to change some content of the page on the basis of the content. Here comes the event binding.

## Event Binding

Event binding in Angular is a mechanism that allows you to capture and respond to user interactions or DOM events within your components. It creates a direct connection between events that occur in the template (like clicks, key presses, or mouse movements) and methods in your component class.

```ts
export class MyComponent {
  handleClick() {
    console.log("Button was clicked!");
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log("User typed:", target.value);
  }
}
```

```ts
<!-- Template with event binding -->
<button (click)="handleClick()">Click me</button>
<input (input)="handleInput($event)" placeholder="Type something">
<div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
  Hover over me
</div>
```

Not let's combine both of them.

### Managing State and Chaning Data

By Combining both of them we can change the the user by every click

```ts
// user.component.html
<div>
    <button (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="selectedUser.name" />
        <span>{{ selectedUser.name }}</span>
    </button>
</div>

// user.component.ts
export class UserComponent {
  selectedUser = DUMMY_USERS[randomIndex];

  get imagePath(): string {
    return `users/${this.selectedUser.avatar}`;
  }

  onSelectUser():void {
    const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser = DUMMY_USERS[randomIndex];
  }
}

```

## Angular Change Detection Mechanism

In the previous lecture we learned about states. When the states are being changed in the `user.component.ts`, the change are being reflected in the UI `user.component.html`.

So when anything changes in the properties, it automatically checks whether the new change is applicable to UI elements. If that is the case, it takes the new snapshot and updates it to the UI.

Angular does all of the automatically. It does that with the help of `zone.js`.

This change mechanism of updating the UI has been there since the inception of Angular (Angular 2). However,there is a new mechanism of updating the UI. It is called `signal`

## Signal

Signal is an object that stores a value. It is sort of like a container. When a change occurs, Angular is then able to update the part of the UI that needs updating.

```ts
import { Component, computed, signal } from "@angular/core"; // Importing signal from Angular core
import { DUMMY_USERS } from "../dummy-users";

const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: "app-user",
  standalone: true,
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomIndex]); // Using signal to manage the selected user state
  imagePath = computed(() => `users/${this.selectedUser().avatar}`); // Using computed to derive the image path from the selected user

  // Since we are using signal, we can simply remove the getter and use the signal directly in the template.
  // get imagePath(): string {
  // return `users/${this.selectedUser.avatar}`;
  // }

  onSelectUser(): void {
    const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomIndex]);
    // this.selectedUser = DUMMY_USERS[randomIndex]; // This line is not needed as
    // we are using signal to manage state.
    // In order to update the selected user, we use the set method of the signal.
  }
}
```

```ts
<div>
    <button (click)="onSelectUser()">
        <img [src]="imagePath()" [alt]="selectedUser().name" />
        <!--In order to access the signal value, we use parentheses. It gives access to the real signal value.-->
        <span>{{ selectedUser().name }}</span>
    </button>
</div>
```

Look at the above code, when implementing signal we put `()` next to the signal value, just calling
it as a function. Angular creates a subscription which tells angular that when the signal value is changed, and to update the UI component.

Now let talk about the state chaning mechanism using `Zone.js`. When using `Zone.js` mechanism, the
Angular sets a invisible zone around the input (a button, or a text field). It looks around all the
components inside the Angular and checks for all the events changes and updates the components.

When it comes to computed values as mentioned above, angular makes sure only to update the imagePath
only when something inside the computed values gets updated.

In a nutshell, `signal` allows you to handle the change mechanism in a more fine grained manner.
