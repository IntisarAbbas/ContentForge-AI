import { motion } from "framer-motion";

function StatsCard({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <div
        className="h-2 w-20 rounded-full mb-5"
        style={{ background: color }}
      />

      <h4 className="text-zinc-400 text-sm">{title}</h4>

      <h1 className="text-4xl font-bold mt-3">{value}</h1>
    </motion.div>
  );
}

export default StatsCard;