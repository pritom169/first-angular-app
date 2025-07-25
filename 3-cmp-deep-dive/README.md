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

## Advanced Content Projection using ngProjectAs

### **What Changed:**

### **Before (CSS class selector):**

```html
<!-- Component template -->
<ng-content select=".icon" />

<!-- Usage -->
<span class="icon">→</span>
```

### **After (ngProjectAs):**

```html
<!-- Component template -->
<ng-content select=".icon" />

<!-- Usage -->
<span ngProjectAs="icon">→</span>
```

## **Key Benefits of ngProjectAs:**

### **1. Separation of Concerns**

**CSS classes** should be for styling, **ngProjectAs** should be for content organization:

```html
<!-- With CSS class - mixing concerns -->
<span class="icon primary-color large">→</span>
<!-- Is "icon" for styling or projection? Confusing! -->

<!-- With ngProjectAs - clear separation -->
<span ngProjectAs="icon" class="primary-color large">→</span>
<!-- Clear: ngProjectAs=projection, class=styling -->
```

### **2. Prevents CSS Conflicts**

Using CSS classes for projection can cause unintended styling issues:

```css
/* If you have this CSS rule */
.icon {
  display: block;
  font-size: 20px;
  color: red;
}
```

**With class selector:**

```html
<span class="icon">→</span>
<!-- Gets the CSS styling automatically -->
```

**With ngProjectAs:**

```html
<span ngProjectAs="icon">→</span>
<!-- No automatic CSS styling -->
```

### **3. More Flexible Content Types**

`ngProjectAs` works with any element type, not just those that can have the specific class:

```html
<!-- These all project to the same slot -->
<span ngProjectAs="icon">→</span>
<i ngProjectAs="icon">→</i>
<img ngProjectAs="icon" src="arrow.png" />
<svg ngProjectAs="icon">...</svg>

<!-- vs CSS class approach where you'd need: -->
<span class="icon">→</span>
<i class="icon">→</i>
<img class="icon" src="arrow.png" />
<!-- Might conflict with image styles -->
```

### **4. Clear Intent and Readability**

`ngProjectAs` makes the projection intent explicit:

```html
<!-- Clear projection intent -->
<button app-button>
  Save Document
  <span ngProjectAs="icon">💾</span>
  <span ngProjectAs="badge">New</span>
</button>

<!-- vs CSS classes where intent is less clear -->
<button app-button>
  Save Document
  <span class="icon">💾</span>
  <span class="badge">New</span>
  <!-- Is this for styling or projection? -->
</button>
```

### **5. Component Template Control**

Your component can now fully control the styling of projected content:

```html
<!-- button.component.html -->
<span> <ng-content /> </span>
<span class="icon"> <ng-content select=".icon" /> </span>
<!--      ↑ Component applies icon styling, not the projected content -->
```

**Result:**

- The component wraps icon content in a `<span class="icon">`
- The projected content doesn't need any styling classes
- Consistent icon styling across all button instances

### **6. Better Maintainability**

If you need to change the projection selector, you only change the component:

```html
<!-- Change from .icon to [slot="icon"] -->
<ng-content select="[slot='icon']" />

<!-- Usage changes from: -->
<span ngProjectAs="icon">→</span>
<!-- To: -->
<span slot="icon">→</span>
```

## Multi-Element Custom Components & Content Projection

### **Component Definition:**

```typescript
// control.component.ts
export class ControlComponent {
  label = input.required<string>(); // Signal input for the label text
}
```

### **Component Template:**

```html
<!-- control.component.html -->
<p>
  <label>{{ label() }}</label>
  <ng-content select="input, textarea" />
  <!-- Projects input OR textarea -->
</p>
```

**Key points:**

- `{{ label() }}` displays the label text from the signal input
- `select="input, textarea"` specifically targets `<input>` and `<textarea>` elements
- Wraps everything in a `<p>` for consistent form styling

## **Usage in NewTicketComponent:**

### **Text Input:**

