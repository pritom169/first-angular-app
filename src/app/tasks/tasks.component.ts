import { Component, Input } from '@angular/core';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})

export class TasksComponent {
  @Input({required: true}) userId!: string;
  @Input({required: true}) name!: string;
  newTaskShown: boolean = false;
  
  constructor(private tasksService: TasksService) {}

  get selectedUserTasks() {
    return this.tasksService.getUserTasks(this.userId);
  }

  onStartAddTask(){
    this.newTaskShown = true;
  }

  onCloseTask() {
    this.newTaskShown = false;
  }
}
