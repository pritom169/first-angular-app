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

Absolutely — let’s dive deeper into the **`:host`** concept in Angular, as it’s crucial when building **encapsulated, reusable components** with Angular’s **View Encapsulation** model.

---

## 🔸 What is `:host` in Angular?

In Angular, `:host` is a **CSS selector** that refers to the **element in the parent template** where the **component is applied** — i.e., the **host element** of the component.

It is part of Angular’s **Shadow DOM-style scoping** system for component styles.

---

### 📌 Basic Definition:

If you’re writing CSS inside a component's style file (or inside `styles` of `@Component`), `:host` targets the DOM element where this component is _used_, not inside its template.

---

## 🔍 Context: What is the Host Element?

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

## 🎯 Use Cases of `:host`

### ✅ 1. **Styling the host element itself**

```css
:host {
  display: block;
  padding: 1rem;
  border-radius: 4px;
}
```

This makes sure that the element (`<button app-button>`) gets styled even though you're not directly styling `button`.

### ✅ 2. **State-based styling like hover or focus**

```css
:host:hover {
  background-color: blue;
}
```

Means: when the user hovers over the host element (`<button app-button>`), apply this style.

### ✅ 3. **Style projected content inside the host**

This one is very relevant in your case:

```css
:host:hover .icon {
  transform: translateX(4px);
}
```

This combines host state (`hover`) with inner content (`.icon`), giving nice control over styling based on interaction.

---

## 🛡️ Why Not Just Use `button:hover .icon`?

Because Angular **encapsulates component styles**, normal selectors like `button:hover .icon` won’t affect the **host element** itself. Angular adds unique attributes (e.g., `_nghost`, `_ngcontent`) to scope styles. That’s why you need `:host`.

---

## 🧱 `:host` vs. Other Selectors

| Selector            | Targets                          | Used For                                         |
| ------------------- | -------------------------------- | ------------------------------------------------ |
| `:host`             | The host element itself          | Styling the outer shell of the component         |
| `:host(:hover)`     | Host element on hover            | Trigger interaction styles                       |
| `.className`        | Elements _inside_ the component  | Styling elements inside your template            |
| `:host(.someClass)` | Host element _if_ it has a class | Conditional host styling based on external class |

---

## 🔁 Summary: Why Use `:host`?

- It’s the only way to style the host element _from within the component_.
- Makes your component **encapsulated** but **interactive** with the outside.
- Enables clean API design: the outside world controls class names/attributes; the component handles logic and style.

---