```html
<app-control label="Title">
  <input name="title" id="title" />
</app-control>
```

**Rendered Result:**

```html
<p>
  <label>Title</label>
  <input name="title" id="title" />
</p>
```

### **Textarea:**

```html
<app-control label="Description">
  <textarea name="description" id="description" rows="3"></textarea>
</app-control>
```

**Rendered Result:**

```html
<p>
  <label>Description</label>
  <textarea name="description" id="description" rows="3"></textarea>
</p>
```

## **Content Projection Benefits Here:**

### **1. Flexible Input Types**

The `select="input, textarea"` selector allows the component to work with different form elements:

```html
<!-- All of these work -->
<app-control label="Name">
  <input type="text" />
</app-control>

<app-control label="Email">
  <input type="email" />
</app-control>

<app-control label="Password">
  <input type="password" />
</app-control>

<app-control label="Comments">
  <textarea rows="5"></textarea>
</app-control>
```

### **2. Maintains Form Element Attributes**

The actual `<input>` or `<textarea>` keeps all its native attributes:

```html
<app-control label="Phone">
  <input
    type="tel"
    name="phone"
    id="phone"
    required
    pattern="[0-9]{10}"
    placeholder="1234567890"
  />
</app-control>
```

### **3. Consistent Form Layout**

Every form control gets the same structure:

- Consistent `<p>` wrapper
- Label always comes first
- Input/textarea always comes second

### **4. Reusable Form Pattern**

Instead of repeating this pattern everywhere:

```html
<!-- Without ControlComponent - repetitive -->
<p><label>Title</label><input name="title" /></p>
<p><label>Description</label><textarea name="description"></textarea></p>
<p><label>Email</label><input type="email" name="email" /></p>
```

You get this clean, reusable pattern:

```html
<!-- With ControlComponent - clean and consistent -->
<app-control label="Title">
  <input name="title" />
</app-control>
<app-control label="Description">
  <textarea name="description"></textarea>
</app-control>
<app-control label="Email">
  <input type="email" name="email" />
</app-control>
```

## **Why This Pattern Works Well:**

### **1. Semantic Preservation**

The projected `<input>` and `<textarea>` elements maintain their semantic meaning and accessibility features.

### **2. Form Integration**

Native form elements work seamlessly with:

- Form validation
- Form submission
- Browser autofill
- Screen readers

### **3. Styling Control**

The component can apply consistent styling to the wrapper while allowing customization of individual inputs:

```css
/* control.component.css - affects all controls */
p {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
```

### **4. Extensibility**

You could easily extend this pattern:

```html
<!-- control.component.html - enhanced version -->
<p>
  <label>{{ label() }}</label>
  <ng-content select="input, textarea, select" />
  <!-- Add select support -->
  <ng-content select=".help-text" />
  <!-- Add help text slot -->
  <ng-content select=".error" />
  <!-- Add error message slot -->
</p>
```

This `ControlComponent` demonstrates how content projection creates **composable, reusable UI patterns** that enhance developer experience while maintaining the flexibility and semantic correctness of native HTML elements.

## Configuiring View Encapsulation

Let's add this CSS to `control.component.css`.

```css
.control label {
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.15rem;
  color: #4f4b53;
}

.control input,
.control textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  font-size: 0.9rem;
  color: #4f4b53;
}
```

Now let's change the class inside the component class,

```html
<!-- control.component.html -->
<p class="control">
  <label>{{ label() }}</label>
  <ng-content select="input, textarea" />
</p>
```

If we run the project, we see only the change in the label but not in the inputs. In Angular when we write CSS inside a component, the CSS styling is enclosed in the component. In order to make it universal such that the child component of 'app-control' can also have the effect of styling, we need to go to `control.component.ts` and change the encapsulation criteria.

```ts
//control.component.ts
@Component({
  selector: 'app-control',
  imports: [],
  standalone: true,
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.None
})
```

As a result, the content which will be projected in the place of <ng-content> will now have the styling effect inside the control component

## Component Host Elements

