import { Page } from "components/shared/Page";
import OrdersDatatableV2 from "./orders-datatable-2";

export default function Home() {
  return (
    <Page title="Listado de Requerimientos">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <OrdersDatatableV2 />
      </div>
    </Page>
  );
}
