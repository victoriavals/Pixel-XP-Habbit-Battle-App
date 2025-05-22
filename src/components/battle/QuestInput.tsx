"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface QuestInputProps {
  onAddQuest: (title: string, xpValue: number) => void;
}

const QuestInput: React.FC<QuestInputProps> = ({ onAddQuest }) => {
  const [title, setTitle] = useState('');
  const [xpValue, setXpValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const xp = parseInt(xpValue, 10);
    if (title.trim() && !isNaN(xp) && xp > 0) {
      onAddQuest(title, xp);
      setTitle('');
      setXpValue('');
    }
  };

  return (
    <Card className="mb-8 shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Forge a New Quest</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quest Title (e.g., 30 min workout)"
            className="flex-grow bg-input placeholder:text-muted-foreground text-foreground"
            aria-label="Quest Title"
          />
          <Input
            type="number"
            value={xpValue}
            onChange={(e) => setXpValue(e.target.value)}
            placeholder="XP Value (e.g., 50)"
            className="w-full sm:w-32 bg-input placeholder:text-muted-foreground text-foreground"
            aria-label="XP Value"
            min="1"
          />
          <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Quest
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestInput;
