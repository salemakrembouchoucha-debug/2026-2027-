import React from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface FeedbackBannerProps {
  isCorrect: boolean;
  question: Question;
  onNext: () => void;
  isLastQuestion: boolean;
  isDark?: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  question,
  onNext,
  isLastQuestion,
  isDark = false
}) => {
  const getCorrectAnswerDisplay = (): string => {
    if (question.type === 'mcq') {
      return question.options[question.correctAnswerIndex];
    }
    if (question.type === 'boolean') {
      return question.correctAnswer ? 'صحيحة (صح)' : 'غير صحيحة (خطأ)';
    }
    if (question.type === 'matching') {
      return question.correctPairs
        .map((p) => {
          const left = question.leftItems.find((l) => l.id === p.leftId)?.text;
          const right = question.rightItems.find((r) => r.id === p.rightId)?.text;
          return `${left} ⟵ ${right}`;
        })
        .join(' | ');
    }
    if (question.type === 'ordering') {
      return question.correctOrderIds
        .map((id, i) => `${i + 1}. ` + question.items.find((it) => it.id === id)?.text)
        .join(' ⟵ ');
    }
    if (question.type === 'sorting') {
      return question.items
        .map((it) => {
          const cat = question.categories.find((c) => c.id === it.correctCategoryId)?.title;
          return `${it.text}: (${cat})`;
        })
        .join(' | ');
    }
    return '';
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 shadow-lg border mt-6 transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 ${
        isCorrect
          ? isDark
            ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-100'
            : 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
          : isDark
          ? 'bg-rose-950/80 border-rose-600/70 text-rose-100'
          : 'bg-rose-50/95 border-rose-300 text-rose-950'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-2xl shadow-xs shrink-0 ${
            isDark ? 'bg-slate-900/90' : 'bg-white'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-500" />
          )}
        </div>

        <div className="flex-1 space-y-2.5">
          <h4 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <span>{isCorrect ? 'أحسنت! إجابة صحيحة ✓' : 'حاول مرة أخرى! إجابة غير صحيحة ✕'}</span>
          </h4>

          {!isCorrect && (
            <div
              className={`p-3.5 rounded-xl border text-sm font-semibold ${
                isDark
                  ? 'bg-slate-900/80 border-rose-800/80 text-rose-200'
                  : 'bg-white/90 border-rose-200 text-slate-800'
              }`}
            >
              <span className="font-bold text-rose-600 dark:text-rose-400">الإجابة الصحيحة: </span>
              <span>{getCorrectAnswerDisplay()}</span>
            </div>
          )}

          <div
            className={`text-sm leading-relaxed p-4 rounded-xl border ${
              isDark
                ? 'bg-slate-900/70 border-slate-700/60 text-slate-200'
                : 'bg-white/80 border-slate-200/80 text-slate-800'
            }`}
          >
            <p className="font-bold text-xs uppercase mb-1.5 text-cyan-600 dark:text-cyan-400">
              التفسير العلمي:
            </p>
            <p className="font-normal">{question.explanation}</p>
          </div>

          {!isCorrect && (
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 pt-0.5">
              📌 المفهوم المقترح مراجعته: {question.concept}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={onNext}
          className={`px-7 py-3 rounded-2xl font-bold text-sm text-white shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
            isCorrect
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black dark:from-slate-700 dark:to-slate-800'
          }`}
        >
          <span>{isLastQuestion ? 'عرض النتيجة والتقرير النهائي' : 'الانتقال للسؤال التالي'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};
