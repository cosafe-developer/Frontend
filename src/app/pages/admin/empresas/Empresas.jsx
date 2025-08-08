import { Page } from "components/shared/Page";
import EmpresasHeader from "./header/EmpresasHeader";
import EmpresasTabla from "./table";

export default function Empresas() {
  return (
    <Page title="Empresas">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] py-4 mx-6">
          <EmpresasHeader />
        </div>
        <EmpresasTabla />
      </div>
    </Page>
  );
}
