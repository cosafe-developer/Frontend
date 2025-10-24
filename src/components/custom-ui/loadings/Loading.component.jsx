import { ClipLoader } from "react-spinners";

export default function LoadingComponent() {
  return (
    <div
      className="h-screen w-full flex flex-col gap-y-8 text-center justify-center items-center"
    >
      <ClipLoader size={50} color="#155DFC" />
    </div>
  );
}