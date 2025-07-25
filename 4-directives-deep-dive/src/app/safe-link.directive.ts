import { Directive } from "@angular/core";

@Directive({
    selector: 'a[appSafeLink]',
    standalone: true,
    host: {
        '(click)': 'onConfirmLeavePage($event)'
    }
})
export class SafeLinkDirective {
    constuctor() {
        console.log("SafeLinkDirective is active");
    }

    onConfirmLeavePage(event: MouseEvent){
        const wantsToLeave = window.confirm('Do you want to leave this app?');

        if (wantsToLeave){
            return;
        }

        event?.preventDefault();
    }
}