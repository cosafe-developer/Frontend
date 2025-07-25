import { Page } from "components/shared/Page";
import AgentesHeader from "./header/AgentesHeader";
import AgenteTabla from "./table";

export default function Agentes() {
  return (
    <Page title="Agentes">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] py-4">
          <AgentesHeader />
        </div>
        <AgenteTabla />
      </div>
    </Page>
  );
}
