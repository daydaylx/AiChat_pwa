import React from "react";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <button
        className={styles.menuBtn}
        aria-label="Open Menu"
        onClick={onMenuClick}
        tabIndex={0}
      >
        <span className={styles.menuIcon}></span>
      </button>
      <span className={styles.title}>{t("app_title")}</span>
      <div className={styles.headerSpacer} />
    </header>
  );
};

export default Header;
