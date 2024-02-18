import { TaskPrioritiesEnum } from '../enums/task-priorities.enum';

export interface ITask {
  id?: string;
  date: Date;
  title: string;
  description?: string;
  priority: TaskPrioritiesEnum;
  userId: string;
}
