import React, { useState, useEffect } from 'react';
import { LESSONS, QUESTIONS } from './data/curriculumData';
import { Question, UserAnswerRecord, LessonInfo } from './types';
import { QuestionCard } from './components/QuestionCard';
import { FeedbackBanner } from './components/FeedbackBanner';
import { StudentReport } from './components/StudentReport';
import { ParticleVisualizer } from './components/ParticleVisualizer';
import { generateStandaloneHtml } from './utils/generateStandaloneHtml';
import {
  Sparkles,
  Flame,
  Download,
  RotateCcw,
  Play,
  Moon,
  Sun,
  ChevronLeft,
  ArrowRight,
  Atom,
  Zap,
  Compass
} from 'lucide-react';

export default function App() {
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('grade7_student_name') || '';
  });
  const [tempName, setTempName] = useState<string>('');
  const [currentView, setCurrentView] = useState<'welcome' | 'level_select' | 'quiz' | 'report'>('welcome');

  const [activeLesson, setActiveLesson] = useState<LessonInfo | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<UserAnswerRecord[]>([]);

  const [currentFeedback, setCurrentFeedback] = useState<{
    isCorrect: boolean;
    question: Question;
  } | null>(null);

  const [mistakeQuestions, setMistakeQuestions] = useState<Question[]>([]);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('grade7_theme') === 'dark';
  });

  useEffect(() => {
    if (studentName) {
      setTempName(studentName);
    }
  }, [studentName]);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('grade7_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleStartNameEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setStudentName(tempName.trim());
    localStorage.setItem('grade7_student_name', tempName.trim());
    setCurrentView('level_select');
  };

  const startLessonQuiz = (lessonId: string, reviewOnly: boolean = false) => {
    setIsReviewMode(reviewOnly);
    setCurrentIndex(0);
    setUserScore(0);
    setStreakCount(0);
    setAnswersLog([]);
    setCurrentFeedback(null);

    let qList: Question[] = [];
    if (reviewOnly) {
      qList = [...mistakeQuestions];
      setActiveLesson({
        id: 'review',
        number: 'مراجعة الأخطاء',
        title: 'مراجعة الأخطاء السابقة',
        standard: 'C0701, C0702',
        description: 'إعادة حل الأسئلة التي لم تجب عليها بشكل صحيح لتثبيت الفهم.',
        objectives: ['التعلم من الأخطاء السابقة وإتقان المفاهيم.']
      });
    } else if (lessonId === 'all') {
      qList = [...QUESTIONS];
      setActiveLesson({
        id: 'all',
        number: 'تحدي شامل',
        title: 'الاختبار الشامل للوحدة الأولى: الطبيعة الجُسيمية للمادة',
        standard: 'C0701, C0702',
        description: 'مراجعة تفاعلية شاملة لجميع دروس ومفاهيم الوحدة.',
        objectives: ['تقييم الفهم المتكامل لجميع معايير الوحدة.']
      });
    } else {
      const foundLesson = LESSONS.find((l) => l.id === lessonId);
      setActiveLesson(foundLesson || null);
      qList = QUESTIONS.filter((q) => q.lessonId === lessonId);
    }

    // Shuffle options for MCQ to eliminate predictable answer patterns
    const randomizedQuestions = qList.map((q) => {
      if (q.type === 'mcq') {
        const correctText = q.options[q.correctAnswerIndex];
        const shuffled = [...q.options].sort(() => Math.random() - 0.5);
        const newCorrectIndex = shuffled.indexOf(correctText);
        return {
          ...q,
          options: shuffled,
          correctAnswerIndex: newCorrectIndex
        };
      }
      return q;
    });

    setActiveQuestions(randomizedQuestions);
    setCurrentView('quiz');
  };

  const handleAnswerSubmit = (isCorrect: boolean, userDetail?: string) => {
    const currentQ = activeQuestions[currentIndex];

    if (isCorrect) {
      const bonus = Math.min(streakCount * 2, 10);
      setUserScore((prev) => prev + 10 + bonus);
      setStreakCount((prev) => prev + 1);
    } else {
      setStreakCount(0);
      setMistakeQuestions((prev) => {
        if (!prev.some((item) => item.id === currentQ.id)) {
          return [...prev, currentQ];
        }
        return prev;
      });
    }

    const newAnswer: UserAnswerRecord = {
      questionId: currentQ.id,
      question: currentQ,
      isCorrect,
      userSelectionText: userDetail,
      timestamp: Date.now()
    };

    setAnswersLog((prev) => [...prev, newAnswer]);
    setCurrentFeedback({
      isCorrect,
      question: currentQ
    });
  };

  const handleNextQuestion = () => {
    setCurrentFeedback(null);
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentView('report');
    }
  };

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Grade7_Science_Game.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'science-bg-dark tech-grid-pattern-dark text-slate-100' : 'science-bg-light tech-grid-pattern text-slate-900'
      } pb-16`}
    >
      {/* Top Navbar */}
      <header
        className={`border-b sticky top-0 z-30 transition-all ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md'
            : 'bg-white/90 border-slate-200 backdrop-blur-md'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('level_select')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black flex items-center gap-2">
                <span>مغامرة العلوم</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  الصف السابع
                </span>
              </h1>
              <p className="text-2xs text-slate-500 dark:text-slate-400">الطبيعة الجُسيمية للمادة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي (Dark Mode)'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Offline Download Button */}
            <button
              onClick={handleDownloadStandaloneHtml}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-102 active:scale-95"
              title="تحميل اللعبة كملف HTML مستقل يعمل بدون إنترنت"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تحميل اللعبة (HTML)</span>
              <span className="sm:hidden">تحميل</span>
            </button>

            {studentName && currentView !== 'welcome' && (
              <div
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span>👤</span>
                <span>{studentName}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* VIEW 1: WELCOME SCREEN */}
        {currentView === 'welcome' && (
          <div className="max-w-2xl mx-auto space-y-6 pt-4 animate-in fade-in duration-300">
            <div
              className={`rounded-3xl p-8 sm:p-12 text-center space-y-6 border transition-all ${
                isDark ? 'glass-panel-dark' : 'glass-panel'
              }`}
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-xl">
                  <Atom className="w-12 h-12" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md animate-bounce">
                  ✨
                </span>
              </div>

              <div>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                  المنهج القطري - المستوى 7
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-3 leading-tight">
                  مغامرة العلوم
                </h2>
                <h3 className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                  الوحدة الأولى: الطبيعة الجُسيمية للمادة
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                استعد لرحلة استكشافية مشوقة في عالم الجسيمات وحالات المادة والكثافة والانتشار، مع تجارب تفاعلية ومحاكي علمي لحركة الجسيمات.
              </p>

              {/* Name Input Form */}
              <form onSubmit={handleStartNameEntry} className="max-w-md mx-auto space-y-4 pt-2">
                <div className="text-right">
                  <label htmlFor="studentNameInput" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    اكتب اسمك للبدء:
                  </label>
                  <input
                    id="studentNameInput"
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="اسم الطالب..."
                    className={`w-full px-5 py-4 rounded-2xl border text-base outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700 text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 shadow-xs'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-600 text-white font-black text-lg shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>ابدأ اللعبة</span>
                </button>
              </form>

              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <span>تعمل بالكامل Offline بدون إنترنت</span>
                <span>•</span>
                <button
                  onClick={handleDownloadStandaloneHtml}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold cursor-pointer"
                >
                  تحميل نسخة HTML مستقلة
                </button>
              </div>
            </div>

            {/* Quick Badges */}
            <div
              className={`rounded-3xl p-5 border text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-center ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'
              }`}
            >
              <div className="p-2 flex flex-col items-center gap-1">
                <Compass className="w-5 h-5 text-cyan-500" />
                <span className="font-bold">5 محطات تعليمية</span>
                <span className="text-2xs text-slate-400">تغطي جميع معايير الوحدة</span>
              </div>
              <div className="p-2 flex flex-col items-center gap-1">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-bold">تغذية راجعة فورية</span>
                <span className="text-2xs text-slate-400">تفسير علمي لكل سؤال</span>
              </div>
              <div className="p-2 flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-emerald-500" />
                <span className="font-bold">مراجعة الأخطاء</span>
                <span className="text-2xs text-slate-400">إعادة الأسئلة المتعثرة</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: LEVEL SELECTOR */}
        {currentView === 'level_select' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Greeting Card */}
            <div
              className={`p-6 sm:p-7 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark ? 'glass-panel-dark' : 'glass-panel'
              }`}
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  مرحباً بك يا {studentName || 'البطل'}! 👋
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  اختر درساً للمراجعة والتدرب، أو انطلق في التحدي الشامل لجميع معايير الوحدة:
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {mistakeQuestions.length > 0 && (
                  <button
                    onClick={() => startLessonQuiz('mistakes', true)}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>مراجعة أخطائي ({mistakeQuestions.length})</span>
                  </button>
                )}
                <button
                  onClick={() => startLessonQuiz('all')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-102 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>بدء التحدي الشامل (جميع الدروس)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Lesson Cards */}
              <div className="lg:col-span-2 space-y-4">
                {LESSONS.map((lesson) => {
                  const lessonQuestions = QUESTIONS.filter((q) => q.lessonId === lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-3xl p-5 sm:p-6 border transition-all hover:shadow-lg flex flex-col justify-between gap-4 ${
                        isDark ? 'glass-panel-dark hover:border-slate-600' : 'glass-panel hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-xl border ${
                              isDark
                                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {lesson.number} • المعيار {lesson.standard}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {lessonQuestions.length} أسئلة
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black leading-snug">
                          {lesson.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {lesson.description}
                        </p>

                        <div className="pt-1">
                          <span className="text-2xs font-bold text-slate-400 block mb-1">الأهداف التعليمية:</span>
                          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5 pr-4 list-disc">
                            {lesson.objectives.slice(0, 2).map((obj, idx) => (
                              <li key={idx}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">العلوم - المستوى 7</span>
                        <button
                          onClick={() => startLessonQuiz(lesson.id)}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-95 shadow-sm"
                        >
                          <span>ابدأ مراجعة الدرس</span>
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Visualizer */}
              <div className="space-y-4">
                <ParticleVisualizer isDark={isDark} />

                <div
                  className={`p-5 rounded-3xl border text-xs space-y-2 ${
                    isDark ? 'glass-panel-dark text-slate-300' : 'glass-panel text-slate-600'
                  }`}
                >
                  <h4 className="font-bold flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                    <Atom className="w-4 h-4" />
                    <span>إرشادات المذاكرة:</span>
                  </h4>
                  <p>• اقرأ كل سؤال بتركيز وافحص الخيارات بعناية قبل الإجابة.</p>
                  <p>• تتيح لك التغذية الراجعة فهم سبب الإجابة الصحيحة والتفسير العلمي لها.</p>
                  <p>• في نهاية كل مستوى يمكنك مراجعة الأسئلة غير الصحيحة لتحقيق الدرجة الكاملة.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ACTIVE QUIZ */}
        {currentView === 'quiz' && activeQuestions.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Progress & Header */}
            <div
              className={`rounded-3xl p-5 border shadow-sm space-y-3.5 ${
                isDark ? 'glass-panel-dark' : 'glass-panel'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('level_select')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="العودة لقائمة الدروس"
                  >
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                  <span className="font-black text-sm sm:text-base">
                    {activeLesson?.number}: {activeLesson?.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 font-black">
                    ⭐ النقاط: {userScore}
                  </span>

                  {streakCount > 1 && (
                    <span className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 font-black animate-pulse">
                      <Flame className="w-4 h-4 fill-amber-500" />
                      <span>متتالية: {streakCount}</span>
                    </span>
                  )}

                  <span className="text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm">
                    السؤال {currentIndex + 1} / {activeQuestions.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300 shadow-xs"
                  style={{
                    width: `${Math.round(((currentIndex + 1) / activeQuestions.length) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={activeQuestions[currentIndex]}
              onAnswerSubmit={handleAnswerSubmit}
              disabled={currentFeedback !== null}
              isDark={isDark}
            />

            {/* Feedback Banner */}
            {currentFeedback && (
              <FeedbackBanner
                isCorrect={currentFeedback.isCorrect}
                question={currentFeedback.question}
                onNext={handleNextQuestion}
                isLastQuestion={currentIndex + 1 >= activeQuestions.length}
                isDark={isDark}
              />
            )}
          </div>
        )}

        {/* VIEW 4: STUDENT REPORT */}
        {currentView === 'report' && (
          <StudentReport
            studentName={studentName}
            answers={answersLog}
            totalScore={userScore}
            onRestartAll={() => startLessonQuiz(activeLesson?.id || 'all')}
            onReviewMistakes={() => startLessonQuiz('mistakes', true)}
            onReturnToLessons={() => setCurrentView('level_select')}
            isDark={isDark}
          />
        )}
      </main>
    </div>
  );
}
