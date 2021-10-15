import * as React from "react";

import styles from "./ThemeProvider.mod.css";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className={styles.theme}>{children}</div>;
}
