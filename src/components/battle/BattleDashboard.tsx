
"use client";

import { useBattleState } from '@/hooks/useBattleState';
import XpDisplay from './XpDisplay';
import QuestInput from './QuestInput';
import QuestList from './QuestList';
import EditQuestDialog from './EditQuestDialog'; // Import the new dialog
import { Loader2 } from 'lucide-react';

const BattleDashboard: React.FC = () => {
  const {
    quests,
    userXp,
    rivalXp,
    addQuest,
    toggleQuestComplete,
    deleteQuest,
    isLoadingAi,
    MAX_XP,
    editingQuest,      // Get editingQuest state
    startEditQuest,    // Get function to start editing
    cancelEditQuest,   // Get function to cancel editing
    updateQuest,       // Get function to update quest
  } = useBattleState();

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary animate-pulse tracking-wider" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          Pixel XP Habit Battle
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Complete your quests before the Rival outpaces you!</p>
      </header>
      
      {isLoadingAi && (
        <div className="fixed top-4 right-4 z-50 bg-card p-3 rounded-md shadow-lg flex items-center text-sm text-accent">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Rival is scheming...
        </div>
      )}

      <XpDisplay userXp={userXp} rivalXp={rivalXp} max_xp={MAX_XP} />
      <QuestInput onAddQuest={addQuest} />
      <QuestList 
        quests={quests} 
        onToggleComplete={toggleQuestComplete} 
        onDeleteQuest={deleteQuest}
        onStartEditQuest={startEditQuest} // Pass startEditQuest to QuestList
      />
      
      {editingQuest && (
        <EditQuestDialog
          quest={editingQuest}
          onSave={updateQuest}
          onCancel={cancelEditQuest}
          isOpen={!!editingQuest}
          onOpenChange={(open) => { if (!open) cancelEditQuest(); }}
        />
      )}
      
      <footer className="text-center mt-12 text-sm text-muted-foreground/70">
        <p>&copy; {new Date().getFullYear()} Pixel XP Habit Battle. Stay vigilant!</p>
      </footer>
    </div>
  );
};

export default BattleDashboard;