### 🔸 What is `:host` in Angular?

In Angular, `:host` is a **CSS selector** that refers to the **element in the parent template** where the **component is applied** — i.e., the **host element** of the component.

It is part of Angular’s **Shadow DOM-style scoping** system for component styles.

---

### 📌 Basic Definition:

If you’re writing CSS inside a component's style file (or inside `styles` of `@Component`), `:host` targets the DOM element where this component is _used_, not inside its template.

---

### 🔍 Context: What is the Host Element?

> The **host element** is the element in the parent DOM tree that represents the component.

### In your case:

```ts
@Component({
  selector: 'button[app-button], a[app-button]',
  ...
})
export class ButtonComponent {}
```

And this usage:

```html
<button app-button>Click me</button>
```

Here:

- `<button>` is the **host element**
- `app-button` is the selector that triggers Angular to replace it with your component’s logic/template/styles
- So inside your `button.component.css`, `:host` will refer to this `<button>` element

---

### 🎯 Use Cases of `:host`

#### ✅ 1. **Styling the host element itself**

```css
:host {
  display: block;
  padding: 1rem;
  border-radius: 4px;
}
```

This makes sure that the element (`<button app-button>`) gets styled even though you're not directly styling `button`.

#### ✅ 2. **State-based styling like hover or focus**

```css
:host:hover {
  background-color: blue;
}
```

Means: when the user hovers over the host element (`<button app-button>`), apply this style.

#### ✅ 3. **Style projected content inside the host**

This one is very relevant in your case:

```css
:host:hover .icon {
  transform: translateX(4px);
}
```

This combines host state (`hover`) with inner content (`.icon`), giving nice control over styling based on interaction.

---

### 🛡️ Why Not Just Use `button:hover .icon`?

Because Angular **encapsulates component styles**, normal selectors like `button:hover .icon` won’t affect the **host element** itself. Angular adds unique attributes (e.g., `_nghost`, `_ngcontent`) to scope styles. That’s why you need `:host`.

---

### 🧱 `:host` vs. Other Selectors

| Selector            | Targets                          | Used For                                         |
| ------------------- | -------------------------------- | ------------------------------------------------ |
| `:host`             | The host element itself          | Styling the outer shell of the component         |
| `:host(:hover)`     | Host element on hover            | Trigger interaction styles                       |
| `.className`        | Elements _inside_ the component  | Styling elements inside your template            |
| `:host(.someClass)` | Host element _if_ it has a class | Conditional host styling based on external class |

---

### 🔁 Summary: Why Use `:host`?

- It’s the only way to style the host element _from within the component_.
- Makes your component **encapsulated** but **interactive** with the outside.
- Enables clean API design: the outside world controls class names/attributes; the component handles logic and style.

---

## More Host Component Styling

In the `control.component.ts` we can see the label and inputs which has been encapsulated into a p-tag. As a result, in the browser it creates an unnecesarry DOM element inside the <app-control>.

```html
<p>
  <label>{{ label() }}</label>
  <ng-content select="input, textarea" />
</p>
```

If we remove the p-tag, the styling gets lost. However we can still continue styling by styling the host. Here is the new code

```html
<!-- new-ticket.component.html -->
<app-control class="control" [label]="'Description'">
  <textarea name="description" id="description" rows="3"></textarea>
</app-control>
```

## Host component styling inside the component.

As you can see in the host component styling example, in the parenet component inside the <app-control> we have to include `class="control"` which we can easily forget. However, we can remove that and put the attribute inside the @Component decorator.

```ts
//control.component.ts
@Component({
  selector: 'app-control',
  imports: [],
  standalone: true,
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'control'
  }
})
```

## Accessing Host element Programmatically

If we want to get access to the component's host DOM element, we can do it programatically.

```ts
//control.component.ts
@Component({
  selector: "app-control",
  imports: [],
  standalone: true,
  templateUrl: "./control.component.html",
  styleUrl: "./control.component.css",
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "control",
    "(click)": "onClick()",
  },
})
export class ControlComponent {
  label = input.required<string>();
  private el = inject(ElementRef);

  onClick() {
    console.log(`Control clicked`);
    console.log(this.el);
  }
}
```

