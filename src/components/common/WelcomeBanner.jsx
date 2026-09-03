import { motion } from "framer-motion";

function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        relative
        isolate
        w-full
        min-w-0
        overflow-hidden
        rounded-[30px]
        bg-gradient-to-r
        from-violet-700
        via-fuchsia-700
        to-cyan-600
        px-5
        py-8
        sm:px-8
        sm:py-10
        lg:px-10
        lg:py-12
      "
    >
      <div className="relative z-10 min-w-0">
        <h2 className="text-2xl font-black sm:text-4xl lg:text-5xl">
          Welcome to
        </h2>

        <h1 className="mt-2 break-words text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
          ContentForge AI 🚀
        </h1>

        <p className="mt-4 max-w-3xl break-words text-sm leading-6 text-white/80 sm:text-base lg:text-lg">
          One AI platform for social media content, fashion ideas,
          website design, blogs, emails, code generation and much more.
        </p>
      </div>
    </motion.div>
  );
}

export default WelcomeBanner;