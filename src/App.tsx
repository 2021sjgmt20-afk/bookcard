import React, { useState } from 'react';
import {
  Sparkles,
  Printer,
  Copy,
  Check,
  RotateCw,
  BookOpen,
  ArrowDown,
  Layers,
  HeartHandshake,
  MessageCircleQuestion,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { BookInputForm } from './components/BookInputForm.tsx';
import { QuestionCard } from './components/QuestionCard.tsx';
import { InappropriateModal } from './components/InappropriateModal.tsx';
import { PrintableWorksheet } from './components/PrintableWorksheet.tsx';
import { ApiResponse, QuestionCardData } from './types.ts';

export default function App() {
  const [bookTitle, setBookTitle] = useState('');
  const [memorableScene, setMemorableScene] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<QuestionCardData[]>([]);
  const [friendlyFeedback, setFriendlyFeedback] = useState('');

  // Card flip states: cardId -> boolean
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // User notes scratchpad: cardId -> string (purely in-memory, never saved)
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  // Inappropriate modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Copy success toast
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = bookTitle.trim();
    const trimmedScene = memorableScene.trim();

    if (!trimmedTitle || !trimmedScene) {
      setModalMessage('책 제목과 인상 깊은 장면을 모두 작성해 주세요! 📚');
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookTitle: trimmedTitle,
          memorableScene: trimmedScene,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!data.isAppropriate) {
        setModalMessage(
          data.friendlyFeedback ||
            '책 이야기와 인상 깊은 장면을 다시 정성껏 적어 줄래요? 어떤 책인지 알려 주면 멋진 생각 질문을 만들어 줄게요! 📚😊'
        );
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }

      setCards(data.cards || []);
      setFriendlyFeedback(data.friendlyFeedback || '');
      // Reset flip states for fresh cards
      setFlippedCards({});

      // Smooth scroll down to the generated cards
      setTimeout(() => {
        const cardsSection = document.getElementById('cards-section');
        if (cardsSection) {
          cardsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Failed to generate cards:', err);
      setModalMessage(
        '질문 카드를 만드는 과정에서 일시적인 통신 오류가 생겼어요. 잠시 후 다시 시도해 주세요!'
      );
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBookTitle('');
    setMemorableScene('');
    setCards([]);
    setFriendlyFeedback('');
    setFlippedCards({});
    setUserNotes({});
  };

  const handleToggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleFlipAll = () => {
    const allFlipped = cards.every((c) => flippedCards[c.id]);
    const newState: Record<string, boolean> = {};
    cards.forEach((c) => {
      newState[c.id] = !allFlipped;
    });
    setFlippedCards(newState);
  };

  const handleUpdateNote = (cardId: string, note: string) => {
    setUserNotes((prev) => ({
      ...prev,
      [cardId]: note,
    }));
  };

  const handleCopyQuestions = async () => {
    if (cards.length === 0) return;

    const textToCopy = `[${bookTitle}] 생각 질문 카드 3장\n\n` +
      cards
        .map((c, idx) => {
          const typeName =
            c.type === 'fact'
              ? '1. 사실 확인'
              : c.type === 'emotion'
              ? '2. 인물 마음 추측'
              : '3. 나와 연결하기';
          return `【${typeName}】\n질문: ${c.question}\n힌트: ${c.hint}\n`;
        })
        .join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const areAllFlipped = cards.length > 0 && cards.every((c) => flippedCards[c.id]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6 space-y-8">
        {/* Form Section */}
        <BookInputForm
          bookTitle={bookTitle}
          setBookTitle={setBookTitle}
          memorableScene={memorableScene}
          setMemorableScene={setMemorableScene}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onReset={handleReset}
          hasCards={cards.length > 0}
        />

        {/* Cards Presentation Section */}
        {cards.length > 0 && (
          <section id="cards-section" className="no-print pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Friendly Feedback Message from AI Teacher */}
            {friendlyFeedback && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900 mb-0.5">
                    독서 지도 선생님의 맞장구 💬
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-stone-800 leading-snug">
                    {friendlyFeedback}
                  </p>
                </div>
              </div>
            )}

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-stone-800 text-sm sm:text-base">
                  3장의 생각 카드
                </span>
                <span className="text-xs text-stone-500 hidden sm:inline">
                  (카드를 누르거나 '뒤집기'를 누르면 힌트가 나타나요!)
                </span>
              </div>

              {/* Utility Action Buttons */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
                {/* Flip All Toggle */}
                <button
                  type="button"
                  onClick={handleFlipAll}
                  className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="모든 카드 앞면/뒷면 전환"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{areAllFlipped ? '모두 질문 보기' : '모두 힌트 보기'}</span>
                </button>

                {/* Copy Questions */}
                <button
                  type="button"
                  onClick={handleCopyQuestions}
                  className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="질문 내용 텍스트 복사"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>질문 복사</span>
                    </>
                  )}
                </button>

                {/* Print Worksheet */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="독서 활동지 양식으로 인쇄 또는 PDF 저장"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>활동지 인쇄/PDF</span>
                </button>
              </div>
            </div>

            {/* 3 Question Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, idx) => (
                <QuestionCard
                  key={card.id || idx}
                  card={card}
                  index={idx}
                  isFlipped={!!flippedCards[card.id]}
                  onToggleFlip={() => handleToggleFlip(card.id)}
                  userNote={userNotes[card.id] || ''}
                  onUpdateNote={(note) => handleUpdateNote(card.id, note)}
                />
              ))}
            </div>

            {/* Thinking encouragement card */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/60 rounded-2xl p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-emerald-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm sm:text-base">
                    생각에는 정답이 없어요!
                  </h4>
                  <p className="text-xs text-stone-600">
                    카드를 보며 친구, 선생님, 부모님과 함께 서로의 생각을 나누어 보세요.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition cursor-pointer shrink-0"
              >
                다른 책 질문 뽑기 ⬆️
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Printable Worksheet (hidden on screen, active on print) */}
      {cards.length > 0 && (
        <PrintableWorksheet
          bookTitle={bookTitle}
          memorableScene={memorableScene}
          cards={cards}
          userNotes={userNotes}
        />
      )}

      {/* Inappropriate / Validation Modal */}
      <InappropriateModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="no-print mt-12 py-6 border-t border-stone-200/80 bg-white/60 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4 space-y-1.5">
          <p className="font-medium text-stone-600">
            생각 쑥쑥 독서 질문 카드 • 초등 4~6학년을 위한 깊이 읽기 도우미
          </p>
          <p className="text-stone-400 text-[11px]">
            학생 이름을 수집하지 않으며, 작성된 모든 내용은 브라우저를 닫으면 완전히 사라지는 비저장 안전 도구입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