Concepts:

- inject() is the function-based DI (dependency injection) syntax.

- ElementRef gives direct access to the component's host DOM element.

Why it matters:

- This avoids constructor injection boilerplate.

- ElementRef lets you access low-level DOM APIs (e.g. for measuring, styling).

## Angular Class Binding

### ✅ What is Angular Class Binding?

**Class binding** lets you **add or remove CSS classes dynamically** based on conditions in your component.

---

### 🧩 Syntax:

```html
<div [class.className]="condition"></div>
```

➡️ Adds `className` to the element **if `condition` is true**.

---

### 🧠 Why Use It?

- To apply styles based on component state (`isActive`, `status`, etc.)
- Keeps templates clean and reactive
- No need to manually toggle classes in TS

---

### 🔥 Example:

```html
<div [class.error]="hasError">Error!</div>
```

✅ If `hasError = true`, then HTML becomes:

```html
<div class="error">Error!</div>
```

❌ If `hasError = false`, no class is added.

---

Here is the code from `server-status.component.html`,

```html
<div [class.status]="currentStatus === 'online'">
  @if (currentStatus === 'online') {
  <p>Servers are online</p>
  <p>All systems are operational.</p>
  } @else if (currentStatus === 'offline') {
  <p>Servers are offline</p>
  <p>Functionality should be restored soon.</p>
  } @else {
  <p>Server status is unknown</p>
  <p>Fetching server status failed.</p>
  }
</div>
```

## Object-based class binding

Here is the example of Object-based class binding.

```html
<div
  [class]="{
    status: true,
    'status-online': currentStatus === 'online',
    'status-offline': currentStatus === 'offline',
    'status-unknown': currentStatus === 'unknown'
  }"
>
  <!-- Rest of the code -->
</div>
```

In browser it would be generated as

```html
<div class="status status-online">
  <p>Servers are online</p>
  <p>All systems are operational.</p>
</div>
```

## Component Lifecycle

### ngOnInit

Let's put a interval funciton inside the constructor. Here is the sample code.

```ts
//server-status.component.ts
export class ServerStatusComponent {
  currentStatus: "online" | "offline" | "unknown" = "online";

  constructor() {
    setInterval(() => {
      const randomNum = Math.random();
      if (randomNum < 0.33) {
        this.currentStatus = "online";
      } else if (randomNum < 0.66) {
        this.currentStatus = "offline";
      } else {
        this.currentStatus = "unknown";
      }
    }, 5000);
  }
}
```

Everytime the ServerStatusComponent class gets initialized, this function will run. However, there is another problem.

If the setInterval function was dependent on some input component, the function would not have worked properly.

In order to make sure, the funciton `setInterval()` runs only after the all the input value gets initialized we have to input a lifecycle hook, `ngOnInit()`. Inside the ngOnInit() we will paste the setInterval function.

It will not necesarily change the course of the applicaiton, but it makes sure all the inputs have been initialized first in order to run all the funtions properly.

## Implemneting Lifecylce Interfaces

Problem: server-status component file has ngOnIt() function, however if we change it to ngonIt(), the compiler will not show any error, as angular allows any name methods to be implemented inside component class.

Solution: In order to catch this error we need to implement OnInit interface which will force us to use ngOnInit(), otherwise it will show an error

```ts
export class ServerStatusComponent implements OnInit {
  // Rest of the code goes here
}
```

## ✅ Lifecycle Hooks

Angular components go through a lifecycle — from **creation**, to **rendering**, to **updating**, and finally to **destruction**. Angular provides **lifecycle hook interfaces** and methods to let you tap into these phases and execute custom logic at each step.

---

### 📘 Lifecycle Hook Sequence

Here is the typical **order of lifecycle hooks** for a component:

