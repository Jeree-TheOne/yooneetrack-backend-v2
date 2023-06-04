export default interface PersonalTask {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  deadline: Date;
  isDone: boolean;
  isImportant: boolean;
  isUrgent: boolean;
}