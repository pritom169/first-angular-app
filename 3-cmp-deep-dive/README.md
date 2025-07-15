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
