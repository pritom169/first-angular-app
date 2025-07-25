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
