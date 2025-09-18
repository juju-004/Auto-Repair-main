import { ThemeToggle } from "./theme-toggle";

export default function DashboardNav() {
  return (
    <nav className="w-full  flex justify-center  h-16">
      <div className="w-full  flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <div className="flex items-center justify-between "></div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
