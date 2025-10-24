import { RiRobot2Line } from "react-icons/ri";

export default function LoadingErrorComponent() {
  return (
    <div
      className="h-screen w-full  text-black dark:text-white font-[robotSlab] flex flex-col gap-y-8 text-center justify-center items-center"
    >
      <p className="text-4xl ">Algo ha salido mal, intentalo de nuevo por favor</p>
      <RiRobot2Line size={45} />
    </div>
  );
}