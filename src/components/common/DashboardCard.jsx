import { useNavigate } from "react-router-dom";

function DashboardCard({ title, description, Icon, path }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer min-h-190px rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-zinc-900 hover:shadow-xl hover:shadow-violet-900/20 sm:p-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/20 transition duration-300 group-hover:scale-110">
        <Icon size={28} />
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold sm:text-2xl">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-400 sm:text-base">
          {description}
        </p>

        <p className="mt-4 text-sm font-semibold text-violet-400">
          Open Tool →
        </p>
      </div>
    </div>
  );
}

export default DashboardCard;