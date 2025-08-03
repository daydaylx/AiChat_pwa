import React from 'react';
import Layout from './components/Layout/Layout';
import ChatView from './components/Chat/ChatView';
import { Message } from './types';

const messages: Message[] = []; // Typisiert, jetzt beschwert sich TS nicht mehr

// Dummy-Funktion, TS-nervfrei
const handleFeedback = (_id: string, _feedback: string) => {};

const App: React.FC = () => {
  return (
    <Layout>
      <ChatView messages={messages} onFeedback={handleFeedback} />
      {/* weitere Komponenten */}
    </Layout>
  );
};

export default App;
