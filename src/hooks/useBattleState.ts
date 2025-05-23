
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
      // No incomplete quests, Rival XP doesn't need to increase based on this logic for now.
      // We could potentially have rival XP decay slowly or have a base gain.
      return;
    }

    setIsLoadingAi(true);
    try {
      const input: CalculateRivalXpInput = { incompleteQuests: incompleteQuestsForAI };
      const result = await calculateRivalXp(input);
      // Ensure rival XP doesn't exceed MAX_XP and is not negative
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
  }, [quests, toast]); // `toast` is stable, so primarily `quests` drives recalculation

  useEffect(() => {
    // Initial call and then set interval
    updateRivalXp(); 
    const intervalId = setInterval(updateRivalXp, RIVAL_XP_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [updateRivalXp]);
  
  useEffect(() => {
    try {
      const savedQuests = localStorage.getItem('pixelXpQuests');
      const savedUserXp = localStorage.getItem('pixelXpUserXp');
      // It's good practice to also save/load rivalXp if you want it to be persistent across sessions
      // const savedRivalXp = localStorage.getItem('pixelXpRivalXp'); 

      if (savedQuests) {
        setQuests(JSON.parse(savedQuests));
      }
      if (savedUserXp) {
        setUserXp(JSON.parse(savedUserXp));
      }
      // if (savedRivalXp) {
      //   setRivalXp(JSON.parse(savedRivalXp));
      // }
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
      // localStorage.setItem('pixelXpRivalXp', JSON.stringify(rivalXp));
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
  };
}
