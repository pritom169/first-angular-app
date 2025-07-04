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

## Working with Potential undefined values

When working with TypeScript inside angular, we should give some attention to what type we are setting for variables.

Let's look at our `tasks.component.ts`, where we have declared name Input. However, the name input can be empty. Hence, we are setting this as Optional.

```ts
export class TasksComponent {
  // @Input({required: True}) name!: string;
  @Input() name?: string;
}
```

Also inside the `app.component.ts`, we need to remove the "!", as we are not absolutely whether the find function will return something or not.

```ts
get selectedUser() {
    // return this.users.find((user) => user.id === this.selectedUserId)!;
    return this.users.find((user) => user.id === this.selectedUserId);
  }
```

Now comes to the `app.component.html` where we should take care of the selected user value if it is undefined.

```ts
<app-header />

<main>
  <ul id="users">
  <--Rest of the HTML previusly mentioned-->
  </ul>

  <app-tasks [name]="selectedUser ? selectedUser.name : ' '" />
</main>
```

## Accepting Objects as Inputs and Adding appropiate typing

We have seen Type declaring with TS, however it is not limited to `string`. We can declare custom types also.
In the `app.component.ts` we will declare user type, and changed the subsequent parameters.

```ts
export class UserComponent {
  @Input({ required: true }) user!: {
    id: string;
    avatar: string;
    name: string;
  };
  @Output() select = new EventEmitter<string>();

  get imagePath(): string {
    return "users/" + this.user.avatar;
  }

  onSelectUser(): void {
    this.select.emit(this.user.id);
  }
}
```

The `user.component.html` should also reflect.

```ts
//user.component.html
<div>
  <button (click)="onSelectUser()">
    <img [src]="imagePath" [alt]="user.name" />
    <!--In order to access the signal value, we use parentheses. It gives access to the real signal value.-->
    <span>{{ user.name }}</span>
  </button>
</div>
```

In the `app.component.html`, we should also bind the [user] to the user property.

```ts
//app.component.html
<app-header />

<main>
  <ul id="users">
    <li>
      <app-user [user]="users[0]" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [user]="users[1]" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [user]="users[2]" (select)="onSelectUser($event)" />
    </li>
    <li>
      <app-user [user]="users[3]" (select)="onSelectUser($event)" />
    </li>
  </ul>

  <app-tasks [name]="selectedUser ? selectedUser.name : ''" />
</main>
```

## Type Aliases and Interfaces

Now we will replace custom type which looks not very nice, we can replace that type aliases or interface.

```ts
import { Component, Input, Output, EventEmitter, output } from "@angular/core";

// type User = {
//   id: string;
//   avatar: string;
//   name: string;
// }

interface User {
  id: string;
  avatar: string;
  name: string;
}

// Rest of the code

export class UserComponent {
  @Input({ required: true }) user!: User;

  // Rest of the previous code
}
```

## Outputting List Content

In the `app.component.ts` file, we have statically redered a list, however in real life there can be hundred of elements if not thousand. So we need to reder list dynamically. Here is how we can render a list in dynamic fashion.

```ts
<app-header />

<main>
  <ul id="users">
    @for (user of users; track user.id) {
    <li>
      <app-user [user]="user" (select)="onSelectUser($event)" />
    </li>
    }
  </ul>

  <app-tasks [name]="selectedUser ? selectedUser.name : ''" />
</main>
```

@for (user of users; track user.id) - This is Angular's new control flow directive that replaces the older \*ngFor. It iterates through an array called users, assigning each individual user object to the variable user during each iteration. The track user.id part is a performance optimization that tells Angular to use the user's ID as a unique identifier - this helps Angular efficiently update the DOM when the list changes by tracking which specific items were added, removed, or reordered rather than re-rendering the entire list.

## Outputting conditional content

In real project we have to render comment on a conditional basis. In this case, there will be no selectedUser initially, however when a user is selected then we can show the user name. Here is the code to implement it.

```ts
// app.component.html

// Rest of the code mentioned above

  @if (selectedUser) {
  <app-tasks [name]="selectedUser ? selectedUser.name : ''" />
  } @else {
  <p id="fallback">Select a user to see their tasks!</p>
  }
</main>
```

