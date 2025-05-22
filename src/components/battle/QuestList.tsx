"use client";

import type { Quest } from '@/types';
import QuestItem from './QuestItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';

interface QuestListProps {
  quests: Quest[];
  onToggleComplete: (id: string) => void;
}

const QuestList: React.FC<QuestListProps> = ({ quests, onToggleComplete }) => {
  if (quests.length === 0) {
    return (
      <Card className="text-center py-10 bg-card/70 backdrop-blur-sm shadow-md">
        <CardContent>
          <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No quests yet. Add some to start your battle!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <ListChecks className="mr-2 h-6 w-6"/> Daily Battle Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {quests.map(quest => (
            <QuestItem key={quest.id} quest={quest} onToggleComplete={onToggleComplete} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default QuestList;
