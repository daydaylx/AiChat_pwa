import React from "react";
import styles from "./Layout.module.css";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;
