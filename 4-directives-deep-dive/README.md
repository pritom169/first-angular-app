# Directives

In Angular, directives are special markers or instructions in the DOM (like HTML attributes or elements) that tell Angular to do something with the DOM element

## Directives

### 1. Structural Directive

When we add ngModel to email, password or dropdown for two way binding, it does not bring it's own component.

If we look at the DOM elements, ngModel adds many css classes. Thus two way binding is not the only responsbility of ngModel.

In other words, ngModel allows to enhance the input fields.

ngModel is also a perfect example of attribute directive which change the appearance or behavior of an element, component, or another directive.
