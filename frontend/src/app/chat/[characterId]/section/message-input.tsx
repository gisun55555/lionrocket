'use client';

import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  characterName: string;
}

export function MessageInput({ 
  message, 
  onMessageChange, 
  onSubmit, 
  isPending, 
  characterName 
}: MessageInputProps) {
  return (
    <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-6 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
      <form onSubmit={onSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={`${characterName}에게 메시지를 보내세요...`}
            className="w-full h-12 pl-4 pr-12 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg transition-all duration-200"
            maxLength={200}
            disabled={isPending}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
            {message.length}/200
          </div>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isPending}
          className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
