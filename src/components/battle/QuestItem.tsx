"use client";

import type { Quest } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react'; // ShieldAlert for incomplete, ShieldCheck for complete

interface QuestItemProps {
  quest: Quest;
  onToggleComplete: (id: string) => void;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onToggleComplete }) => {
  return (
    <li className={`flex items-center justify-between p-4 rounded-lg mb-3 transition-all duration-300 ease-in-out
                     ${quest.isComplete ? 'bg-green-500/20 border-l-4 border-green-400' : 'bg-slate-700/30 border-l-4 border-slate-500'}
                     hover:shadow-xl hover:scale-[1.01]`}>
      <div className="flex items-center">
        <Checkbox
          id={`quest-${quest.id}`}
          checked={quest.isComplete}
          onCheckedChange={() => onToggleComplete(quest.id)}
          className={`mr-4 h-6 w-6 rounded border-2 transition-colors
                      ${quest.isComplete ? 'border-green-400 bg-green-500 data-[state=checked]:bg-green-400 data-[state=checked]:text-background' 
                                         : 'border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'}`}
          aria-labelledby={`quest-title-${quest.id}`}
        />
        <div>
          <label 
            htmlFor={`quest-${quest.id}`}
            id={`quest-title-${quest.id}`}
            className={`font-medium cursor-pointer text-lg ${quest.isComplete ? 'line-through text-muted-foreground/70' : 'text-foreground'}`}
          >
            {quest.title}
          </label>
          <p className={`text-sm flex items-center ${quest.isComplete ? 'text-green-400/80' : 'text-accent/80'}`}>
            <Sparkles className="w-4 h-4 mr-1" /> {quest.xpValue} XP
          </p>
        </div>
      </div>
      {quest.isComplete ? (
        <ShieldCheck className="h-7 w-7 text-green-400" />
      ) : (
        <ShieldAlert className="h-7 w-7 text-yellow-400 animate-pulse" />
      )}
    </li>
  );
};

export default QuestItem;
