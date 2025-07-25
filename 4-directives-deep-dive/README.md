# Directives

In Angular, directives are special markers or instructions in the DOM (like HTML attributes or elements) that tell Angular to do something with the DOM element

## Directives

### 1. Attribute Directive

When we add ngModel to email, password or dropdown for two way binding, it does not bring it's own component.

If we look at the DOM elements, ngModel adds many css classes. Thus two way binding is not the only responsbility of ngModel.

In other words, ngModel allows to enhance the input fields.

ngModel is also a perfect example of attribute directive which change the appearance or behavior of an element, component, or another directive.

### 2. Structural Directive

In modern day angular (After Angular 17), there are not many structural directives left. However, directives like ngFor, ngIf are called structural directive.

### 3. Custom Directive

Let's talk about building a custom directive. Let's create a file where we will follow the Angular's naming convention will be followed `directive-name.directive.ts`. We will name our file to `safe-link.directive.ts`.

Once the file has been created, we can start with @Directive decorator. Inside we have to select a `selector` which will be named `appSafeLink`. We will wrap it with `a[]` tag, as it will allow us to use it inside anchor tag <a> (a tag used for hyperlinks).

We will also put standalone as true as it the modern Angular standard. We will also add a click event to the host by mentioning it inside the host decorator. In the click event, a standard window pop up was introducded through the code. Please look at the code for more details:

```ts
import { Directive } from "@angular/core";

@Directive({
  selector: "a[appSafeLink]",
  standalone: true,
  host: {
    "(click)": "onConfirmLeavePage($event)",
  },
})
export class SafeLinkDirective {
  constuctor() {
    console.log("SafeLinkDirective is active");
  }

  onConfirmLeavePage(event: MouseEvent) {
    const wantsToLeave = window.confirm("Do you want to leave this app?");

    if (wantsToLeave) {
      return;
    }

    event?.preventDefault();
  }
}
```

Once the Directive has been created, we need to import it where we want to properly use it. Hence in the `learning-resources.component.html` we have imported `SafeLinkDirective`. After that we can mention the selector inside the <a> tag in the template file.

#### Applying custom query parameter in the custom directive

When we want to add custom query parameter in the link we can add it dynamically in the directive. Just like component we can add inputs into our custom directive.

```ts
// safe-link.directive.ts
export class SafeLinkDirective {
  queryParam = input("myapp");

  constuctor() {
    console.log("SafeLinkDirective is active");
  }

  onConfirmLeavePage(event: MouseEvent) {
    const wantsToLeave = window.confirm("Do you want to leave this app?");

    if (wantsToLeave) {
      const address = (event.target as HTMLAnchorElement).href;
      (event.target as HTMLAnchorElement).href =
        address + "?from=" + this.queryParam();
      return;
    }

    event?.preventDefault();
  }
}
```

Now can put the query param into <a> element, just how we passed input variables in componennt.

```html
<!-- learning-resouces.component.html -->
<li>
  <a href="https://angular.dev" appSafeLink [queryParam]="'myapp-docs-link'"
    >Angular Documentation</a
  >
</li>
```

---

Now let's assume you want to simplify the process even more. You want the query param as the name of your directive and just pass it in the following manner and it still works.

```html
<li>
  <a href="https://angular.dev" appSafeLink="myapp-docs-link"
    >Angular Documentation</a
  >
</li>
```

We can do it by simply adding an alias to the input `queryParam = input('myapp', {alias: 'appSafeLink'});`. Inside the component directive the input will be named as queryParam, but outside where the directive will be used the param will be `appSafeLink`
