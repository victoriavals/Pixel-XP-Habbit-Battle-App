"use client";

import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Bot } from 'lucide-react'; // User for Player, Bot for Rival

interface XpDisplayProps {
  userName?: string;
  userXp: number;
  rivalName?: string;
  rivalXp: number;
  max_xp: number;
}

const XpDisplay: React.FC<XpDisplayProps> = ({
  userName = "Player",
  userXp,
  rivalName = "Rival",
  rivalXp,
  max_xp,
}) => {
  const userProgress = (userXp / max_xp) * 100;
  const rivalProgress = (rivalXp / max_xp) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-card shadow-lg border-primary border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium text-primary-foreground">{userName}</CardTitle>
          <Image 
            src="https://placehold.co/32x32.png" 
            alt="User Avatar" 
            width={32} 
            height={32} 
            className="rounded-full border-2 border-primary-foreground"
            data-ai-hint="pixel hero avatar"
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-foreground">{userXp} XP</div>
          <Progress value={userProgress} className="w-full h-4 mt-2 bg-primary/30 [&>div]:bg-primary" />
          <p className="text-xs text-primary-foreground/80 mt-1">{userProgress.toFixed(0)}% towards daily goal</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-lg border-accent border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium text-accent-foreground">{rivalName}</CardTitle>
           <Image 
            src="https://placehold.co/32x32.png" 
            alt="Rival Avatar" 
            width={32} 
            height={32} 
            className="rounded-full border-2 border-accent-foreground"
            data-ai-hint="pixel villain avatar"
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent-foreground">{rivalXp} XP</div>
          <Progress value={rivalProgress} className="w-full h-4 mt-2 bg-accent/30 [&>div]:bg-accent" />
           <p className="text-xs text-accent-foreground/80 mt-1">{rivalProgress.toFixed(0)}% lurking</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default XpDisplay;
