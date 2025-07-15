# Component Deep Dive

## Project Setup

1. Created new dashboard directory structure with components:

   - dashboard/dashboard-item/ - Dashboarditem component
   - dashboard/server-status/ - Server status component
   - dashboard/tickets/ - Tickets component
   - dashboard/traffic/ - Traffic component

2. Created header component:

   - header/ directory with component files

3. Created shared components directory:
   - shared/button/ - Reusable button component
   - shared/control/ - Reusable control component

## Project compartmentalization

The whole application has been compartmentalized into

1. HeaderComponent
2. TrafficComponent
3. TicketComponent
4. ServerStatusComponent

In addition those components has also been added to `app.component.html` and imported into `app.component.ts`.

## Input Component

If we look very carefully, every dashboard item comes with a header. The header is consists of

1. A picture at the top right
2. A title at the top left

Since there is a repetition of items, we can compartmentalize it into an another component. The component will take

1. A urlString for image
2. A titleString for header

Hence we created a component inside the header folder using `ng g c dashboard/dahsboard-item --skip-tests`. Inside the component file we will paste the following code for taking inputs.

```ts
// dashboard-item.component.ts
image = input.required<{ src: string; alt: string }>;
title = input.required<string>();
```

## Dynamic image sources to the dahsboard component and incorporation to the app component

In order to incorporate the changes of to the input component, we have to include the following code to the template file. Here is the added code

```ts
//dashboard-item.component.html
<div class="dashboard-item">
  <article>
    <header>
      <img [src]="image().src" [alt]="image().alt" />
      <h2>{{ title() }}</h2>
    </header>
  </article>
</div>
```

### Component Class (TypeScript)

Signal-Based Inputs:
typescriptimage = input.required<{ src: string; alt: string}>;
title = input.required<string>();

input.required() creates required signal inputs - a new Angular feature that replaces the older @Input() decorator
These are signals, meaning they're reactive values that Angular can track for changes
input.required() makes these properties mandatory - the parent component must provide them
The generic types (<{ src: string; alt: string}> and <string>) provide TypeScript type safety

Component Decorator:

@Component configures this as a standalone component (notice imports: [] instead of being declared in a module)
selector: 'app-dahboard-item' defines the custom HTML tag name
templateUrl and styleUrl link to external template and stylesheet files

Template (HTML)
Signal Function Calls:
html<img [src]="image().src" [alt]="image().alt" />

<h2>{{ title() }}</h2>

image() and title() are function calls because signals are functions
You must call them with parentheses to get their current values
This is different from traditional @Input() properties where you'd write image.src directly

Property Binding:

[src]="image().src" binds the image source dynamically
[alt]="image().alt" binds the alt text dynamically
The square brackets [] indicate property binding (one-way data flow from component to DOM)

String Interpolation:

{{ title() }} displays the title value in the template
The double curly braces {{}} are Angular's string interpolation syntax

The whole dashboard component has been incorporated into the app template.

```ts
// app.component.html
<app-header />

<main>
  <div id="dashboard">
    <app-dashboard-item
      [image]="{ src: 'status.png', alt: 'A signal symbol' }"
      [title]="'Server Status'"
    >
      <app-server-status />
    </app-dashboard-item>

    <app-dashboard-item
      [image]="{ src: 'globe.png', alt: 'A globe' }"
      [title]="'A globe'"
    >
      <app-traffic />
    </app-dashboard-item>

    <app-dashboard-item
      [image]="{ src: 'list.png', alt: 'A list of items' }"
      [title]="'Traffic'"
    >
      <app-tickets />
    </app-dashboard-item>
  </div>
</main>
```
