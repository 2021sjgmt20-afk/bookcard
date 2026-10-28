import React from 'react';
import { BookOpen } from 'lucide-react';
import { QuestionCardData } from '../types.ts';

interface PrintableWorksheetProps {
  bookTitle: string;
  memorableScene: string;
  cards: QuestionCardData[];
  userNotes: Record<string, string>;
}

export const PrintableWorksheet: React.FC<PrintableWorksheetProps> = ({
  bookTitle,
  memorableScene,
  cards,
  userNotes,
}) => {
  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getTypeName = (type: string) => {
    switch (type) {
      case 'fact':
        return '1. 사실 확인 질문';
      case 'emotion':
        return '2. 인물 마음 추측 질문';
      case 'connection':
        return '3. 나와 연결하기 질문';
      default:
        return '생각 질문';
    }
  };

  return (
    <div className="hidden print:block p-8 bg-white text-stone-900 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-stone-800" />
          <h1 className="text-2xl font-black tracking-tight">생각 쑥쑥 독서 활동지</h1>
        </div>
        <p className="text-xs text-stone-600">초등 4~6학년 깊이 읽기 사고력 질문 카드</p>
        <div className="mt-3 flex justify-between items-center text-xs text-stone-500 px-2">
          <span>작성일: {todayStr}</span>
          <span>독서 생각 확장 기록장</span>
        </div>
      </div>

      {/* Book Info Section */}
      <div className="bg-stone-50 border border-stone-300 rounded-lg p-4 mb-6">
        <div className="mb-2">
          <span className="font-bold text-xs text-stone-700 mr-2">📖 책 제목:</span>
          <span className="font-semibold text-stone-900 text-sm">『{bookTitle}』</span>
        </div>
        <div>
          <span className="font-bold text-xs text-stone-700 block mb-1">✍️ 내가 꼽은 인상 깊은 장면:</span>
          <p className="text-xs text-stone-800 bg-white p-2.5 rounded border border-stone-200 leading-relaxed">
            {memorableScene}
          </p>
        </div>
      </div>

      {/* The 3 Questions */}
      <div className="space-y-6">
        {cards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="border border-stone-300 rounded-lg p-4 bg-white print-break-inside-avoid"
          >
            {/* Category & Question */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-stone-200 text-stone-800">
                {getTypeName(card.type)}
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900 mb-2">
              "{card.question}"
            </h3>

            {/* Hint */}
            <div className="text-xs text-stone-600 bg-amber-50/60 border border-amber-200 rounded p-2 mb-3">
              <span className="font-bold text-amber-900 mr-1">💡 생각 힌트:</span>
              <span>{card.hint}</span>
            </div>

            {/* Answer Section */}
            <div className="mt-2">
              <div className="text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>✏️ 나의 생각:</span>
                <span className="text-[11px] text-stone-400 font-normal">
                  시작말 예: "{card.starter}"
                </span>
              </div>
              <div className="min-h-[70px] p-2.5 rounded border border-stone-300 bg-stone-50/30 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                {userNotes[card.id] || (
                  <div className="space-y-4 pt-4 text-stone-300">
                    <div className="border-b border-dashed border-stone-300"></div>
                    <div className="border-b border-dashed border-stone-300"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400">
        생각 쑥쑥 독서 질문 카드 • 스스로 생각하고 마음을 나누는 독서 활동
      </div>
    </div>
  );
};
