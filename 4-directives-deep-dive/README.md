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

### 3. Building a custom attribute directive

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

### Directives and Dependency Injection

In the previous approach, we have accessed the link through this method,

```ts
const address = (event.target as HTMLAnchorElement).href;
(event.target as HTMLAnchorElement).href =
  address + "?from=" + this.queryParam();
return;
```

Now let's try a better approach

```ts
private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);
const address = this.hostElementRef.nativeElement.href;
this.hostElementRef.nativeElement.href = address + '?from=' + this.queryParam();
```

Through this approach we are injecting dependency which makes it much easier to write test. In addition to that, we are also using Typesafety rather than casting it as HTMLAnchorElement.

### Building a custom structural directive

We can generate a new directive using `ng g d auth/auth --skip-tests`. In the new directive we will create an input variable with alias and will also inject **AuthService** into it.

Inside the constructor variable, we will include an effect funciton as it will have a reactive relation with the signal value. Thus when the value of userType changes and the effect funcitons get called.

Last but not the least, in order to see the change, we need to import that in the appcomponent and in the template file simply write `<p appAuth="admin">Only admins should see this!</p>`.

### ng-template

In Angular, `ng-template` is a structural element that defines a template block of HTML which is not redered directly to the DOM unless explicitly told to do so by Angular.

In our case we are using custom directive `appAuth`, which controls whether or not the content inside <ng-template> is rendered based on the user's permission.

```html
<!-- app.component.html -->
<ng-template appAuth="admin">
  <p>Only admins should see this text!</p>
</ng-template>
```

In the `auth.directive.ts`, the code look like

```ts
export class AuthDirective {
  userType = input.required<Permission>({ alias: "appAuth" });
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      if (this.authService.activePermission() === this.userType()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
```

Let's look at this code. We have injected two properties

1. **TemplateRef** - TemplateRef represents the template block (the <ng-template> contents) — it’s a reference to the HTML we want to conditionally render.
2. **ViewContainerref** - ViewContainerRef is the placeholder in the DOM where Angular will insert or clear views.

As a result, when the directive gets initialized, the viewContainerRef initially clears the DOM and when the user input changes it renders it according to the rule.

---

There is a syntectical sugar, we can replace <ng-content> by. Here is a short demo. We simply put `*` before the directive identifier and we have to pass the input value inside a single quotation mark.

```html
<!-- app.component.html -->
<p *appAuth="'admin'" class="protected-content admin">
  Only admins should see this!
</p>
```

### Log Directive

Let's create a directive whose responsiblity will be to log when it gets initialized. We will create the directive by using the `ng g d log --skip-tests`. In the directive, we will add a click listener to the host.

In order to use it, we will first import it in the `learning-resources.component.ts` file and afterwards we embedd it inside a tag,

```html
<!-- learning-resources.component.html -->
<p appLog>
  Helpful resources you might want to use in addition to this course.
</p>
```

We can also do the same in appcomponent.
