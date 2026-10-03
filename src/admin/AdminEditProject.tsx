import { ProjectEditor } from "../components/ProjectEditor";
import { ADMIN } from "../text/admin";

export default function AdminEditProject() {
  return <ProjectEditor backTo="/admin/projects" backLabel={ADMIN.projects.title} afterDelete="/admin/projects" />;
}
