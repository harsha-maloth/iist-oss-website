import { MemberPage } from "../components/Gate";
import { ProjectEditor } from "../components/ProjectEditor";
import { EDITOR } from "../text/pages";
import { UI } from "../text/site";

export default function EditProject() {
  return (
    <MemberPage title={EDITOR.title}>
      <ProjectEditor backTo="/account" backLabel={UI.myProjects} afterDelete="/account" />
    </MemberPage>
  );
}
