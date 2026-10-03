import React from 'react';
import { UserAnswerRecord } from '../types';
import { Award, CheckCircle2, AlertCircle, RotateCcw, Printer, Sparkles, Star, BookOpen, Layers } from 'lucide-react';

interface StudentReportProps {
  studentName: string;
  answers: UserAnswerRecord[];
  totalScore: number;
  onRestartAll: () => void;
  onReviewMistakes: () => void;
  onReturnToLessons: () => void;
  isDark?: boolean;
}

export const StudentReport: React.FC<StudentReportProps> = ({
  studentName,
  answers,
  totalScore,
  onRestartAll,
  onReviewMistakes,
  onReturnToLessons,
  isDark = false
}) => {
  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let performanceTier = 'يحتاج إلى مراجعة';
  let tierColor = isDark
    ? 'text-amber-300 bg-amber-950/60 border-amber-800'
    : 'text-amber-800 bg-amber-50 border-amber-300';

  if (percentage >= 90) {
    performanceTier = 'ممتاز 🌟';
    tierColor = isDark
      ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800'
      : 'text-emerald-800 bg-emerald-50 border-emerald-300';
  } else if (percentage >= 75) {
    performanceTier = 'جيد جداً 👏';
    tierColor = isDark
      ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800'
      : 'text-blue-800 bg-blue-50 border-blue-300';
  } else if (percentage >= 60) {
    performanceTier = 'جيد 👍';
    tierColor = isDark
      ? 'text-sky-300 bg-sky-950/60 border-sky-800'
      : 'text-sky-800 bg-sky-50 border-sky-300';
  }

  const strengthsMap = new Map<string, number>();
  const mistakesMap = new Map<string, { concept: string; lesson: string }>();

  answers.forEach((ans) => {
    if (ans.isCorrect) {
      strengthsMap.set(ans.question.concept, (strengthsMap.get(ans.question.concept) || 0) + 1);
    } else {
      mistakesMap.set(ans.question.id, {
        concept: ans.question.concept,
        lesson: ans.question.lessonTitle
      });
    }
  });

  const uniqueMistakeConcepts = Array.from(
    new Set(Array.from(mistakesMap.values()).map((m) => `${m.concept} (${m.lesson})`))
  );

  const uniqueStrengthConcepts = Array.from(strengthsMap.keys()).filter(
    (c) => !Array.from(mistakesMap.values()).some((m) => m.concept === c)
  );

  return (
    <div
      className={`rounded-3xl p-6 sm:p-10 shadow-xl border max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 ${
        isDark ? 'glass-panel-dark text-slate-100' : 'glass-panel text-slate-900'
      }`}
    >
      {/* Celebration Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg mb-2">
          <Award className="w-12 h-12" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black">
          أحسنت! لقد أكملت اللعبة 🏆
        </h2>

        <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
          تهانينا يا <span className="underline decoration-cyan-500 underline-offset-4">{studentName || 'البطل'}</span>!
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          مادة العلوم - الصف السابع - الوحدة الأولى: الطبيعة الجُسيمية للمادة
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-xs font-bold text-slate-400 block mb-1">⭐ مجموع النقاط</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400">
            {totalScore}
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
            الإجابات الصحيحة
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300">
            {correctCount} <span className="text-xs text-emerald-500">/ {totalQuestions}</span>
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-xs font-bold text-slate-400 block mb-1">نسبة الإتقان</span>
          <span className="text-2xl sm:text-3xl font-black">{percentage}%</span>
        </div>

        <div className={`p-4 rounded-2xl border ${tierColor} flex flex-col justify-center`}>
          <span className="text-xs font-bold block mb-1">مستوى الأداء</span>
          <span className="text-base sm:text-lg font-black">{performanceTier}</span>
        </div>
      </div>

      {/* Strengths & Areas to Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            isDark
              ? 'bg-emerald-950/30 border-emerald-800/50'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <h4>نقاط القوة والمفاهيم المتقنة:</h4>
          </div>
          {uniqueStrengthConcepts.length > 0 ? (
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 pr-4 list-disc">
              {uniqueStrengthConcepts.slice(0, 6).map((concept, i) => (
                <li key={i} className="leading-relaxed">
                  {concept}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">
              واصل التدرب وستبرز نقاط قوتك في الجولة القادمة!
            </p>
          )}
        </div>

        {/* Review needed */}
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            isDark
              ? 'bg-rose-950/30 border-rose-800/50'
              : 'bg-rose-50/70 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <h4>المفاهيم التي تحتاج إلى مراجعة:</h4>
          </div>
          {uniqueMistakeConcepts.length > 0 ? (
            <ul className="space-y-1.5 text-xs sm:text-sm text-rose-950 dark:text-rose-200 pr-4 list-disc">
              {uniqueMistakeConcepts.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              رائع جداً! لم ترتكب أي أخطاء، إتقان تام للمفاهيم.
            </p>
          )}
        </div>
      </div>

      {/* Educational Recommendation */}
      <div
        className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-2 ${
          isDark
            ? 'bg-blue-950/50 border-blue-800/60 text-blue-200'
            : 'bg-blue-50 border-blue-200 text-blue-950'
        }`}
      >
        <h4 className="font-bold flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>توجيه تربوي مخصص:</span>
        </h4>
        <p className="leading-relaxed">
          {uniqueMistakeConcepts.length > 0
            ? `ننصحك يا ${studentName || 'بطل العلوم'} بمراجعة المفاهيم العلمية الموضحة أعلاه، واستخدام زر "مراجعة أخطائي" أدناه لإعادة حل الأسئلة التي تعثرت فيها وترسيخ الفهم.`
            : `أداء استثنائي رائع يا ${studentName || 'بطل العلوم'}! لقد أثبت استيعاباً كاملاً ومتقناً لجميع معايير ومفاهيم الوحدة الأولى لمادة العلوم للصف السابع.`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {incorrectCount > 0 && (
          <button
            onClick={onReviewMistakes}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>مراجعة أخطائي ({incorrectCount})</span>
          </button>
        )}

        <button
          onClick={onRestartAll}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة اللعبة</span>
        </button>

        <button
          onClick={onReturnToLessons}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          <span>قائمة الدروس</span>
        </button>

        <button
          onClick={() => window.print()}
          className={`px-4 py-3.5 rounded-2xl font-medium text-sm border transition-all flex items-center gap-2 cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
          title="طباعة التقرير"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة</span>
        </button>
      </div>
    </div>
  );
};
