import React from "react";
import styles from "./SessionManager.module.css";
import SessionItem from "./SessionItem";
import { useSessionContext } from "../../contexts/SessionContext";
import { useTranslation } from "react-i18next";

const SessionManager: React.FC = () => {
  const { sessions, activeSessionId, selectSession, createSession, deleteSession } = useSessionContext();
  const { t } = useTranslation();

  return (
    <div className={styles.sessionManagerRoot}>
      <div className={styles.sessionList}>
        {sessions.length === 0 && (
          <div style={{ textAlign: "center", opacity: 0.5, marginTop: 12 }}>
            {t("session_manager_title")}
            <br />
            <span style={{ fontSize: "0.93em", color: "#999" }}>{t("new_chat_button")}</span>
          </div>
        )}
        {sessions.map((s) => (
          <SessionItem
            key={s.id}
            session={s}
            active={s.id === activeSessionId}
            onSelect={() => selectSession(s.id)}
            onDelete={() => deleteSession(s.id)}
          />
        ))}
      </div>
      <button className={styles.newChatButton} onClick={createSession}>
        ＋ {t("new_chat_button")}
      </button>
    </div>
  );
};

export default SessionManager;
