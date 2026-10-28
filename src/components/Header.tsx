import React from 'react';
import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="no-print pt-6 pb-4">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Target Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>초등 4~6학년 생각 확장 독서 메이트</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight flex items-center justify-center gap-2.5">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          <span>생각 쑥쑥 독서 질문 카드</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          책 제목과 인상 깊은 장면을 쓰면, <strong className="text-emerald-700 font-bold">생각을 넓혀 주는 3장의 마법 질문 카드</strong>가 열려요!
        </p>

        {/* Feature Badges */}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-stone-600 font-medium">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            🔍 사실 확인 질문 1개
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            💭 인물 마음 추측 질문 1개
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
            ✨ 나와 연결하기 질문 1개
          </span>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-600 text-xs">
          <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
          <span>이름을 묻지 않으며, 작성한 모든 글은 저장되지 않는 안전하고 비밀스러운 생각 공간입니다.</span>
        </div>
      </div>
    </header>
  );
};
