import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowUp, ArrowDown, HelpCircle, Sparkles, Check, X } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (isCorrect: boolean, userDetail?: string) => void;
  disabled?: boolean;
  isDark?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSubmit,
  disabled = false,
  isDark = false
}) => {
  // State for MCQ
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // State for Boolean
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);

  // State for Matching
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);

  // State for Sorting
  const [sortingPlacements, setSortingPlacements] = useState<Record<string, string>>({});

  // State for Ordering
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>([]);

  // Reset state on question change
  useEffect(() => {
    setSelectedOption(null);
    setSelectedBool(null);
    setMatchingSelections({});
    setActiveLeftId(null);
    setSortingPlacements({});

    if (question.type === 'ordering') {
      const initial = [...question.items.map((it) => it.id)];
      setOrderedItemIds(initial.reverse());
    }
  }, [question.id]);

  const handleMcqSubmit = (idx: number) => {
    if (disabled || question.type !== 'mcq') return;
    setSelectedOption(idx);
    const isCorrect = idx === question.correctAnswerIndex;
    onAnswerSubmit(isCorrect, question.options[idx]);
  };

  const handleBooleanSubmit = (val: boolean) => {
    if (disabled || question.type !== 'boolean') return;
    setSelectedBool(val);
    const isCorrect = val === question.correctAnswer;
    onAnswerSubmit(isCorrect, val ? 'صح' : 'خطأ');
  };

  const handleLeftClick = (leftId: string) => {
    if (disabled) return;
    setActiveLeftId(leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (disabled || !activeLeftId) return;
    setMatchingSelections((prev) => ({
      ...prev,
      [activeLeftId]: rightId
    }));
    setActiveLeftId(null);
  };

  const checkMatching = () => {
    if (question.type !== 'matching') return;
    const pairs = question.correctPairs;
    const allAnswered = pairs.every((p) => matchingSelections[p.leftId] !== undefined);
    if (!allAnswered) return;

    const isAllCorrect = pairs.every((p) => matchingSelections[p.leftId] === p.rightId);
    onAnswerSubmit(isAllCorrect, 'مطابقة كاملة');
  };

  const handleCategoryAssign = (itemId: string, categoryId: string) => {
    if (disabled) return;
    setSortingPlacements((prev) => ({
      ...prev,
      [itemId]: categoryId
    }));
  };

  const checkSorting = () => {
    if (question.type !== 'sorting') return;
    const allPlaced = question.items.every((it) => sortingPlacements[it.id] !== undefined);
    if (!allPlaced) return;

    const isAllCorrect = question.items.every(
      (it) => sortingPlacements[it.id] === it.correctCategoryId
    );
    onAnswerSubmit(isAllCorrect, 'تصنيف العناصر');
  };

  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    if (disabled || toIndex < 0 || toIndex >= orderedItemIds.length) return;
    const updated = [...orderedItemIds];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderedItemIds(updated);
  };

  const checkOrdering = () => {
    if (question.type !== 'ordering') return;
    const isAllCorrect =
      orderedItemIds.length === question.correctOrderIds.length &&
      orderedItemIds.every((id, idx) => id === question.correctOrderIds[idx]);
    onAnswerSubmit(isAllCorrect, 'ترتيب العناصر');
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
        isDark ? 'glass-panel-dark text-slate-100' : 'glass-panel text-slate-900'
      }`}
    >
      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full border flex items-center gap-1.5 font-bold ${
              isDark
                ? 'bg-blue-950/80 text-cyan-300 border-cyan-800/60'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>المعيار: {question.standard}</span>
          </span>

          <span
            className={`px-3 py-1 rounded-full border font-bold ${
              isDark
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/50'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            {question.concept}
          </span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-2xs font-semibold ${
            isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {question.difficulty === 'easy'
            ? 'مستوى: أساسي'
            : question.difficulty === 'medium'
            ? 'مستوى: متوسط'
            : 'مستوى: متقدم'}
        </span>
      </div>

      {/* Scenario / Context */}
      {question.contextScenario && (
        <div
          className={`mb-5 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
            isDark
              ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-200'
              : 'bg-sky-50/80 border-sky-200 text-sky-950'
          }`}
        >
          {question.contextScenario}
        </div>
      )}

      {/* Question Text */}
      <h3
        className={`text-xl sm:text-2xl font-black mb-6 leading-relaxed ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {question.question}
      </h3>

      {/* MCQ Type */}
      {question.type === 'mcq' && (
        <div className="space-y-3.5">
          {question.options.map((option, idx) => {
            const letter = ['أ', 'ب', 'ج', 'د'][idx] || `${idx + 1}`;
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswerIndex;

            let buttonStyle = isDark
              ? 'border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:border-slate-600'
              : 'border-slate-200/90 bg-slate-50/80 hover:bg-slate-100/90 text-slate-800 hover:border-slate-300';

            if (disabled) {
              if (isSelected) {
                buttonStyle = isCorrect
                  ? isDark
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-sm ring-1 ring-emerald-500'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                  : isDark
                  ? 'border-rose-500 bg-rose-950/60 text-rose-200 shadow-sm ring-1 ring-rose-500'
                  : 'border-rose-400 bg-rose-50 text-rose-900 shadow-sm ring-1 ring-rose-300';
              } else if (isCorrect) {
                buttonStyle = isDark
                  ? 'border-emerald-600/70 bg-emerald-950/30 text-emerald-300 border-dashed'
                  : 'border-emerald-300 bg-emerald-50/60 text-emerald-900 border-dashed';
              } else {
                buttonStyle = isDark ? 'opacity-40 border-slate-800' : 'opacity-40 border-slate-200';
              }
            }

            return (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => handleMcqSubmit(idx)}
                className={`w-full p-4 sm:p-4.5 rounded-2xl text-right transition-all flex items-center justify-between border cursor-pointer active:scale-[0.99] ${buttonStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border transition-all ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : isDark
                        ? 'bg-slate-700/80 border-slate-600 text-slate-300'
                        : 'bg-white border-slate-300 text-slate-700 shadow-xs'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-base sm:text-lg font-medium">{option}</span>
                </div>

                {disabled && isSelected && (
                  <div className="shrink-0 mr-2">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                        <Check className="w-4 h-4" />
                        <span>إجابتك</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs bg-rose-100 dark:bg-rose-950 px-2.5 py-1 rounded-lg">
                        <X className="w-4 h-4" />
                        <span>إجابتك</span>
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Boolean Type */}
      {question.type === 'boolean' && (
        <div className="grid grid-cols-2 gap-4">
          <button
            disabled={disabled}
            onClick={() => handleBooleanSubmit(true)}
            className={`p-6 rounded-2xl border text-center transition-all font-bold flex flex-col items-center justify-center gap-2.5 cursor-pointer active:scale-95 ${
              selectedBool === true
                ? isDark
                  ? 'border-emerald-500 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500'
                  : 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400 shadow-sm'
                : isDark
                ? 'border-slate-700 bg-slate-800/50 hover:bg-emerald-950/30 text-slate-200'
                : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/60 text-slate-800'
            } ${disabled ? 'cursor-not-allowed opacity-90' : ''}`}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <span className="text-lg sm:text-xl font-black">صحيحة (صح)</span>
          </button>

          <button
            disabled={disabled}
            onClick={() => handleBooleanSubmit(false)}
            className={`p-6 rounded-2xl border text-center transition-all font-bold flex flex-col items-center justify-center gap-2.5 cursor-pointer active:scale-95 ${
              selectedBool === false
                ? isDark
                  ? 'border-rose-500 bg-rose-950/70 text-rose-200 ring-2 ring-rose-500'
                  : 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400 shadow-sm'
                : isDark
                ? 'border-slate-700 bg-slate-800/50 hover:bg-rose-950/30 text-slate-200'
                : 'border-slate-200 bg-slate-50 hover:bg-rose-50/60 text-slate-800'
            } ${disabled ? 'cursor-not-allowed opacity-90' : ''}`}
          >
            <XCircle className="w-10 h-10 text-rose-500" />
            <span className="text-lg sm:text-xl font-black">غير صحيحة (خطأ)</span>
          </button>
        </div>
      )}

      {/* Matching Type */}
      {question.type === 'matching' && (
        <div className="space-y-4">
          <div
            className={`text-xs p-3 rounded-2xl flex items-center gap-2 ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>اختر عنصراً من القائمة الأولى ثم انقر على ما يناسبه من القائمة الثانية للربط بينهما:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400">القائمة الأولى</h4>
              {question.leftItems.map((item) => {
                const pairedRightId = matchingSelections[item.id];
                const pairedText = question.rightItems.find((r) => r.id === pairedRightId)?.text;
                const isSelected = activeLeftId === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={disabled}
                    onClick={() => handleLeftClick(item.id)}
                    className={`w-full text-right p-3.5 rounded-2xl border text-sm transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'border-cyan-400 bg-cyan-950/80 ring-2 ring-cyan-500 font-bold'
                          : 'border-blue-600 bg-blue-50 ring-2 ring-blue-300 font-bold'
                        : pairedRightId
                        ? isDark
                          ? 'border-emerald-600/70 bg-emerald-950/40 text-emerald-200'
                          : 'border-emerald-300 bg-emerald-50 text-slate-800'
                        : isDark
                        ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">{item.text}</div>
                    {pairedText && (
                      <div
                        className={`text-xs mt-1.5 p-1.5 rounded-xl font-medium ${
                          isDark ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        ✓ مربوط بـ: {pairedText}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">القائمة الثانية</h4>
              {question.rightItems.map((item) => {
                const isAssigned = Object.values(matchingSelections).includes(item.id);
                return (
                  <button
                    key={item.id}
                    disabled={disabled}
                    onClick={() => handleRightClick(item.id)}
                    className={`w-full text-right p-3.5 rounded-2xl border text-sm transition-all cursor-pointer ${
                      activeLeftId
                        ? 'border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 animate-pulse'
                        : isAssigned
                        ? isDark
                          ? 'border-emerald-700/60 bg-emerald-950/30 text-slate-300'
                          : 'border-emerald-300 bg-emerald-50/50 text-slate-700'
                        : isDark
                        ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled={
                disabled ||
                question.correctPairs.some((p) => matchingSelections[p.leftId] === undefined)
              }
              onClick={checkMatching}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              تأكيد المطابقة
            </button>
          </div>
        </div>
      )}

      {/* Sorting Type */}
      {question.type === 'sorting' && (
        <div className="space-y-4">
          <div
            className={`text-xs p-3 rounded-2xl ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            حدّد الفئة المناسبة لكل مادة أو عنصر بالضغط على الزر المقابل:
          </div>

          <div className="space-y-3">
            {question.items.map((item) => {
              const currentCategory = sortingPlacements[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-bold text-base">{item.text}</span>
                  <div className="flex flex-wrap gap-2">
                    {question.categories.map((cat) => {
                      const isChosen = currentCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          disabled={disabled}
                          onClick={() => handleCategoryAssign(item.id, cat.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isChosen
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : isDark
                              ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {cat.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              disabled={
                disabled ||
                question.items.some((it) => sortingPlacements[it.id] === undefined)
              }
              onClick={checkSorting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              تأكيد التصنيف
            </button>
          </div>
        </div>
      )}

      {/* Ordering Type */}
      {question.type === 'ordering' && (
        <div className="space-y-4">
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span>{question.orderLabel || 'رتّب العناصر بالترتيب الصحيح من الأعلى للأسفل:'}</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">استخدم الأسهم للترتيب</span>
          </div>

          <div className="space-y-2.5">
            {orderedItemIds.map((itemId, idx) => {
              const itemObj = question.items.find((it) => it.id === itemId);
              if (!itemObj) return null;

              return (
                <div
                  key={itemId}
                  className={`flex items-center justify-between p-3.5 border rounded-2xl ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold">{itemObj.text}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={disabled || idx === 0}
                      onClick={() => moveOrderItem(idx, idx - 1)}
                      className={`p-2 rounded-xl border transition-all ${
                        isDark
                          ? 'border-slate-700 bg-slate-700 hover:bg-slate-600 text-slate-200'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      } disabled:opacity-30`}
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={disabled || idx === orderedItemIds.length - 1}
                      onClick={() => moveOrderItem(idx, idx + 1)}
                      className={`p-2 rounded-xl border transition-all ${
                        isDark
                          ? 'border-slate-700 bg-slate-700 hover:bg-slate-600 text-slate-200'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      } disabled:opacity-30`}
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              disabled={disabled}
              onClick={checkOrdering}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              تأكيد الترتيب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