```bash
constructor
ngOnChanges
ngOnInit
ngDoCheck
ngAfterContentInit
ngAfterContentChecked
ngAfterViewInit
ngAfterViewChecked
ngOnDestroy
```

Let's break them down in detail 👇

---

### 🔹 1. `constructor()`

- **Called**: When the class is instantiated.
- **Use it for**: Basic dependency injection, not for component logic or DOM interaction.
- **Avoid**: Accessing `@Input()` properties or manipulating DOM.

```ts
constructor(private service: MyService) {
  console.log('Constructor called');
}
```

---

### 🔹 2. `ngOnChanges(changes: SimpleChanges)`

- **Interface**: `OnChanges`
- **Called**: Every time `@Input()` properties change, **even before `ngOnInit()`**.
- **Use it for**: Reacting to changes in input-bound properties.

```ts
ngOnChanges(changes: SimpleChanges): void {
  console.log('OnChanges', changes);
}
```

> ✅ Called multiple times in the component’s lifetime if inputs change.

---

### 🔹 3. `ngOnInit()`

- **Interface**: `OnInit`
- **Called**: Once, after the first `ngOnChanges()`.
- **Use it for**: Initialization logic, data fetching, `@Input()` processing.

```ts
ngOnInit(): void {
  console.log('Component initialized');
}
```

> ✅ Best place to do setup after inputs are set but before rendering.

---

### 🔹 4. `ngDoCheck()`

- **Interface**: `DoCheck`
- **Called**: During every change detection run.
- **Use it for**: Custom change detection logic.

```ts
ngDoCheck(): void {
  console.log('DoCheck - custom change detection');
}
```

> ⚠️ Use sparingly. Can cause performance issues if overused.

---

### 🔹 5. `ngAfterContentInit()`

- **Interface**: `AfterContentInit`
- **Called**: Once, after Angular projects external content (`<ng-content>`).
- **Use it for**: Initialization dependent on projected content.

```ts
ngAfterContentInit(): void {
  console.log('AfterContentInit');
}
```

---

### 🔹 6. `ngAfterContentChecked()`

- **Interface**: `AfterContentChecked`
- **Called**: Every time the projected content is checked.
- **Use it for**: Responding to changes in projected content.

```ts
ngAfterContentChecked(): void {
  console.log('AfterContentChecked');
}
```

---

### 🔹 7. `ngAfterViewInit()`

- **Interface**: `AfterViewInit`
- **Called**: Once, after component's view (and child views) has been initialized.
- **Use it for**: DOM access via `@ViewChild()` or `@ViewChildren`.

```ts
@ViewChild('inputEl') inputEl!: ElementRef;

ngAfterViewInit(): void {
  this.inputEl.nativeElement.focus();
}
```

---

### 🔹 8. `ngAfterViewChecked()`

- **Interface**: `AfterViewChecked`
- **Called**: After every check of the component’s view.
- **Use it for**: Responding to changes in the view.

```ts
ngAfterViewChecked(): void {
  console.log('AfterViewChecked');
}
```

> ⚠️ Avoid DOM manipulations here unless necessary. Can run often.

---

### 🔹 9. `ngOnDestroy()`

- **Interface**: `OnDestroy`
- **Called**: Just before Angular destroys the component.
- **Use it for**: Cleanup (unsubscribe, detach event handlers, clear intervals).

```ts
ngOnDestroy(): void {
  this.subscription.unsubscribe();
  console.log('Component destroyed');
}
```

---

### 🔁 Lifecycle Hook Call Chart

```plaintext
(1) constructor
(2) ngOnChanges (if @Input)
(3) ngOnInit
(4) ngDoCheck
(5) ngAfterContentInit
(6) ngAfterContentChecked
(7) ngAfterViewInit
(8) ngAfterViewChecked
(9) ngOnDestroy (on destroy)
```

---

### ✅ Best Practices

