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

## Defining Component Inputs

Now we want to have a list of users to be shown in the page. In order to do that we need to expose
our components to others. So we are designing `@Input` decorator.

```ts
// app.component.ts
import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { DUMMY_USERS } from "./dummy-users";

@Component({
  selector: "app-root",
  imports: [HeaderComponent, UserComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  standalone: true,
})
export class AppComponent {
  users = DUMMY_USERS;
}
```

> Since need to use the dummy users variable, we will import it as mentioned. As `app.component.html` also needs the dummy users we will declare a variable "users" just to access in html component.

```ts
// app.component.html
<app-header/>

<main>
    <ul id="users">
        <li>
            <app-user [avatar] = "users[0].avatar" [name] = "users[0].name"/>
        </li>
        <li>
            <app-user [avatar] = "users[1].avatar" [name] = "users[1].name"/>
        </li>
        <li>
            <app-user [avatar] = "users[2].avatar" [name] = "users[2].name"/>
        </li>
        <li>
            <app-user [avatar] = "users[3].avatar" [name] = "users[3].name"/>
        </li>
    </ul>
</main>
```

> Here we will use the property binding (notated by []), to display dynamic content.

```ts
//users.component.ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  @Input() avatar!: string;
  @Input() name!: string;

  get imagePath(): string {
    return "users/" + this.avatar;
  }

  onSelectUser(): void {}
}
```

> Since, the avatar and the name will be set from outside, we need to set the property decorator
> as Input. We can do that, by declaring `@Input` at the front of the property. However, when we do
> that it shows us an error. We can stop the error, just by putting exclamtion (!) next to the variable
> which says that, `we are absolutely sure there will be data.`

```ts
//users.component.html
<div>
    <button (click)="onSelectUser()">
        <img [src]="imagePath" [alt]="name" />
        <!--In order to access the signal value, we use parentheses. It gives access to the real signal value.-->
        <span>{{ name }}</span>
    </button>
</div>
```

> We are chaning the name and imagePath as they are decorator value declared in `app.component.ts` file.

## Required & Optioanl Inputs

As you can see in the `users.component.ts`

```ts
@Input() avatar!: string;
@Input() name!: string;
```

However, if we miss one property in the `app.component.html`, it will just keep that property
blank.

```ts
<app-header/>

<main>
    <ul id="users">
        <li>
            <app-user [avatar] = "users[0].avatar" [name] = "users[0].name"/>
        </li>
        <li>
            <app-user [avatar] = "users[1].avatar" [name] = "users[1].name"/>
        </li>
        <li>
            <app-user [avatar] = "users[2].avatar"/>
        </li>
        <li>
            <app-user [avatar] = "users[3].avatar" [name] = "users[3].name"/>
        </li>
    </ul>
</main>
```

As we can see the third property does not have any name assigned to it. If we now see the redered UI, we will see there is no name for the third user. So we are cheating with Angular.

In order to catch that in real time so the the TS compliler understand if we missed any property, we should add `{required: true}`

```ts
@Input({required: true}) avatar!: string;
@Input({required: true}) name!: string;
```

## Using Signal Inputs

In order to change the the `zone.js` style to `Signal` we need to change couple of things
in the `user.component.ts` file.

```ts
// @Input({required: true}) avatar!: string;
// @Input({required: true}) name!: string;
avatar = input.required<string>();
name = input.required<string>();

// get imagePath(): string {
//  return "users/" + this.avatar;
// }

imagePath = computed(() => {
  return "users/" + this.avatar();
});
```

> The `input.required<string>()` is a generic inside of TS. Hence we have to declare
> in `<>`fashion.

> For a computer property, we will declare it just like we did before.

For `user.component.html`, we will do the same thing as we did before. We will add ` ()``
after all the properties accessed from the  `user.component.ts` file.

```ts
<div>
    <button (click)="onSelectUser()">
        <img [src]="imagePath()" [alt]="name()" />
        <!--In order to access the signal value, we use parentheses. It gives access to the real signal value.-->
        <span>{{ name() }}</span>
    </button>
</div>
```

> One thing to keep in mind, this Signal input value with matters inside the component.
> For this example, we don't have to perform any change in the `app.component.ts` or `app.component.html` files.

However, since there are lot of companies where still the old way of taking inputs
are still being used, I want to go back to the old style.

## Working with Outputs & Emitting Data

We have built the side menu, where there are many user components. Now when we select
a user component, the data should go outside. By emitting the data outside of the
user component, we can dynamically change the app component.

**Output** is a decorator that marks a property as an event-binding target, essentially creating a custom event that parent components can listen to. It transforms a regular property into an event emitter that can broadcast data or notifications to parent components.

**EventEmitter** is a class that provides the actual mechanism for emitting events. It's a specialized implementation of an observable that can emit values over time and allows components to subscribe to those emissions. When you create an EventEmitter, you're essentially creating a communication channel that can send data from child to parent.

```ts
// user.component.ts
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-user",
  standalone: true,
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) avatar!: string;
  @Input({ required: true }) name!: string;
  @Output() select = new EventEmitter();

  get imagePath(): string {
    return "users/" + this.avatar;
  }

  onSelectUser(): void {
    this.select.emit(this.id);
  }
}
```

> As we can see in the code `@Output() select = new EventEmitter();` is the emitter output variable. It will emit `this.select.emit(this.id)`

```ts
// app.component.html
<app-header />

