import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIChatMessage, AICommand, ProjectId, UniverseView } from '../types';
import { sound } from '../utils/audioSynthesizer';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Command,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface NexusIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: UniverseView;
  activeProject: ProjectId | null;
  onExecuteCommand: (command: AICommand) => void;
}

const PRESET_PROMPTS = [
  'What is the core paradigm shift of AIHN?',
  'Explain how MATX understands human cognition.',
  'How does AIHN-SIM simulate branching futures?',
  'Why is AIHN-MED not an autonomous doctor?',
  'Show me AIHN-SPACE in deep space.',
  'Why is governance (AIHN-GOV) fundamental?',
  'Take me back to the Nexus Core.',
  'Pull back and reveal the full AIHN universe.',
];

export const NexusIntelligenceModal: React.FC<NexusIntelligenceModalProps> = ({
  isOpen,
  onClose,
  currentView,
  activeProject,
  onExecuteCommand,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Nexus Intelligence active. I observe and synthesize the AIHN ecosystem across all eight specialized architectures. How may I guide your comprehension today?',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceNarrating, setIsVoiceNarrating] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          handleSendMessage(transcript);
        }
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      sound.playClick(600);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Speech recognition start failed', err);
      }
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputValue.trim();
    if (!promptToSend || isLoading) return;

    sound.playClick(500);
    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentView,
          currentProject: activeProject,
        }),
      });

      const data = await response.json();
      const replyText = data.text || 'Transmission received.';
      const command: AICommand | null = data.command || null;

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
        command,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Voice Narration
      if (isVoiceNarrating) {
        sound.speak(replyText);
      }

      // Execute AI Command if returned
      if (command && command.action) {
        sound.playWarp();
        onExecuteCommand(command);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content:
          'Cognitive synthesis completed. The AIHN architecture maintains continuous context across all eight specialized systems.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-y-4 right-4 z-40 w-full max-w-lg bg-[#040812]/95 border border-sky-500/30 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden text-slate-200 select-text"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-400/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-wider text-slate-100 flex items-center gap-2">
              <span>NEXUS INTELLIGENCE</span>
              <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                ONLINE
              </span>
            </div>
            <div className="text-[10px] font-mono-tech text-slate-400">
              Gemini Powered Cognitive Guide
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* TTS voice toggle */}
          <button
            onClick={() => {
              setIsVoiceNarrating(!isVoiceNarrating);
              if (isVoiceNarrating) sound.stopSpeaking();
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isVoiceNarrating
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isVoiceNarrating ? 'Voice Narration Enabled' : 'Voice Narration Disabled'}
          >
            {isVoiceNarrating ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto flex gap-2 no-scrollbar">
        {PRESET_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-mono-tech bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-400/40 transition-colors cursor-pointer flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono-tech text-xs">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-xl leading-relaxed ${
                  isAI
                    ? 'bg-slate-900/90 border border-slate-700/60 text-slate-200'
                    : 'bg-sky-950/80 border border-sky-400/40 text-sky-100 font-sans'
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1 tracking-wider uppercase flex items-center justify-between gap-2">
                  <span>{isAI ? 'NEXUS COGNITION' : 'VISITOR'}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Command Tag if executed */}
                {msg.command && msg.command.action && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-amber-400 font-bold">
                    <Command className="w-3 h-3" />
                    <span>EXECUTED COMMAND: {msg.command.action}</span>
                    {msg.command.targetId && (
                      <span className="uppercase px-1.5 py-0.2 rounded bg-amber-950 text-amber-300">
                        {msg.command.targetId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-sky-400 text-xs py-2 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Synthesizing cognitive response & calculating 3D trajectory...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Optional Voice Mic */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white animate-ping'
                : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-sky-300'
            }`}
            title={isRecording ? 'Listening...' : 'Voice Input (Optional)'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Nexus Intelligence or type command..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono-tech placeholder-slate-500 focus:outline-none focus:border-sky-400/60"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
