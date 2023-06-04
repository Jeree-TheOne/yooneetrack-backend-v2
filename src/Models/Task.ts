export default interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  initialAssessment: Number;
}