<main>
  <ul id="users">
    <li>
      <app-user
        [id]="users[0].id"
        [avatar]="users[0].avatar"
        [name]="users[0].name"
        (select)="onSelectUser($event)"
      />
    </li>
    <li>
      <app-user
        [id]="users[1].id"
        [avatar]="users[1].avatar"
        [name]="users[1].name"
        (select)="onSelectUser($event)"
      />
    </li>
    <li>
      <app-user
        [id]="users[2].id"
        [avatar]="users[2].avatar"
        [name]="users[2].name"
        (select)="onSelectUser($event)"
      />
    </li>
    <li>
      <app-user
        [id]="users[3].id"
        [avatar]="users[3].avatar"
        [name]="users[3].name"
        (select)="onSelectUser($event)"
      />
    </li>
  </ul>
</main>
```

> (select) is the event binder here.

On select user, the user will emit the id. In the `app.component.ts`,
it will catch the id via onSelectUser.

$event in Angular is a special variable that represents the event object or data passed when an event is triggered. It's Angular's way of capturing and passing event information from the template to the component method.

```ts
// app.component.ts
export class AppComponent {
  users = DUMMY_USERS;

  onSelectUser(id: string): void {
    console.log("Selected User ID: ", id);
  }
}
```

## Using Output Function

output (lowercase) in Angular refers to the output signal function introduced in Angular 17+ as part of the new signal-based reactivity system. It's a modern alternative to the class-based @Output() decorator and EventEmitter pattern.

The output() function creates a signal-based event emitter that allows components to emit events to their parents, but using Angular's new signal architecture instead of the traditional decorator approach.

In the `user.component.ts` file, we replace `@Output() select = new EventEmitter();` with ` select = output<string>();` in order to make it `output` compatable.

```ts
export class UserComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) avatar!: string;
  @Input({ required: true }) name!: string;
  // @Output() select = new EventEmitter();
  select = output<string>();

  get imagePath(): string {
    return "users/" + this.avatar;
  }

  onSelectUser(): void {
    this.select.emit(this.id);
  }
}
```

However we will go back to the "@Output" as it mostly complies with `zone.js` format.

## Adding Extra Type Information to EventEmitter

As you can see when we used the `select = output<string>();` we specifically mentioned the type of the variable. In our case that is `string`. However, when using @Output decorator we did not mentioned any type.

That leads us to a problem. Inside the `user.component.ts`, in the onSelectUser function if we emit a number instead of string, it will still not show any issue. But
when we run it, we will find an error as in `app.component.ts`, inside the onSelectUser it is expecting an `integer`.

The solution would be following changes in `user.component.ts`

```ts
  @Input({required: true}) id!: string;
  @Input({required: true}) avatar!: string;
  @Input({required: true}) name!: string;
  @Output() select = new EventEmitter<string>(); //Just added the string attribute
```

## Create a Configuarable Component

We will now create a configurable component named as tasks. The responsiblity of this component is very simple. When we click on any names on the side menu, it will show the name.

First we will create a component using the command line `ng g c --skip-tests`. Let's lock in our attention to `tasks` components first. We need a property with an `@Input` decorator name, which needs to be accesible `tasks.component.html`. It also need to serve another purpose, it needs accesible via `app.component.html`.

```ts
// tasks.component.ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-tasks",
  imports: [],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  @Input({ required: true }) name!: string;
}
```

```ts
// tasks.component.html
<p>{{ name }}</p>
```

`task.component` requirements are completed. Now we somehow need to access the data from `app.component` also. For that, in the import of `app.component.ts` we will import `TaskComponent`.

We also need a variable to store the userID which we will do via
selectedUserId.

When we click on a certain user, we need to make sure to update
the user id which we are doing inside onSelectUser.

```ts
// app.component.ts
import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { DUMMY_USERS } from "./dummy-users";
import { TasksComponent } from "./tasks/tasks.component";

@Component({
  selector: "app-root",
  imports: [HeaderComponent, UserComponent, TasksComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  standalone: true,
})
export class AppComponent {
  users = DUMMY_USERS;
  selectedUserId: string = "u1";

  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId)!;
  }

  onSelectUser(id: string): void {
    this.selectedUserId = id;
  }
}
```

Now inside the `app.component.html` we need to make sure, when someone selects an user, we show only the name.

```ts
<app-header />

<main>
  <ul id="users">
    <-- The previous codes here-->
  </ul>

  <app-tasks [name]="selectedUser.name" />
</main>
```
