import React from 'react';
import { SessionItem } from "./SessionItem";
import { useSessionContext } from "../../contexts/SessionContext";

const SessionManager: React.FC = () => {
  const { sessions, currentSession, setCurrentSession } = useSessionContext();

  return (
    <div>
      {sessions.map((s) => (
        <SessionItem
          key={s.id}
          session={s}
          isActive={currentSession ? currentSession.id === s.id : false}
          onClick={() => setCurrentSession(s)}
        />
      ))}
    </div>
  );
};

export default SessionManager;
