
"use client";

import { useState, useEffect } from 'react';
import type { Quest } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditQuestDialogProps {
  quest: Quest | null;
  onSave: (id: string, newTitle: string, newXpValue: number) => void;
  onCancel: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditQuestDialog: React.FC<EditQuestDialogProps> = ({ quest, onSave, onCancel, isOpen, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [xpValue, setXpValue] = useState('');

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setXpValue(quest.xpValue.toString());
    }
  }, [quest]);

  if (!quest) {
    return null;
  }

  const handleSave = () => {
    const newXp = parseInt(xpValue, 10);
    if (title.trim() && !isNaN(newXp) && newXp > 0) {
      onSave(quest.id, title, newXp);
    } else {
      // Basic validation feedback, or rely on useBattleState's toast
      if (!title.trim()) alert("Title cannot be empty.");
      if (isNaN(newXp) || newXp <= 0) alert("XP value must be a positive number.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Quest</DialogTitle>
          <DialogDescription>
            Make changes to your quest details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right text-foreground">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-input placeholder:text-muted-foreground text-foreground"
              aria-label="Edit Quest Title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-xp" className="text-right text-foreground">
              XP Value
            </Label>
            <Input
              id="edit-xp"
              type="number"
              value={xpValue}
              onChange={(e) => setXpValue(e.target.value)}
              className="col-span-3 bg-input placeholder:text-muted-foreground text-foreground"
              aria-label="Edit XP Value"
              min="1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} className="border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestDialog;
