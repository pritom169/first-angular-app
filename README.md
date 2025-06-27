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
