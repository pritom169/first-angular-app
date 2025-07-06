# Angular - A complete guide

This repository is my own documentation for learning Angular from Maximila Schwarzmuller's course from Udemy. Please hop into individual components for more details.

## 1. Angular Essentials

Find a full documentation for the mentioned topics in the [readme](1-angular-essentials/README.md) file.

### Data Binding & Templates

- **String Interpolation** (`{{ }}`) - Display dynamic content in templates
- **Property Binding** (`[property]`) - Bind component properties to DOM attributes
- **Event Binding** (`(event)`) - Handle user interactions and DOM events
- **Two-Way Binding** (`[(ngModel)]`) - Synchronize data between component and template

### Component Architecture

- **Component Creation** - Building reusable UI components
- **@Input() Decorator** - Receiving data from parent components
- **@Output() & EventEmitter** - Sending data to parent components
- **Component Communication** - Parent-child data flow patterns
- **Custom Types & Interfaces** - TypeScript typing for component data

### Modern Angular Features (Signals)

- **Signals** - Reactive state management with `signal()`
- **Computed Signals** - Derived values with `computed()`
- **Signal Inputs** - Modern alternative to `@Input()` using `input()`
- **Signal Outputs** - Modern alternative to `@Output()` using `output()`
- **Change Detection** - Understanding Zone.js vs Signals

### Control Flow & Rendering

- **New Control Flow** - `@if`, `@else`, `@for` syntax (Angular 17+)
- **Legacy Directives** - `*ngIf`, `*ngFor` structural directives
- **Conditional Rendering** - Show/hide content based on conditions
- **List Rendering** - Dynamic list generation with tracking

### Advanced Component Patterns

- **Getters** - Computed properties for dynamic values
- **Dynamic CSS Styling** - Class binding with `[class.name]`
- **Content Projection** - Using `<ng-content>` for reusable components
- **Data Transformation** - Using pipes for display formatting

### Forms & User Input

- **Template-Driven Forms** - Form handling with `FormsModule`
- **Form Submission** - Handling `(ngSubmit)` events
- **Input Validation** - Required and optional inputs
- **Form Data Binding** - Two-way binding in forms

### Services & Dependency Injection

- **Service Creation** - Organizing business logic in services
- **@Injectable Decorator** - Making services available for injection
- **Dependency Injection** - Injecting services into components
- **Service Methods** - CRUD operations and data management
- **Local Storage Integration** - Persisting data in browser storage

### Module Architecture

- **Standalone Components** - Modern component architecture
- **Angular Modules** - Traditional module-based organization
- **@NgModule Decorator** - Module configuration and metadata
- **Shared Modules** - Reusable component organization
- **Feature Modules** - Grouping related functionality
- **Module Migration** - Converting between standalone and module-based

### TypeScript Integration

- **Type Aliases** - Custom type definitions
- **Interfaces** - Defining object structures
- **Generic Types** - Type safety with EventEmitter<T>
- **Required vs Optional Properties** - Input validation
- **Type Guards** - Safe type checking

### Development Patterns

- **Component Lifecycle** - Understanding component creation and updates
- **State Management** - Managing component and application state
- **Event Handling** - User interaction patterns
- **Data Flow** - Unidirectional data flow principles
- **Code Organization** - Separating concerns and maintaining clean architecture
