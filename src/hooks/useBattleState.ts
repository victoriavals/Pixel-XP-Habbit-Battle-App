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
    setQuests(prevQuests =>
      prevQuests.map(quest => {
        if (quest.id === id) {
          const updatedQuest = { ...quest, isComplete: !quest.isComplete };
          if (updatedQuest.isComplete && !quest.isComplete) { // Was incomplete, now complete
            setUserXp(prevXp => Math.min(prevXp + quest.xpValue, MAX_XP));
            toast({ title: "Quest Complete!", description: `+${quest.xpValue} XP! Great job!` });
          } else if (!updatedQuest.isComplete && quest.isComplete) { // Was complete, now incomplete
            setUserXp(prevXp => Math.max(0, prevXp - quest.xpValue));
          }
          return updatedQuest;
        }
        return quest;
      })
    );
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
      // Or, it could slowly decay or stay put. For simplicity, no change if no incomplete quests.
      return;
    }

    setIsLoadingAi(true);
    try {
      const input: CalculateRivalXpInput = { incompleteQuests: incompleteQuestsForAI };
      const result = await calculateRivalXp(input);
      // The AI result.rivalXpGain is the *total* XP the rival should have based on current state.
      // So we set it directly, capped at MAX_XP.
      setRivalXp(Math.min(Math.round(result.rivalXpGain), MAX_XP));
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
    // Initial Rival XP calculation
    updateRivalXp();

    const intervalId = setInterval(() => {
      updateRivalXp();
    }, RIVAL_XP_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [updateRivalXp]);
  
  // Effect to load initial state from localStorage if desired (example)
  useEffect(() => {
    const savedQuests = localStorage.getItem('pixelXpQuests');
    const savedUserXp = localStorage.getItem('pixelXpUserXp');
    const savedRivalXp = localStorage.getItem('pixelXpRivalXp');

    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }
    if (savedUserXp) {
      setUserXp(JSON.parse(savedUserXp));
    }
    if (savedRivalXp) {
      //setRivalXp(JSON.parse(savedRivalXp)); // Rival XP is calculated, so maybe don't load this
    }
  }, []);

  // Effect to save state to localStorage
  useEffect(() => {
    localStorage.setItem('pixelXpQuests', JSON.stringify(quests));
    localStorage.setItem('pixelXpUserXp', JSON.stringify(userXp));
    // localStorage.setItem('pixelXpRivalXp', JSON.stringify(rivalXp)); // Rival XP is calculated
  }, [quests, userXp]);


  return {
    quests,
    userXp,
    rivalXp,
    addQuest,
    toggleQuestComplete,
    isLoadingAi,
    MAX_XP,
  };
}
