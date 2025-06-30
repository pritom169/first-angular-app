import { Component, Input, Output, EventEmitter, output} from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  @Input({required: true}) user!: {
    id: string;
    avatar: string;
    name: string;
  }
  @Output() select = new EventEmitter<string>();

  get imagePath(): string {
    return "users/" + this.user.avatar;
  }

  onSelectUser():void {
    this.select.emit(this.user.id);
  }
}
