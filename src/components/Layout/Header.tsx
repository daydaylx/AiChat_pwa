import React from "react";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.logoBox}>
        <span className={styles.logo}>🤖</span>
        <span className={styles.title}>{t("app_title")}</span>
      </div>
      <button className={styles.settingsButton} onClick={onOpenSettings} title={t("settings_title")}>
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  );
};

export default Header;
