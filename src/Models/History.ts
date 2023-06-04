export default interface History {
  id: string;
  updatedFields: string[];
  fieldsValues: string[];
  previousValues: string[];
  createdAt: Date
}