| Lifecycle Hook    | Best Practice                                  |
| ----------------- | ---------------------------------------------- |
| `ngOnInit`        | Use for component setup, API calls             |
| `ngOnChanges`     | Track changes to `@Input()` data               |
| `ngOnDestroy`     | Unsubscribe from Observables, clear timers     |
| `ngAfterViewInit` | Access DOM elements with `@ViewChild`          |
| `ngDoCheck`       | Avoid unless custom change detection is needed |

---

## DestroyRef

### 🔥 `DestroyRef` in Angular (introduced in Angular 16+)

`DestroyRef` is a **newer Angular API** that provides a powerful and type-safe way to **register cleanup logic** for a component, directive, or service — without needing to manually implement the `OnDestroy` lifecycle hook.

---

## ✅ What is `DestroyRef`?

`DestroyRef` is a **destruction token** that allows you to:

- Register cleanup callbacks (`onDestroy()`),
- Know when a context (component, directive, injectable) is destroyed,
- Replace the need for `ngOnDestroy()` in many cases.

---

## 🧠 Why use `DestroyRef`?

Traditionally, you'd do cleanup like this:

```ts
@Component({...})
export class MyComponent implements OnDestroy {
  ngOnDestroy() {
    console.log('cleanup logic');
  }
}
```

But with `DestroyRef`, you **don’t need to implement `OnDestroy` manually**. Instead, you can inject `DestroyRef` and register a teardown callback.

---

## 🔧 How to use `DestroyRef`

### ✅ In Components or Directives

```ts
import { Component, inject, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-my",
  standalone: true,
  template: `<p>Hello!</p>`,
})
export class MyComponent {
  destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      console.log("Component destroyed!");
    });
  }
}
```

---

## 🔄 `DestroyRef` vs `ngOnDestroy`

| Feature       | `DestroyRef`                        | `ngOnDestroy()`            |
| ------------- | ----------------------------------- | -------------------------- |
| Code coupling | Decouples cleanup from class        | Requires class method      |
| Composition   | Easy to register multiple callbacks | Harder in nested setups    |
| RxJS support  | Built-in `takeUntilDestroyed()`     | Needs custom Subject logic |
| Available in  | Angular 16+                         | All versions               |

---

## 🧱 Use Cases

- ✅ Cleanup timers / intervals
- ✅ Auto-unsubscribe from Observables
- ✅ Dispose of services, sockets, DOM listeners
- ✅ Works in **signals**, **injectables**, and **effects**

---

## ngSubmit

ngSubmit is an Angular directive used on <form> elements. It triggers an event when the form is submitted.

```html
<form (ngSubmit)="onSubmit()"></form>
```

How it works:

1. It only works with Angular forms.
2. It prevents the default HTML form submission.
3. It calls the method in your component (onSubmit()).

## Template variable

### ✅ Template Variable in Angular — Context of Your Code

In Angular, a **template variable** (also called a **template reference variable**) is a way to **reference a DOM element or component** in your template and pass it around — typically to your component logic.

---

### 🔹 In the Code:

```html
<input name="title" id="title" #inputTitle />
```

Here, `#inputTitle` is a **template variable**.

---

### 🔍 What it does:

- Declares a **reference to the `<input>` element**.
- Makes the DOM element accessible **within the same template**.
- You can use it to **pass the element** (or its value) to a method.

---

## Extracting values from template variables

If we want to extract the template variable values inside the template, we can simply type `templateViable.value`. The code from `new-ticket.component.html` will explain it better.

```html
<form (ngSubmit)="onSubmit(inputTitle.value, inputText.value)">
  <app-control [label]="'Title'">
    <input name="title" id="title" #inputTitle />
  </app-control>

  <app-control [label]="'Description'">
    <textarea
      name="description"
      id="description"
      rows="3"
      #inputText
    ></textarea>
  </app-control>
  <!-- Rest of the code -->
</form>
```

## Template Reference Variable

When you assign a **template reference variable (`#var`)** to a **component**, you're not referencing the HTML element in the DOM — you're referencing the **Angular component instance itself**.

---

### 🔹 Example 1: Template Variable on a Native Element

```html
<input #inputRef />
```

