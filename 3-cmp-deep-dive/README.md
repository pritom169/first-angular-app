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

## Using Content Project and ng-content

If you run the project in this stage, you cannot see the anything except the header components even though we have incorporate the `app-server-status`, `app-traffic`, and `app-tickets` into the component.

The solution is to use <ng-content>.

### ng-content

ng-content is Angular's content projection mechanism that allows you to create flexible, reusable components by letting parent components inject HTML content into specific slots within a child component's template.

The new-code for dashboard item component is here.

```ts
//dashboard-item.component.html
<div class="dashboard-item">
  <article>
    <header>
      <img [src]="image().src" [alt]="image().alt" />
      <h2>{{ title() }}</h2>
    </header>
    <ng-content />
  </article>
</div>
```

After doing that you can see the, there is a duplication of title and images in the top. In order to solve it, we have to individually go into the `server-status.componenet.html`, `tickets.component.html` and `traffic.component.html`in order to remove the header components.

In a nutshell, ng-content essentially allows you to create "template holes" that parent components can fill with their own content, making your components incredibly flexible and reusable.

## Attribute Selector

If we look at the inspect element, we can see there are multiple nested button elements. It is a completly unnecessary. We can remove that using `attribute selctor`

```ts
Component({
  selector: "button[app-button]", // This is the attribute selector
  // ...
});
export class ButtonComponent {}
```

Breaking down 'button[app-button]':

- button - Must be a <button> element (element selector)
  [app-button] - Must have the app-button attribute (attribute selector)
- Combined: Only <button> elements with the app-button attribute will be enhanced by this component

Usage in Template:

- html<button app-button>Login</button>
  What happens:

- Angular finds the <button> element with app-button attribute
- It matches the 'button[app-button]' selector
- Angular enhances this existing button element with the ButtonComponent
- The button's content is replaced with your component's template

## **Component Template (Multi-Slot Projection):**

```html
<!-- button.component.html -->
<span> <ng-content /> </span>
<!-- Default slot for text -->
<ng-content select=".icon" />
<!-- Specific slot for icons -->
```

**Two projection slots:**

1. **Default slot**: `<ng-content />` - catches any content without specific selectors
2. **Icon slot**: `<ng-content select=".icon" />` - specifically targets elements with `class="icon"`

## **Usage Examples:**

### **Header Component:**

```html
<button app-button>
  Logout
  <!-- Goes to default slot -->
  <span class="icon"> ▸ </span>
  <!-- Goes to .icon slot -->
</button>
```

**Rendered Result:**

```html
<button app-button>
  <span> Logout </span>
  <!-- Default content wrapped in span -->
  <span class="icon"> ▸ </span>
  <!-- Icon content projected as-is -->
</button>
```

**Rendered Result:**

```html
<button app-button>
  <span> Submit </span>
  <!-- Default content wrapped in span -->
  <span class="icon">→</span>
  <!-- Icon content projected as-is -->
</button>
```

### **How Content Projection Works Here:**

#### **1. Selection Process:**

- Angular scans the content inside `<button app-button>...</button>`
- Content with `class="icon"` → goes to `<ng-content select=".icon" />`
- Everything else → goes to the default `<ng-content />`

### **2. Rendering Order:**

The component template determines the final order:

1. First: Default content (wrapped in `<span>`)
2. Second: Icon content (projected as-is)

### **3. Flexible Usage:**

You can use the button with different content:

```html
<!-- Just text -->
<button app-button>Save</button>

<!-- Text with icon -->
<button app-button>
  Delete
  <span class="icon">🗑️</span>
</button>

<!-- Multiple icons (all will be projected) -->
<button app-button>
  Upload
  <span class="icon">📁</span>
  <span class="icon">⬆️</span>
</button>
```
