import { Component, computed, signal} from '@angular/core'; // Importing signal from Angular core
import { DUMMY_USERS } from '../dummy-users';

const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  selectedUser = signal(DUMMY_USERS[randomIndex]); // Using signal to manage the selected user state
  imagePath = computed(() => `users/${this.selectedUser().avatar}`); // Using computed to derive the image path from the selected user

  // Since we are using signal, we can simply remove the getter and use the signal directly in the template.
  // get imagePath(): string {
    // return `users/${this.selectedUser.avatar}`;
  // }

  onSelectUser():void {
    const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomIndex]);
    // this.selectedUser = DUMMY_USERS[randomIndex]; // This line is not needed as
    // we are using signal to manage state.
    // In order to update the selected user, we use the set method of the signal.
  }
}