- `#inputRef` points to the **HTMLInputElement**
- You can access `.value`, `.focus()`, etc.

---

### 🔹 Example 2: Template Variable on a Component

```html
<app-control #ctrlRef></app-control>
```

- `#ctrlRef` points to the **`ControlComponent` class instance** (not an HTML element)
- You can access **public methods/properties** defined in `ControlComponent`, like:

```ts
ctrlRef.someMethod(); // ✅
ctrlRef.nativeElement; // ❌ (doesn't exist unless you expose it)
```

---

Please look at the code from `new-ticket.component.html`,

```html
<p>
  <button app-button #btn>
    Submit
    <span ngProjectAs="icon">→</span>
  </button>
</p>
```

#btn will not give us access to the HTMLElemenet, rather it will give access to the app-button component.

## TRV with @ViewChild
In your code, `@ViewChild('form') form?: ElementRef<HTMLFormElement>;` is used to get a **reference to the `<form>` element in the DOM**, allowing direct interaction with it in the `NewTicketComponent` class.

---

### 🧠 Here's what's happening step by step:

#### 1. **Template Reference Variable**

In your HTML:

```html
<form (ngSubmit)="onSubmit(inputTitle.value, inputText.value)" #form>
```

* The `#form` is a **template reference variable**.
* This reference is pointing to the **native `<form>` HTML element**.

---

#### 2. **@ViewChild in the Component**

```ts
@ViewChild('form') form?: ElementRef<HTMLFormElement>;
```

* This tells Angular: “After the view has been initialized, find the element with template variable `#form` and assign it to this property.”
* It returns an `ElementRef`, which wraps the native DOM element (`HTMLFormElement` here).
* `ElementRef.nativeElement` gives you the actual DOM node.

---

#### 3. **Using `form.nativeElement.reset()`**

```ts
this.form?.nativeElement.reset();
```

* This uses the native HTML form API to reset the form: it **clears all input and textarea values** back to their initial state.

## TRV with Signal based viewChild
### ✅ Old Way (commented out)

```ts
// @ViewChild('form') form?: ElementRef<HTMLFormElement>;
```

* This is the **classic decorator-based API**, used before Angular 17.
* You’d access `this.form?.nativeElement` once the view is initialized (after `ngAfterViewInit()`).

---

### ✅ New Way (signal-based, Angular 17+)

```ts
private form = viewChild.required<ElementRef<HTMLFormElement>>('form');
```

This is a **function-style signal-based API**, where:

* `viewChild` is a **function**, not a decorator.
* `viewChild.required()` ensures the DOM reference **must exist**, or it throws an error.
* `this.form()` gives the current value (like accessing a signal).
* The value is the `ElementRef<HTMLFormElement>`.

---

### 🔍 What Is `viewChild()`?

This is a **reactive signal API** provided by Angular to make querying DOM or component references **reactive and lazy**.

### Here's how it works:

| Concept                  | Purpose                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `viewChild()`            | Returns a **signal** that references the DOM element/component      |
| `.required<T>()`         | Enforces that the reference **must exist**, helpful for debugging   |
| `this.form()`            | You call it like a function to get the current value (like signals) |
| `.nativeElement.reset()` | Direct DOM call to reset the form (same as before)                  |

---

### ⚙️ When Does It Work?

* Like the old `@ViewChild`, this still becomes available **after view initialization** (typically in or after `ngOnInit()`).
* But since you're calling `this.form()` **on submit**, you’re safe — it will already be initialized.

---

## ViewChild vs ContentChild
### **ViewChild Example** (NewTicketComponent)
```typescript
// new-ticket.component.ts
private form = viewChild.required<ElementRef<HTMLFormElement>>('form');
```
```html
<!-- new-ticket.component.html -->
<form #form>  <!-- OWNS this element -->
  <app-control>...</app-control>
</form>
```

**What happens:**
- Searches **its own template**
- Finds the `<form>` element with `#form`
- NewTicketComponent **owns** and **controls** this form

---

