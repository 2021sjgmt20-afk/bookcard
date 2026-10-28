import React, { useState } from 'react';
import {
  RotateCw,
  Volume2,
  VolumeX,
  Search,
  Heart,
  Sparkles,
  Lightbulb,
  PenLine,
  CheckCircle2,
  CornerDownRight,
} from 'lucide-react';
import { QuestionCardData } from '../types.ts';

interface QuestionCardProps {
  card: QuestionCardData;
  index: number;
  isFlipped: boolean;
  onToggleFlip: () => void;
  userNote: string;
  onUpdateNote: (note: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  card,
  index,
  isFlipped,
  onToggleFlip,
  userNote,
  onUpdateNote,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Styling theme depending on card type
  const themeConfig = {
    fact: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeLabel: '사실 확인 카드',
      sublabel: '이야기 속 실제 사건과 사실 돋보기',
      icon: Search,
      headerBg: 'bg-emerald-500 text-white',
      accentColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      backBg: 'bg-emerald-50/50',
      chipBg: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    },
    emotion: {
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      badgeLabel: '인물 마음 카드',
      sublabel: '등장인물의 감정과 속마음 상상하기',
      icon: Heart,
      headerBg: 'bg-rose-500 text-white',
      accentColor: 'text-rose-700',
      borderColor: 'border-rose-200',
      backBg: 'bg-rose-50/50',
      chipBg: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
    },
    connection: {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      badgeLabel: '나와 연결하기 카드',
      sublabel: '책 속 상황을 나의 삶과 이어보기',
      icon: Sparkles,
      headerBg: 'bg-indigo-500 text-white',
      accentColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
      backBg: 'bg-indigo-50/50',
      chipBg: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    },
  }[card.type];

  const IconComponent = themeConfig.icon;

  // Web Speech API for reading the question aloud
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저에서는 음성 읽기 기능을 지원하지 않아요.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.question);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95; // slightly slower & friendly for elementary kids
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleApplyStarter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userNote.trim()) {
      onUpdateNote(card.starter + ' ');
    } else {
      onUpdateNote(userNote + ' ' + card.starter + ' ');
    }
  };

  return (
    <div className="perspective-1000 w-full min-h-[460px] flex flex-col">
      <div
        className={`relative w-full h-full flex-1 rounded-2xl transition-transform duration-700 transform-style-3d shadow-md hover:shadow-lg border ${themeConfig.borderColor} ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= FRONT SIDE (QUESTION) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl flex flex-col overflow-hidden">
          {/* Card Top Banner */}
          <div className={`${themeConfig.headerBg} px-5 py-3.5 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <span className="font-extrabold text-sm sm:text-base tracking-wide">
                {themeConfig.badgeLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <IconComponent className="w-4 h-4" />
              <span>앞면</span>
            </div>
          </div>

          {/* Subtitle / Category banner */}
          <div className="px-5 py-2 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>{themeConfig.sublabel}</span>
            <span className="font-semibold text-emerald-700">답은 정해져 있지 않아요!</span>
          </div>

          {/* Card Body with Question */}
          <div className="p-6 sm:p-7 flex-1 flex flex-col justify-center text-center">
            {/* Friendly Badge */}
            <div className="mx-auto mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600">
              <span>질문 카드를 읽고 깊이 생각해 보세요</span>
            </div>

            {/* The One Sentence Question */}
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug tracking-tight mb-4 px-2 select-text">
              "{card.question}"
            </h3>

            {/* Read Aloud TTS Button */}
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                title="음성으로 질문 듣기"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-rose-600 font-semibold">소리 멈추기</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>소리로 질문 듣기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Bottom Flip Action */}
          <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>어떻게 생각할지 막막한가요?</span>
            </span>

            <button
              type="button"
              onClick={onToggleFlip}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition flex items-center gap-1.5 cursor-pointer text-white ${themeConfig.headerBg}`}
            >
              <RotateCw className="w-4 h-4" />
              <span>카드 뒤집어 힌트 보기</span>
            </button>
          </div>
        </div>

        {/* ================= BACK SIDE (HINT & SCRATCHPAD) ================= */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl flex flex-col overflow-hidden ${themeConfig.backBg}`}>
          {/* Card Top Banner */}
          <div className={`${themeConfig.headerBg} px-5 py-3.5 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-200" />
              <span className="font-extrabold text-sm sm:text-base tracking-wide">
                생각을 돕는 비밀 힌트
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <RotateCw className="w-3.5 h-3.5" />
              <span>뒷면</span>
            </div>
          </div>

          {/* Question Reminder at the top of back side */}
          <div className="px-5 py-2.5 bg-white/80 border-b border-stone-200/60 text-xs text-stone-700">
            <span className="font-bold text-stone-500 mr-1.5">질문:</span>
            <span className="font-semibold text-stone-900">{card.question}</span>
          </div>

          {/* Back Content */}
          <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* The Hint Box */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-stone-800 text-xs sm:text-sm leading-relaxed">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>선생님이 주는 생각 길잡이:</span>
              </div>
              <p className="pl-5 text-stone-700 font-medium">{card.hint}</p>
            </div>

            {/* Sentence Starter helper */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <PenLine className="w-3.5 h-3.5 text-emerald-600" />
                  <span>내 생각 시작해보기</span>
                </span>
                <button
                  type="button"
                  onClick={handleApplyStarter}
                  className={`text-xs px-2 py-0.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${themeConfig.chipBg}`}
                  title="시작말을 메모장에 넣기"
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>시작말 쏙 넣기</span>
                </button>
              </div>

              {/* Starter quote */}
              <div className="text-xs text-stone-500 italic bg-white/70 px-2.5 py-1.5 rounded-lg border border-stone-200/60 mb-2">
                "{card.starter}"
              </div>

              {/* Scratchpad Textarea (Never saved, purely private local state) */}
              <textarea
                value={userNote}
                onChange={(e) => onUpdateNote(e.target.value)}
                placeholder="카드를 보며 떠오른 내 생각을 자유롭게 끄적여 보세요 (어디에도 저장되지 않아요)..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 outline-none text-xs sm:text-sm text-stone-800 bg-white placeholder:text-stone-400 resize-none transition"
              />
            </div>
          </div>

          {/* Card Bottom Flip Back Action */}
          <div className="p-4 bg-white/90 border-t border-stone-200/60 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              {userNote.trim() ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>내 생각이 작성되었어요</span>
                </span>
              ) : (
                <span>생각을 정리했으면 질문으로 돌아가기</span>
              )}
            </span>

            <button
              type="button"
              onClick={onToggleFlip}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-stone-800 hover:bg-stone-900 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCw className="w-4 h-4" />
              <span>질문 앞면 보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