Since, initially there will be no selectedUser, hence we will also make that optional in the `app.component.ts` file.

## Legacy Angular using ngFor & ngIf

We have generated list and conditional state using the new way. However, there is an old way of generating list and conditional statement.

1. First we have to import `ngFor` and `ngIf`, in the `app.component.ts` file by writing this line `import { NgFor, NgIf} from '@angular/common';`
2. Once components has been imported, we also have to add them in @Component decorator inside imports.

```ts
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, UserComponent, TasksComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
```

3. Here is the full code including **ngFor & nfIf** inside the `app.component.html` file.

```html
<app-header />

<main>
  <ul id="users">
    <!-- @for (user of users; track user.id) { -->
    <li *ngFor="let user of users">
      <app-user [user]="user" (select)="onSelectUser($event)" />
    </li>
    <!-- } -->
  </ul>

  <!-- @if (selectedUser) { -->
  <app-tasks *ngIf="selectedUser; else fallback" [name]="selectedUser!.name" />
  <!-- } @else { -->
  <ng-template #fallback>
    <p id="fallback">Select a user to see their tasks!</p>
  </ng-template>
  <!-- } -->
</main>
```

> *ngIf and *ngOr (Structural Directive) - This is the traditional Angular syntax that's been around since early versions. It uses the asterisk prefix and works as a structural directive that adds/removes elements from the DOM.

> When using **ngFor** we need to write the grammar inside the <li> component. When using **ngIf** things become a bit different. Let's take this example, the condition on which if will make it's decision has to be just next to it. If the condition fails, when we need the give the identifier notated by `#` just after semicolon `;`. The identifier can be an identifier for a <ng-template>

## Adding More Components to the Demo App

Since `*ngIf` and `*ngFor` is the old way of generating conditional statement and generating list, we will not continue with that.

```ts
// tasks.component.html
<section id="tasks">
  <header>
    <h2>{{ name }}'s Tasks</h2>
    <menu>
      <button>Add Task</button>
    </menu>
  </header>
</section>
```

