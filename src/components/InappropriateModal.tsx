import React from 'react';
import { AlertCircle, BookOpen, Edit3, X } from 'lucide-react';

interface InappropriateModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const InappropriateModal: React.FC<InappropriateModalProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 sm:p-7 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 rounded-lg transition"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Friendly Alert Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-stone-800 mb-2">
          다시 한번 적어 줄래요? ✍️
        </h3>

        {/* Message */}
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
          {message || '책 제목과 기억에 남는 장면을 정성껏 다시 적어 줄래요? 어떤 책인지 알려 주면 너를 위한 멋진 생각 질문을 선물해 줄게요! 📚😊'}
        </p>

        {/* Guidance Checklist */}
        <div className="text-left bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5 mb-6 text-xs text-stone-700 space-y-1.5">
          <div className="font-bold text-amber-900 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>이렇게 적어 보면 좋아요:</span>
          </div>
          <p className="pl-4">• 실제로 읽은 동화책이나 소설의 제목을 적어 주세요.</p>
          <p className="pl-4">• 장난이나 장난성 글자 대신, 기억나는 장면을 들려주세요.</p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>내용 다시 쓰러 가기</span>
        </button>
      </div>
    </div>
  );
};
