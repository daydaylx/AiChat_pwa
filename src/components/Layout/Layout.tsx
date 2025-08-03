import React from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, sidebar, children }) => (
  <div className={styles.layoutRoot}>
    {header}
    <main className={styles.layoutMain}>
      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
      <section className={styles.content}>{children}</section>
    </main>
  </div>
);

export default Layout;