### **ContentChild Example** (ControlComponent)
```typescript
// control.component.ts
private control = contentChild<ElementRef<HTMLInputElement>>('input');
```
```html
<!-- control.component.html -->
<label>{{ label() }}</label>
<ng-content select="input, textarea" />  <!-- RECEIVES projected content -->
```
```html
<!-- new-ticket.component.html (parent) -->
<app-control>
  <input #input />  <!-- GIVES this element to ControlComponent -->
</app-control>
```

**What happens:**
- Searches **projected content from parent**
- Finds the `<input>` element with `#input` that was passed in
- ControlComponent **receives** this element but doesn't own it

---

### **The Key Difference**

| Aspect | ViewChild | ContentChild |
|--------|-----------|--------------|
| **Searches In** | Own template | Projected content |
| **Ownership** | Component owns the element | Parent owns, component receives |
| **Direction** | Internal (self) | External (from parent) |
| **Your Example** | Form owns `#form` | Control receives `#input` |

**Think of it as:**
- **ViewChild**: "I'm looking for my own stuff"
- **ContentChild**: "I'm looking for what you gave me"

## Decorator based queries and Lifecycle Hooks
## Decorator-Based Queries vs Signal-Based (Your Code Uses Signals)

Your code uses **modern signal-based queries**, but let me explain the **decorator-based approach** with lifecycle hooks using your same structure:

### **@ViewChild + ngAfterViewInit Example**
```typescript
// new-ticket.component.ts (Decorator version)
export class NewTicketComponent implements AfterViewInit {
  @ViewChild('form') form?: ElementRef<HTMLFormElement>;  // Decorator approach
  
  ngAfterViewInit() {
    // form reference is NOW available
    console.log('Form element:', this.form?.nativeElement);
    // Can safely manipulate the form here
  }
  
  onSubmit() {
    this.form?.nativeElement.reset();  // Safe to use after ngAfterViewInit
  }
}
```

**Why ngAfterViewInit?**
- Component's own template (`#form`) is fully rendered
- DOM elements are created and accessible
- **Before this hook**: `this.form` would be `undefined`

---

### **@ContentChild + ngAfterContentInit Example**
```typescript
// control.component.ts (Decorator version)
export class ControlComponent implements AfterContentInit {
  @ContentChild('input') control?: ElementRef<HTMLInputElement>;  // Decorator approach
  
  ngAfterContentInit() {
    // Projected input reference is NOW available
    console.log('Projected input:', this.control?.nativeElement);
    // Can safely interact with the projected input here
  }
  
  onClick() {
    this.control?.nativeElement.focus();  // Safe to use after ngAfterContentInit
  }
}
```

**Why ngAfterContentInit?**
- Projected content (`<input #input>`) from parent is processed
- `<ng-content>` projection is complete
- **Before this hook**: `this.control` would be `undefined`

---

## **Lifecycle Timing**

```
Component Creation
      ↓
Content Projection (@ContentChild available)
      ↓
ngAfterContentInit() ← ContentChild references ready
      ↓
View Rendering (@ViewChild available)
      ↓
ngAfterViewInit() ← ViewChild references ready
```

## afterRender and afterNextRender
**When afterRender runs:**
- After every render cycle (very frequent)
- When you type in the input
- When you click to focus
- When parent component updates
- **Use case**: Monitoring DOM state, syncing with third-party libraries

---

**When afterNextRender runs:**
- ONLY once after the next render cycle
- Perfect for initialization tasks
- **Use case**: Setting up event listeners, auto-focus, third-party integrations

---

## **Comparison with Lifecycle Hooks**

```typescript
export class ControlComponent {
  constructor() {
    afterNextRender(() => {
      // Same as ngAfterViewInit
      console.log('Component initialized');
    });
    
    afterRender(() => {
      // Same as ngAfterViewChecked
      console.log('View checked');
    });
  }
}
```

**Key Difference:**
- `afterRender`: "Do this every time DOM updates"
- `afterNextRender`: "Do this once when DOM is ready"