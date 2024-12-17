'use client'

import { useEffect } from "react";
import styles from "./page.module.scss";
import { useRouter } from "@/i18n/routing";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/landing')
  }, [])

  return (
    <div className={styles.page}>
    </div>
  );
}
