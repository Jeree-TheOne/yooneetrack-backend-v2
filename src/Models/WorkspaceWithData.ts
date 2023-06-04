import Column from "./Column";
import Desk from "./Desk";
import Member from "./Member";
import Row from "./Row";
import Tag from "./Tag";
import TaskType from "./TaskType";
import Workspace from "./Workspace";

export default interface WorkspaceWithData extends Workspace {
  tags: Tag[];
  rows: Row[];
  columns: Column[];
  members: Member[];
  desks: Desk[];
  taskTypes: TaskType[];
}