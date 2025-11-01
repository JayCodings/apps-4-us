import { motion } from "framer-motion";

export interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({ fullScreen = false, message = "Loading..." }: LoadingProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-discord-primary z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-discord-blurple rounded-full"
              animate={{
                y: [-10, 0, -10],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-discord-text-normal"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    </div>
  );
}