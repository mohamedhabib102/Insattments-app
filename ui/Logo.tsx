"use client"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <motion.h1
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-1.5"
        dir="ltr"
      >

        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={100}
          className="w-13 rounded-lg mr-1"
        />

        <span className="text-(--main-color) font-semibold text-2xl">
        Je lis
        </span>
      </motion.h1>
    </Link>
  )
}
export default Logo;