We have just added some additional functionality, which will allow to add specific tasks for a specific users. Since the look of the code is not quite nice we will add some css from this [link](https://github.com/mschwarzmueller/angular-complete-guide-course-resources/blob/main/code-snapshots/02-essentials/27-conditionally-show-new-task-cmp/src/app/tasks/tasks.component.css)

When the `Add Task` button is pressed, the user will be shown one or more than one tasks. For that we will need a list of tasks inside the `tasks` components.

We will create a task component using `ng g c tasks/task --skip-tests`, which tells angular to create a task component inside the tasks directory.

For the time being, we will just include the styling from this [link](https://github.com/mschwarzmueller/angular-complete-guide-course-resources/blob/main/code-snapshots/02-essentials/27-conditionally-show-new-task-cmp/src/app/tasks/task/task.component.css) for the ´task.component.css´ file.

For ´task.component.html´ file, will keep it simple with the following code

```ts
//task.component.html
<article>
  <h2>TASK TITLE</h2>
  <time>TIME</time>
  <p>SUMMARY</p>
  <p class="actions">
    <button>Complete</button>
  </p>
</article>
```

As the the whole task component is a created and being styled, we can now import it in the `tasks` component just simply adding it to the imports section inside the `tasks.component.ts` file. The full code has been given just for more refernece.

```ts
//task.component.html
import { Component, Input } from "@angular/core";
import { TaskComponent } from "./task/task.component";

@Component({
  selector: "app-tasks",
  imports: [TaskComponent],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  @Input() name?: string;
}
```

Now let's add the task component as an individual task inside the `tasks.component.html`.

```html
//tasks.component.html
<section id="tasks">
  <-- Previous code mentioned above -->
  <ul>
    <li>
      <app-task />
    </li>
    <li>
      <app-task />
    </li>
    <li>
      <app-task />
    </li>
  </ul>
</section>
```

## Outputting Task Data in the Task Component

We need to filter tasks on the basis of the user ID. For that we need an input inside the task component which will give us the user id. In addition, the id and name should be mandatory as for showing the name and filtering both being both of them is absolutely necessary.

```ts
// tasks.component.ts
import { Component, Input } from "@angular/core";
import { TaskComponent } from "./task/task.component";

@Component({
  selector: "app-tasks",
  imports: [TaskComponent],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;

  tasks = [
    {
      id: "t1",
      userId: "u1",
      title: "Master Angular",
      summary: "This is the summary of task 1",
      dueDate: "2025-12-31",
    },
    // Rest of the elements
  ];

  getSelectedUserTasks() {
    return this.tasks.filter((task) => this.userId === task.userId);
  }
}
```

Now inside the `tasks.component.html` we will replace the static list with for and inside the for we will use getSelectedUserTasks() in order to have the sorted elements.

```ts
<section id="tasks">
  <header>
    <h2>{{ name }}'s Tasks</h2>
    <menu>
      <button>Add Task</button>
    </menu>
  </header>

  <ul>
    @for (task of getSelectedUserTasks(); track task.id){" "}
    {
      <li>
        <app-task />
      </li>
    }
  </ul>
</section>
```

Now we have to somehow tranfer the data from the `app.component` to `tasks.component`. For that we need to use property binding. Here is the new code for `app.component.html`.

```html
<app-header />

<main>
  <ul id="users">
    @for (user of users; track user.id) {
    <li>
      <app-user [user]="user" (select)="onSelectUser($event)" />
    </li>
    }
  </ul>

  @if (selectedUser) {
  <app-tasks [userId]="selectedUser.id" [name]="selectedUser.name" />
  } @else {
  <p id="fallback">Select a user to see their tasks!</p>
  }
</main>
```

## Outputting Task in the Task Component

Now we need to show specific task information in each task component. For that we need, a variable inside `task` component.

Without passing every other value, we can create a custom type of interface as Task. Here is the updated code.

```ts
import { Component, Input } from "@angular/core";

interface Task {
  id: string;
  userId: string;
  title: string;
  summary: string;
  dueDate: string;
}

@Component({
  selector: "app-task",
  imports: [],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.css",
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
}
```

Since we have now the task information inside the task component, we can now change the html file.

```ts
<article>
  <h2>{{ task.title }}</h2>
  <time>{{ task.dueDate }}</time>
  <p>{{ task.summary }}</p>
  <p class="actions">
    <button>Complete</button>
  </p>
</article>
```

Great. We have the total setup for the task, now we need to pass the data to task component. For that we will use the property binder inside `tasks.component.html`.

```html
<!-- tasks.component.html -->
<section id="tasks">
  <!-- As usual as the previous code -->
  <ul>
    @for (task of getSelectedUserTasks(); track task.id) {
    <li>
      <app-task [task]="task" />
    </li>
    }
  </ul>
</section>
```

## Storing Data Models in Seperate Files

As we can see both in the `task.component.ts` and `user.component.ts` the customer interface are in the same file, however we need to put them in a seperate file.

The naming convention should be `component-name.model.ts`. Inside the file there should be a export keyword.

Here is the code for `task.model.ts` and `user.model.ts`.

```ts
// task.model.ts
export interface Task {
  id: string;
  userId: string;
  title: string;
  summary: string;
  dueDate: string;
}
```

```ts
// user.model.ts
export interface User {
  id: string;
  avatar: string;
  name: string;
}
```

## Dynamic CSS styling with class binding

Now when we select an user, there is no notation that the user is selected, however when we hover over the list of users we can see a selection color.

In order to keep a selected user fix, we need to bind css style with class.

We will first go to the `user.component.ts` file and declare a Input variable as `selected` which will be boolean type.

```ts
// user.component.ts
export class UserComponent {
  @Input({ required: true }) user!: User;
  @Input({ required: true }) selected!: boolean;
  @Output() select = new EventEmitter<string>();

  get imagePath(): string {
    return "users/" + this.user.avatar;
  }

  onSelectUser(): void {
    this.select.emit(this.user.id);
  }
}
```

Now in the `user.components.html` file, we need to bind this **selected** property with a css class. Here is the full code

```html
<!-- user.component.html -->
<div>
  <button [class.active]="selected" (click)="onSelectUser()">
    <img [src]="imagePath" [alt]="user.name" />
    <!--In order to access the signal value, we use parentheses. It gives access to the real signal value.-->
    <span>{{ user.name }}</span>
  </button>
</div>
```

Since `app.component.ts` we already have the information about which user is selected. So in the `app.component.html` file we will bind the **[selected]** property to a boolean. Here is the code,

```html
<app-header />

<main>
  <ul id="users">
    @for (user of users; track user.id) {
    <li>
      <app-user
        [user]="user"
        [selected]="user.id === selectedUserId"
        (select)="onSelectUser($event)"
      />
    </li>
    }
  </ul>

  @if (selectedUser) {
  <app-tasks [userId]="selectedUser.id" [name]="selectedUser.name" />
  } @else {
  <p id="fallback">Select a user to see their tasks!</p>
  }
</main>
```

## More Component Communication: Deleting Tasks

Now when complete button is clicked, I want to delete the task from the list. For that we need a `@Output` variable inside `task.component.ts`. Now we also need to design a function which will emit the variable when it is called.

```ts
// task.component.ts
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { type Task } from "./task.model";

@Component({
  selector: "app-task",
  imports: [],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.css",
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
  @Output() complete = new EventEmitter<string>();

  onCompleteTask() {
    this.complete.emit(this.task.id);
  }
}
```

Now when the action button is called, it will call the `onCompleteTask()` funciton.

```ts
<article>
  <h2>{{ task.title }}</h2>
  <time>{{ task.dueDate }}</time>
  <p>{{ task.summary }}</p>
  <p class="actions">
    <button (click)="onCompleteTask()">Complete</button>
  </p>
</article>
```

Since `onCompleteTask()` emits the `complete` variable, it needs to reach the `tasks.component.ts` through `tasks.component.html`, and we can do that via `$event`

```html
<!-- task.component.html -->
<section id="tasks">
  <header>
    <h2>{{ name }}'s Tasks</h2>
    <menu>
      <button>Add Task</button>
    </menu>
  </header>

  <ul>
    @for (task of selectedUserTasks; track task.id) {
    <li>
      <app-task [task]="task" (complete)="onCompleteTask($event)" />
    </li>
    }
  </ul>
</section>
```

Now the data will come to `tasks.component.ts` and delete the tasks from the array

```ts
import { Component, Input } from "@angular/core";
import { TaskComponent } from "./task/task.component";

@Component({
  selector: "app-tasks",
  imports: [TaskComponent],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.css",
})
export class TasksComponent {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name!: string;

  tasks = [
    {
      id: "t1",
      userId: "u1",
      title: "Master Angular",
      summary: "This is the summary of task 1",
      dueDate: "2025-12-31",
    },
    // Rest of the elements
  ];

  get selectedUserTasks() {
    return this.tasks.filter((task) => this.userId === task.userId);
  }

  onCompleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id != id);
  }
}
```

## Creating a conditional redering another component

Now we need to add a new task when "Add Task" button is pressed. Hence we will create a new component as `new-task` and import it in the `tasks.component.ts`.

In the task `tasks.component.ts`, we will keep a flag which will tell us whether to show the dialog or not. In the `tasks.component.ts`, we will the following code at the top for the time being.

```html
@if (newTaskShown){
<app-new-task />
}
```

## Using directives and two way binding

We will use two way binding for the form. Here is the template code.

```html
<div class="backdrop" (click)="onCancel()"></div>
<dialog open>
  <h2>Add Task</h2>
  <form>
    <p>
      <label for="title">Title</label>
      <input type="text" id="title" name="title" [(ngModel)]="enteredTitle" />
    </p>

    <p>
      <label for="summary">Summary</label>
      <textarea
        id="summary"
        rows="5"
        name="summary"
        [(ngModel)]="enteredTitle"
      ></textarea>
    </p>

    <p>
      <label for="due-date">Due Date</label>
      <input
        type="date"
        id="due-date"
        name="due-date"
        [(ngModel)]="enteredTitle"
      />
    </p>

    <p class="actions">
      <button type="button" (click)="onCancel()">Cancel</button>
      <button type="submit">Create</button>
    </p>
  </form>
</dialog>
```

Let's talk about ([ngModel]). [(ngModel)] is Angular's two-way data binding syntax that creates a seamless connection between form input elements and component properties. The square brackets [] handle property binding (component to template), while the parentheses () handle event binding (template to component). When combined as [(ngModel)], they create a bidirectional flow where changes in the input field automatically update the component property, and changes to the component property automatically reflect in the input field.

FormsModule from @angular/forms is the Angular module that provides all the necessary directives and services for template-driven forms. It's what makes ngModel and other form-related directives available in your templates. Without importing FormsModule, Angular won't recognize ngModel and will throw an error.

```ts
import { Component, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-new-task",
  imports: [FormsModule],
  templateUrl: "./new-task.component.html",
  styleUrl: "./new-task.component.css",
})
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  enteredTitle = "";
  enteredSummary = "";
  enteredDate = "";

  onCancel() {
    this.cancel.emit();
  }
}
```

## Signals and Two way binding

Inorder to use signals with already implemented two way binding in the `new-task.component.ts`, you just add signal() around the empty string.

```ts
// Only the changed part of the code
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  enteredTitle = "";
  enteredSummary = "";
  enteredDate = "";
}
```

## Handling form submission

If you look at the previous code in the `new-task.component.html` you can see the following line `<button type="submit">Create</button>`. The default behavior of `type="submit"` is that when it is inside the `<form>`it will create an api call to ther service, however we don't have a service. Hence, we have to stop it.

Good thing for us, in Angular if we import [FormsModule] Angular does it for us.

However if we want to submit the information to a service, we need to declare a function. In our case we have declared "onSubmit()" in our component file. In the template, we can see `(ngSubmit)` which is a action binder, and in that we bind "onCancel()" function.

```html
<div class="backdrop" (click)="onCancel()"></div>
<dialog open>
  <h2>Add Task</h2>
  <form (ngSubmit)="onSubmit()">
    <!-- Rest of the code -->
  </form>
</dialog>
```

## Using the Submitted Data

Now let's do something for the `onSubmit()` part. When we click on submit, we need to make sure it emits a new property, named `NewTaskData`. Here is the code for explanation from `new-task.component.ts`

```ts
import { Component, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { type NewTaskData } from "./new-task.model";

@Component({
  selector: "app-new-task",
  imports: [FormsModule],
  templateUrl: "./new-task.component.html",
  styleUrl: "./new-task.component.css",
})
export class NewTaskComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() add = new EventEmitter<NewTaskData>();
  enteredTitle = "";
  enteredSummary = "";
  enteredDate = "";

  onSubmit() {
    this.add.emit({
      title: this.enteredTitle,
      summary: this.enteredSummary,
      date: this.enteredDate,
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
```

Now `new-task.component.ts` will emit the data to `tasks.component.html` file, the onAddNewTask() method will catch the event.

```html
@if (newTaskShown){
<app-new-task (cancel)="onCancelAddTask()" (add)="onAddNewTask($event)" />
}
<!-- Rest of the code mentioned above -->
```

Inside `tasks.component.ts` we will add `onAddNewTask()` which will add the elements to the tasks array.

```ts
// Rest of the previous code
  onAddNewTask(taskData: NewTaskData){
    this.tasks.push({
      id: new Date().getTime().toString(),
      userId: this.userId,
      title: taskData.title,
      summary: taskData.summary,
      dueDate: taskData.date
    });
    this.newTaskShown = false;
  }
}
```

## Content Projection with ng-content

Let's create a card component using `ng g c --shared/card`. Inside the `card` component, where I copy the following content in the `card.component.css` from `user.component.css`.

```css
div {
  border-radius: 6px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
```

In the `card.component.html`, we write the following

```html
<div>...</div>
```

Now we wrap `user.component.html` we wrap it with `app-card`

```html
<app-card>
  <button [class.active]="selected" (click)="onSelectUser()">
    <img [src]="imagePath" [alt]="user.name" />
    <!--In order to access the signal value, we use parentheses. It gives access to the real signal value.-->
    <span>{{ user.name }}</span>
  </button>
</app-card>
```

We also do the same thing with `task.component.html`. If we do that, we will see nothing in the screen as when we wrap something inside of another angular component, it consumes other component. However, the solution to this is <ng-content>.

ng-content is Angular's content projection mechanism that allows you to create reusable components with customizable content slots. It acts as a placeholder where you can insert content from a parent component into specific locations within a child component's template.

When you use ng-content in a component template, Angular will take any content placed between that component's opening and closing tags and project it into the designated slot. This creates a powerful composition pattern where components can be shells that accept and display dynamic content.

```html
<!-- card.component.html -->
<div>
  <ng-content />
</div>
```

Now if you save it, and run the application everything will be just as it was before.

## Transforming Template Data with Pipes

In the date section, inside TS we can see the date has not been organized properly. We can do that using pipe functionality. First we need to import DatePipe in the `task.component.ts`.

```ts
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [CardComponent, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})

// Rest of the code stays same
```

Now in the same template file we include date with pipe symbol.

```html
<app-card>
  <article>
    <h2>{{ task.title }}</h2>
    <time>{{ task.dueDate | date : "fullDate" }}</time>
    <p>{{ task.summary }}</p>
    <p class="actions">
      <button (click)="onCompleteTask()">Complete</button>
    </p>
  </article>
</app-card>
```

## Getting started with Services

As we can see in the `tasks.components.ts` all the tasks related functions are present. However it is not the best practise. It is always better to keep the component classes as clean as clean as possible. Hence we will outsource all the service related functionality to `tasks.service.ts`.

```ts
import { NewTaskData } from "./new-task/new-task.model";

class TasksService {
  private tasks = [
    {
      id: "t1",
      userId: "u1",
      title: "Master Angular",
      summary: "This is the summary of task 1",
      dueDate: "2025-12-31",
    },
    // Rest of the tasks
  ];

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addTask(taskData: NewTaskData, userId: string) {
    this.tasks.unshift({
      id: new Date().getTime().toString(),
      userId: userId,
      title: taskData.title,
      summary: taskData.summary,
      dueDate: taskData.date,
    });
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
```

## Getting started with dependency injection

How the dependey injection is working, we can understand it by looking at the code. Here is the code for `tasks.components.ts` and `tasks.service.ts`.

```ts
export class TasksComponent {
  constructor(private tasksService: TasksService) {
    // Rest of the code stays as it is.
  }
}
```

```ts
import { Injectable } from "@angular/core";
import { NewTaskData } from "./new-task/new-task.model";

@Injectable({ providedIn: "root" })
export class TasksService {
  // Rest of the code stays as it is
}
```

- The TasksService is injected into the component via the constructor.
- Angular's DI system sees the private tasksService: TasksService parameter and automatically provides an instance of TasksService when it creates the TasksComponent.
- The @Injectable({providedIn: 'root'}) decorator in TasksService tells Angular to create a single, shared instance (singleton) of this service for the whole app.

> Dependency injection (DI) is a design pattern where an object receives (is "injected" with) its dependencies from an external source rather than creating them itself. In Angular, DI is used to provide services and other dependencies to components and other services, making code more modular, testable, and maintainable.

## Saving data into local storage

As we have seen the tasks data stays as it it when we reload the website regardless if we created new task or not. Hoever, we can do that using using localStorage. Here is the code snippet for `task.service.ts`.

```ts
import { Injectable } from "@angular/core";
import { NewTaskData } from "./new-task/new-task.model";

@Injectable({ providedIn: "root" })
export class TasksService {
  private tasks = [
    {
      id: "t1",
      userId: "u1",
      title: "Master Angular",
      summary: "This is the summary of task 1",
      dueDate: "2025-12-31",
    },
  ];

  constructor() {
    const tasks = localStorage.getItem("tasks");
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addTask(taskData: NewTaskData, userId: string) {
    // Rest of the code
    this.saveTasks();
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }

  private saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
}
```
