import { Directive } from "@angular/core";

@Directive({
    selector: 'a[appSafeLink]',
    standalone: true
})
export class SafeLinkDirective {
    constuctor() {
        console.log("SafeLinkDirective is active");
    }
}