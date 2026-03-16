"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const Photo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { delay: 0.3, duration: 0.5, ease: "easeOut" },
      }}
      className="relative"
    >
      <div className="w-[120px] h-[120px] xl:w-[160px] xl:h-[160px] rounded-full overflow-hidden ring-4 ring-soft ring-offset-4 ring-offset-background">
        <Image
          src="/assets/photo.png"
          priority
          quality={100}
          fill
          alt="Aminat Moldalieva"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
};
