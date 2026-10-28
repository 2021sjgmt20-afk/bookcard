import React from 'react';
import { BookMarked, MessageSquareQuote, Wand2, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { BookPreset } from '../types.ts';

const PRESETS: BookPreset[] = [
  {
    category: '우정과 용기',
    title: '샬롯의 거미줄',
    scene: '샬롯이 위험에 빠진 아기 돼지 윌버를 구하기 위해 밤새 거미줄에 글자를 정성껏 수놓는 장면',
  },
  {
    category: '마음의 갈등',
    title: '자전거 도둑',
    scene: '수남이가 바람에 날아간 간판 때문에 남의 자전거를 들고 당황하며 도망치는 장면',
  },
  {
    category: '사랑과 성장',
    title: '마당을 나온 암탉',
    scene: '잎싹이가 온 정성을 다해 알을 품고 자란 초록머리를 마침내 드넓은 하늘로 날려 보내는 장면',
  },
  {
    category: '소중한 관계',
    title: '어린 왕자',
    scene: '여우가 어린 왕자에게 "가장 중요한 것은 눈에 보이지 않아"라며 서로 길들임에 대해 말해 주는 장면',
  },
  {
    category: '모험과 협동',
    title: '푸른 사자 와니니',
    scene: '와니니가 사자 무리에서 쫓겨난 뒤, 친구들과 서로를 믿으며 초원의 위험을 함께 헤쳐 나가는 장면',
  },
];

interface BookInputFormProps {
  bookTitle: string;
  setBookTitle: (v: string) => void;
  memorableScene: string;
  setMemorableScene: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onReset: () => void;
  hasCards: boolean;
}

export const BookInputForm: React.FC<BookInputFormProps> = ({
  bookTitle,
  setBookTitle,
  memorableScene,
  setMemorableScene,
  onSubmit,
  isLoading,
  onReset,
  hasCards,
}) => {
  const handleSelectPreset = (preset: BookPreset) => {
    setBookTitle(preset.title);
    setMemorableScene(preset.scene);
  };

  return (
    <div className="no-print bg-white rounded-2xl shadow-sm border border-stone-200/90 p-5 sm:p-7 max-w-3xl mx-auto transition-all">
      {/* Preset Suggestions */}
      <div className="mb-6 pb-5 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm font-semibold mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>어떤 책을 쓸지 고민된다면? 예시 책을 콕 눌러보세요:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="group text-left px-3 py-1.5 rounded-lg text-xs bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <span className="font-bold">『{preset.title}』</span>
              <span className="text-stone-400 group-hover:text-emerald-600 ml-1">({preset.category})</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Book Title Input */}
        <div>
          <label htmlFor="bookTitle" className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-emerald-600" />
            <span>내가 읽은 책 제목</span>
            <span className="text-xs text-rose-500 font-normal">*필수</span>
          </label>
          <input
            id="bookTitle"
            type="text"
            required
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="예: 샬롯의 거미줄, 푸른 사자 와니니, 자전거 도둑..."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 outline-none text-stone-800 text-sm sm:text-base placeholder:text-stone-400 bg-stone-50/50 focus:bg-white transition"
            maxLength={100}
          />
        </div>

        {/* Memorable Scene Textarea */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="memorableScene" className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
              <span>가장 인상 깊었던 장면이나 내용</span>
              <span className="text-xs text-rose-500 font-normal">*필수</span>
            </label>
            <span className="text-xs text-stone-400">
              {memorableScene.length} / 500자
            </span>
          </div>
          <textarea
            id="memorableScene"
            required
            rows={4}
            value={memorableScene}
            onChange={(e) => setMemorableScene(e.target.value)}
            placeholder="예: 주인공이 위험에 처한 친구를 위해 용기를 내어 편지를 쓰는 장면이 가장 기억에 남았어요. 왜냐하면 나라면 무서워서 도망쳤을 것 같았기 때문이에요."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 outline-none text-stone-800 text-sm sm:text-base placeholder:text-stone-400 bg-stone-50/50 focus:bg-white transition resize-none"
            maxLength={500}
          />

          {/* Quick Writing Prompt Tip */}
          <div className="mt-2 flex items-start gap-1.5 text-xs text-stone-500">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span>
              <strong>작성 꿀팁:</strong> 주인공이 큰 결정을 내렸던 순간, 마음이 뭉클했던 말, 또는 신기했던 사건을 한두 줄로 자유롭게 적어 보세요.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || !bookTitle.trim() || !memorableScene.trim()}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-base shadow-sm hover:shadow flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>생각 질문 카드를 만드는 중...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-amber-300" />
                <span>질문 카드 3장 뽑기!</span>
              </>
            )}
          </button>

          {(bookTitle || memorableScene || hasCards) && (
            <button
              type="button"
              onClick={onReset}
              disabled={isLoading}
              className="w-full sm:w-auto py-3.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-600 font-medium text-sm transition cursor-pointer"
            >
              다시 쓰기
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
