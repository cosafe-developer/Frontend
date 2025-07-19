import logoSrc from "assets/logo.png";
import { Progress } from "components/ui";

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
      <div className="flex flex-col gap-y-4">
        <img src={logoSrc} alt="logo-cosafe" className="h-auto w-14" />
        <Progress
          color="primary"
          isIndeterminate
          animationDuration="1s"
          className="mt-2 h-1"
        />
      </div>
    </div>
  );
}