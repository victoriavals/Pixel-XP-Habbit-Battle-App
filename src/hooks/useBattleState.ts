
"use client";

import type { Quest, IncompleteQuestForAI } from '@/types';
import { calculateRivalXp, type CalculateRivalXpInput } from '@/ai/flows/rival-xp-calculator';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const MAX_XP = 1000; // Example max XP for a day for progress bar scaling
const RIVAL_XP_UPDATE_INTERVAL = 10000; // Update rival XP every 10 seconds

export function useBattleState() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userXp, setUserXp] = useState(0);
  const [rivalXp, setRivalXp] = useState(0);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null); // For managing the quest being edited
  const { toast } = useToast();

  const addQuest = (title: string, xpValue: number, durationMinutes: number = 24 * 60) => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Quest title cannot be empty.", variant: "destructive" });
      return;
    }
    if (xpValue <= 0) {
      toast({ title: "Error", description: "XP value must be positive.", variant: "destructive" });
      return;
    }
    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      xpValue,
      durationMinutes,
      isComplete: false,
      timestamp: Date.now(),
    };
    setQuests(prevQuests => [...prevQuests, newQuest]);
    toast({ title: "Quest Added!", description: `"${title}" is now on your list.` });
  };

  const toggleQuestComplete = (id: string) => {
    const questToToggle = quests.find(q => q.id === id);
    if (!questToToggle) {
      console.warn("Quest not found for toggling:", id);
      return;
    }

    const isNowComplete = !questToToggle.isComplete;
    const xpChange = questToToggle.xpValue;

    // Update quests state by creating a new array
    const newQuests = quests.map(q =>
      q.id === id ? { ...q, isComplete: isNowComplete } : q
    );
    setQuests(newQuests);

    // Handle side effects (XP update and toast) after setting the quests state
    if (isNowComplete) {
      // Quest was incomplete, now complete
      setUserXp(prevXp => Math.min(prevXp + xpChange, MAX_XP));
      toast({ title: "Quest Complete!", description: `+${xpChange} XP! Great job!` });
    } else {
      // Quest was complete, now incomplete
      setUserXp(prevXp => Math.max(0, prevXp - xpChange));
      // Optionally, you could add a toast for reopening a quest
      // toast({ title: "Quest Reopened", description: `"${questToToggle.title}" is now pending.` });
    }
  };

  const deleteQuest = (id: string) => {
    const questToDelete = quests.find(q => q.id === id);
    if (!questToDelete) {
      toast({ title: "Error", description: "Quest not found for deletion.", variant: "destructive" });
      return;
    }

    setQuests(prevQuests => prevQuests.filter(q => q.id !== id));

    if (questToDelete.isComplete) {
      setUserXp(prevXp => Math.max(0, prevXp - questToDelete.xpValue));
    }
    toast({ title: "Quest Deleted", description: `"${questToDelete.title}" has been removed.` });
  };

  const startEditQuest = (id: string) => {
    const questToEdit = quests.find(q => q.id === id);
    if (questToEdit) {
      setEditingQuest(questToEdit);
    } else {
      toast({ title: "Error", description: "Quest not found for editing.", variant: "destructive" });
    }
  };

  const cancelEditQuest = () => {
    setEditingQuest(null);
  };

  const updateQuest = (id: string, newTitle: string, newXpValue: number) => {
    const questToUpdate = quests.find(q => q.id === id);
    if (!questToUpdate) {
      toast({ title: "Error", description: "Quest not found for update.", variant: "destructive" });
      setEditingQuest(null);
      return;
    }

    if (!newTitle.trim()) {
      toast({ title: "Error", description: "Quest title cannot be empty.", variant: "destructive" });
      return; // Don't close dialog, let user fix
    }
    if (newXpValue <= 0) {
      toast({ title: "Error", description: "XP value must be positive.", variant: "destructive" });
      return; // Don't close dialog, let user fix
    }
    
    const oldXpValue = questToUpdate.xpValue;
    const wasComplete = questToUpdate.isComplete;

    setQuests(prevQuests =>
      prevQuests.map(q =>
        q.id === id ? { ...q, title: newTitle, xpValue: newXpValue } : q
      )
    );

    if (wasComplete) {
      setUserXp(prevXp => Math.max(0, Math.min(MAX_XP, prevXp - oldXpValue + newXpValue)));
    }

    toast({ title: "Quest Updated!", description: `"${newTitle}" has been modified.` });
    setEditingQuest(null);
  };


  const updateRivalXp = useCallback(async () => {
    const incompleteQuestsForAI: IncompleteQuestForAI[] = quests
      .filter(q => !q.isComplete)
      .map(q => {
        const elapsedTimeMillis = Date.now() - q.timestamp;
        const elapsedMinutes = Math.floor(elapsedTimeMillis / (1000 * 60));
        const timeRemainingMinutes = Math.max(0, q.durationMinutes - elapsedMinutes);
        return {
          xpValue: q.xpValue,
          durationMinutes: q.durationMinutes,
          timeRemainingMinutes: timeRemainingMinutes,
        };
      });

    if (incompleteQuestsForAI.length === 0) {
      return;
    }

    setIsLoadingAi(true);
    try {
      const input: CalculateRivalXpInput = { incompleteQuests: incompleteQuestsForAI };
      const result = await calculateRivalXp(input);
      setRivalXp(prevRivalXp => Math.min(Math.max(0, prevRivalXp + Math.round(result.rivalXpGain)), MAX_XP));
    } catch (error) {
      console.error("Error calculating Rival XP:", error);
      toast({
        title: "AI Error",
        description: "Could not update Rival XP.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAi(false);
    }
  }, [quests, toast]);

  useEffect(() => {
    updateRivalXp(); 
    const intervalId = setInterval(updateRivalXp, RIVAL_XP_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [updateRivalXp]);
  
  useEffect(() => {
    try {
      const savedQuests = localStorage.getItem('pixelXpQuests');
      const savedUserXp = localStorage.getItem('pixelXpUserXp');
      if (savedQuests) {
        setQuests(JSON.parse(savedQuests));
      }
      if (savedUserXp) {
        setUserXp(JSON.parse(savedUserXp));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      toast({
          title: "Load Error",
          description: "Could not load saved progress.",
          variant: "destructive",
      });
    }
  }, [toast]); 

  useEffect(() => {
    try {
      localStorage.setItem('pixelXpQuests', JSON.stringify(quests));
      localStorage.setItem('pixelXpUserXp', JSON.stringify(userXp));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        toast({
            title: "Save Error",
            description: "Could not save progress.",
            variant: "destructive",
        });
    }
  }, [quests, userXp, rivalXp, toast]);


  return {
    quests,
    userXp,
    rivalXp,
    addQuest,
    toggleQuestComplete,
    deleteQuest,
    isLoadingAi,
    MAX_XP,
    editingQuest,
    startEditQuest,
    cancelEditQuest,
    updateQuest,
  };
}
