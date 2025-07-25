import { NProgress } from "components/shared/NProgress";
import { GhostSpinner } from "components/ui";

const LoadingContent = ({ texto = "Cargando contenido" }) => {
  return <>
    <NProgress isAnimating={true} />
    <div className="flex flex-col gap-y-6 items-center justify-center">
      <GhostSpinner
        className="size-20 shrink-0 border-2"
        variant="soft"
      />
      <h2
        className="text-2xl font-bold text-white"
      >
        {texto}
      </h2>
    </div>
  </>
}

export default LoadingContent;