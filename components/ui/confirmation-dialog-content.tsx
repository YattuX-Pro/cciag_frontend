import { motion } from "framer-motion";

interface ConfirmationDialogContentProps {
  title: string;
  amount?: number;
  description?: string;
}

export function ConfirmationDialogContent({ title, amount, description }: ConfirmationDialogContentProps) {
  return (
    <>
      <div className="text-cyan-700 dark:text-cyan-300 font-semibold text-lg mb-4">
        {title}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 py-4"
      >
        <div className="space-y-2">
          {description && (
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          )}
          {amount && (
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-2xl font-bold text-center p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300"
            >
              {amount.toLocaleString()} GNF
            </motion.p>
          )}
        </div>
      </motion.div>
    </>
  );
}
