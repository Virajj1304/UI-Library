import React, { useState } from 'react';
import LandingView from './components/LandingView';
import DocsLayout from './components/DocsLayout';
import IndexView from './components/IndexView';
import DetailView from './components/DetailView';
import { getRegistryItemById } from './data/registry';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);

  const activeComponent = activeComponentId ? getRegistryItemById(activeComponentId) : null;

  if (viewMode === 'landing') {
    return <LandingView onBrowse={() => setViewMode('workspace')} />;
  }

  return (
    <DocsLayout
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      activeComponentId={activeComponentId}
      setActiveComponentId={setActiveComponentId}
      onLogoClick={() => {
        setActiveComponentId(null);
        setViewMode('landing');
      }}
    >
      {activeComponent ? (
        <DetailView
          item={activeComponent}
          onBack={() => setActiveComponentId(null)}
        />
      ) : (
        <IndexView
          activeCategory={activeCategory}
          onSelectComponent={(id) => setActiveComponentId(id)}
        />
      )}
    </DocsLayout>
  );
};

export default App;
