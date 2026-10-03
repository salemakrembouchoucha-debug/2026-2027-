import { LESSONS, QUESTIONS } from '../data/curriculumData';

export function generateStandaloneHtml(): string {
  const jsonLessons = JSON.stringify(LESSONS);
  const jsonQuestions = JSON.stringify(QUESTIONS);

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مغامرة العلوم: الطبيعة الجُسيمية للمادة - الصف السابع (المنهج القطري)</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --accent: #06b6d4;
      --bg: #f8fafc;
      --card-bg: rgba(255, 255, 255, 0.94);
      --card-border: rgba(226, 232, 240, 0.85);
      --text: #0f172a;
      --text-muted: #64748b;
      --success: #059669;
      --success-bg: #ecfdf5;
      --success-border: #a7f3d0;
      --danger: #e11d48;
      --danger-bg: #fff1f2;
      --danger-border: #fecdd3;
      --warning: #d97706;
      --warning-bg: #fffbeb;
      --radius: 20px;
      --shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    }

    body.dark-mode {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --accent: #22d3ee;
      --bg: #0b1120;
      --card-bg: rgba(15, 23, 42, 0.90);
      --card-border: rgba(51, 65, 85, 0.65);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --success-bg: rgba(6, 78, 59, 0.4);
      --success-border: #047857;
      --danger-bg: rgba(136, 19, 55, 0.4);
      --danger-border: #be123c;
      --warning-bg: rgba(120, 53, 15, 0.35);
      --shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Arabic", "Cairo", "Tajawal", "Segoe UI Arabic", Tahoma, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 16px;
      display: flex;
      justify-content: center;
      min-height: 100vh;
      transition: background-color 0.3s ease, color 0.3s ease;
      background-image: 
        radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(99, 102, 241, 0.08) 0px, transparent 50%);
    }

    body.dark-mode {
      background-image: 
        radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.35) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(14, 116, 144, 0.3) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(67, 56, 202, 0.25) 0px, transparent 50%);
    }

    .container {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 26px;
      margin-bottom: 20px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    }

    .header-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 18px;
    }

    .stats {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .stat-badge {
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      padding: 6px 14px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 13px;
      border: 1px solid rgba(37, 99, 235, 0.2);
    }

    .stat-badge.streak {
      background: rgba(217, 119, 6, 0.12);
      color: var(--warning);
      border-color: rgba(217, 119, 6, 0.25);
    }

    .progress-wrap {
      width: 100%;
      height: 10px;
      background: rgba(148, 163, 184, 0.2);
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #6366f1, #06b6d4);
      width: 0%;
      transition: width 0.35s ease;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 22px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .btn:hover {
      transform: translateY(-1px);
    }
    .btn:active {
      transform: translateY(1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
    }

    .btn-secondary {
      background: rgba(148, 163, 184, 0.12);
      color: var(--text);
      border-color: var(--card-border);
    }
    .btn-secondary:hover {
      background: rgba(148, 163, 184, 0.2);
    }

    .input-text {
      width: 100%;
      padding: 15px 18px;
      border-radius: 14px;
      border: 1px solid var(--card-border);
      background: var(--card-bg);
      color: var(--text);
      font-size: 15px;
      outline: none;
      transition: all 0.2s;
    }
    .input-text:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
    }

    .option-btn {
      width: 100%;
      text-align: right;
      padding: 15px 18px;
      border-radius: 16px;
      border: 1px solid var(--card-border);
      background: rgba(248, 250, 252, 0.7);
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
    }
    body.dark-mode .option-btn {
      background: rgba(30, 41, 59, 0.6);
    }
    .option-btn:hover:not(:disabled) {
      background: rgba(37, 99, 235, 0.08);
      border-color: var(--primary);
      transform: translateX(-2px);
    }
    .option-btn .letter-badge {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: var(--primary);
      flex-shrink: 0;
    }

    .feedback-box {
      border-radius: 18px;
      padding: 22px;
      margin-top: 22px;
      animation: fadeIn 0.3s ease;
    }
    .feedback-box.correct {
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: #064e3b;
    }
    body.dark-mode .feedback-box.correct {
      color: #d1fae5;
    }
    .feedback-box.incorrect {
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      color: #881337;
    }
    body.dark-mode .feedback-box.incorrect {
      color: #ffe4e6;
    }
    .feedback-title {
      font-size: 20px;
      font-weight: 900;
      margin-bottom: 8px;
    }
    .feedback-explanation {
      background: rgba(255, 255, 255, 0.88);
      padding: 14px;
      border-radius: 12px;
      margin-top: 10px;
      font-size: 14px;
      color: #0f172a;
      line-height: 1.6;
    }
    body.dark-mode .feedback-explanation {
      background: rgba(15, 23, 42, 0.8);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .canvas-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(148, 163, 184, 0.08);
      padding: 16px;
      border-radius: 16px;
      margin-bottom: 18px;
      border: 1px solid var(--card-border);
    }
    canvas {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      max-width: 100%;
    }
    body.dark-mode canvas {
      background: #0f172a;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .tag {
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      padding: 5px 12px;
      border-radius: 9999px;
      background: rgba(148, 163, 184, 0.15);
      color: var(--text);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
      .card {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="container" id="app"></div>

  <script>
    const LESSONS_DATA = ${jsonLessons};
    const ALL_QUESTIONS_DATA = ${jsonQuestions};

    let state = {
      view: 'welcome',
      studentName: localStorage.getItem('grade7_student_name') || '',
      selectedLessonId: 'all',
      questions: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      answers: [],
      currentFeedback: null,
      isReviewMode: false,
      mistakeQuestions: [],
      simState: 'solid',
      isDark: localStorage.getItem('grade7_theme') === 'dark'
    };

    function applyTheme() {
      if (state.isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }

    function toggleDark() {
      state.isDark = !state.isDark;
      localStorage.setItem('grade7_theme', state.isDark ? 'dark' : 'light');
      applyTheme();
      render();
    }

    function init() {
      applyTheme();
      render();
    }

    function startQuiz(lessonId, isReview = false) {
      state.selectedLessonId = lessonId;
      state.isReviewMode = isReview;
      state.currentIndex = 0;
      state.score = 0;
      state.streak = 0;
      state.answers = [];
      state.currentFeedback = null;

      if (isReview) {
        state.questions = [...state.mistakeQuestions];
      } else if (lessonId === 'all') {
        state.questions = [...ALL_QUESTIONS_DATA];
      } else {
        state.questions = ALL_QUESTIONS_DATA.filter(q => q.lessonId === lessonId);
      }

      state.questions = state.questions.map(q => {
        if (q.type === 'mcq' || !q.type) {
          const correctText = q.options[q.correctAnswerIndex];
          const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
          const newCorrectIndex = shuffledOptions.indexOf(correctText);
          return {
            ...q,
            options: shuffledOptions,
            correctAnswerIndex: newCorrectIndex
          };
        }
        return q;
      });

      state.view = 'quiz';
      render();
    }

    function handleAnswer(isCorrect, userDetail) {
      const q = state.questions[state.currentIndex];
      if (isCorrect) {
        state.score += 10 + Math.min(state.streak * 2, 10);
        state.streak += 1;
      } else {
        state.streak = 0;
        if (!state.mistakeQuestions.some(mq => mq.id === q.id)) {
          state.mistakeQuestions.push(q);
        }
      }

      state.answers.push({
        questionId: q.id,
        question: q,
        isCorrect: isCorrect,
        userDetail: userDetail
      });

      state.currentFeedback = {
        isCorrect,
        question: q
      };

      render();
    }

    function nextQuestion() {
      state.currentFeedback = null;
      if (state.currentIndex + 1 < state.questions.length) {
        state.currentIndex += 1;
        render();
      } else {
        state.view = 'report';
        render();
      }
    }

    function renderWelcome() {
      return \`
        <div class="card" style="text-align: center; padding: 40px 24px;">
          <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
            <button class="btn btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="toggleDark()">
              \${state.isDark ? '☀️ الوضع النهاري' : '☾ الوضع الليلي'}
            </button>
          </div>
          <span class="tag" style="background:rgba(37,99,235,0.12); color:var(--primary); margin-bottom:12px;">مادة العلوم - الصف السابع (المنهج القطري)</span>
          <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 8px;">مغامرة العلوم</h1>
          <h2 style="font-size: 18px; color: var(--accent); margin-bottom: 14px;">الوحدة الأولى: الطبيعة الجُسيمية للمادة</h2>
          <p style="color: var(--text-muted); font-size: 15px; max-width: 600px; margin: 0 auto 28px;">
            استعد لمراجعة تفاعلية شيقة واختبار فهمك العلمي من خلال تحديات تفاعلية متنوعة ومحاكي علمي للجسيمات.
          </p>

          <div style="max-width: 400px; margin: 0 auto; text-align: right;">
            <label style="display:block; font-weight:bold; margin-bottom:8px; font-size:14px;">اكتب اسمك للبدء:</label>
            <input type="text" id="nameInput" class="input-text" placeholder="اسم الطالب..." value="\${state.studentName}">
            <button class="btn btn-primary" style="width:100%; margin-top:16px; padding:15px; font-size:16px;" onclick="saveNameAndProceed()">
              ابدأ اللعبة 🚀
            </button>
          </div>
        </div>
      \`;
    }

    function saveNameAndProceed() {
      const input = document.getElementById('nameInput');
      const val = input ? input.value.trim() : '';
      if (!val) {
        alert('يرجى كتابة اسمك للمتابعة!');
        return;
      }
      state.studentName = val;
      localStorage.setItem('grade7_student_name', val);
      state.view = 'level_select';
      render();
    }

    function renderLevelSelect() {
      let lessonsHtml = LESSONS_DATA.map(l => {
        const count = ALL_QUESTIONS_DATA.filter(q => q.lessonId === l.id).length;
        return \`
          <div class="card" style="margin-bottom:14px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="tag" style="background:rgba(37,99,235,0.12); color:var(--primary); font-weight:bold;">\${l.number} • المعيار \${l.standard}</span>
              <span style="font-size:12px; color:var(--text-muted);">\${count} أسئلة</span>
            </div>
            <h3 style="font-size:17px; font-weight:900;">\${l.title}</h3>
            <p style="font-size:13px; color:var(--text-muted);">\${l.description}</p>
            <button class="btn btn-secondary" style="align-self:flex-start; margin-top:6px;" onclick="startQuiz('\${l.id}')">
              بدء هذا الدرس 🎯
            </button>
          </div>
        \`;
      }).join('');

      return \`
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
            <div>
              <h2 style="font-size: 21px; font-weight:900;">مرحباً بك يا \${state.studentName}! 👋</h2>
              <p style="font-size: 13px; color:var(--text-muted);">اختر درساً للمراجعة أو خض التحدي الشامل لجميع معايير الوحدة:</p>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="toggleDark()">
                \${state.isDark ? '☀️ النهاري' : '☾ الليلي'}
              </button>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="state.view='welcome'; render();">تغيير الاسم</button>
            </div>
          </div>

          <div style="background:rgba(37,99,235,0.1); border:1px solid rgba(37,99,235,0.25); border-radius:14px; padding:18px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <h4 style="font-size:16px; font-weight:900; color:var(--primary);">التحدي الشامل لجميع دروس الوحدة 1</h4>
              <p style="font-size:13px; color:var(--text-muted);">مراجعة شاملة لجميع المفاهيم والمعايير (\${ALL_QUESTIONS_DATA.length} سؤالاً)</p>
            </div>
            <button class="btn btn-primary" onclick="startQuiz('all')">بدء الاختبار الشامل 🏆</button>
          </div>

          <div class="canvas-wrap">
            <div style="font-weight:900; font-size:13px; margin-bottom:8px; width:100%; display:flex; justify-content:space-between; align-items:center;">
              <span>محاكي النموذج الجُسيمي:</span>
              <div style="display:flex; gap:6px;">
                <button class="tag" style="cursor:pointer;" onclick="setSimState('solid')">صلبة</button>
                <button class="tag" style="cursor:pointer;" onclick="setSimState('liquid')">سائلة</button>
                <button class="tag" style="cursor:pointer;" onclick="setSimState('gas')">غازية</button>
              </div>
            </div>
            <canvas id="simCanvas" width="280" height="130"></canvas>
            <div id="simDesc" style="font-size:12px; color:var(--text-muted); margin-top:8px; text-align:center;">
              الحالة الصلبة: جسيمات متراصة ومنتظمة تهتز في مواضعها ولا تتدفق.
            </div>
          </div>

          <div>
            \${lessonsHtml}
          </div>
        </div>
      \`;
    }

    function setSimState(mode) {
      state.simState = mode;
      const desc = document.getElementById('simDesc');
      if (desc) {
        if (mode === 'solid') desc.innerText = 'الحالة الصلبة: جسيمات متراصة ومنتظمة تهتز في مواضعها ولا تتدفق ولها شكل وحجم ثابتان.';
        if (mode === 'liquid') desc.innerText = 'الحالة السائلة: جسيمات متلامسة تنزلق وتتحرك ببطء بعضها فوق بعض مما يسمح لها بالتدفق.';
        if (mode === 'gas') desc.innerText = 'الحالة الغازية: جسيمات متباعدة جداً تتحرك بسرعة كبيرة وتتصادم وتنتشر لتملا الوعاء.';
      }
    }

    function renderQuiz() {
      const q = state.questions[state.currentIndex];
      const progressPercent = Math.round(((state.currentIndex) / state.questions.length) * 100);

      let optionsHtml = '';
      if (q.type === 'boolean') {
        optionsHtml = \`
          <div class="grid-2">
            <button class="btn btn-secondary" style="padding:20px; font-size:16px;" \${state.currentFeedback ? 'disabled' : ''} onclick="handleAnswer(\${q.correctAnswer === true}, 'صح')">
              ✅ صحيحة (صح)
            </button>
            <button class="btn btn-secondary" style="padding:20px; font-size:16px;" \${state.currentFeedback ? 'disabled' : ''} onclick="handleAnswer(\${q.correctAnswer === false}, 'خطأ')">
              ❌ غير صحيحة (خطأ)
            </button>
          </div>
        \`;
      } else {
        optionsHtml = q.options.map((opt, idx) => {
          const letter = ['أ', 'ب', 'ج', 'د'][idx] || (idx + 1);
          return \`
            <button class="option-btn" \${state.currentFeedback ? 'disabled' : ''} onclick="handleAnswer(\${idx === q.correctAnswerIndex}, '\${opt.replace(/'/g, "\\\\'")}')">
              <span class="letter-badge">\${letter}</span>
              <span>\${opt}</span>
            </button>
          \`;
        }).join('');
      }

      let feedbackHtml = '';
      if (state.currentFeedback) {
        const isCorr = state.currentFeedback.isCorrect;
        const correctText = q.type === 'boolean' ? (q.correctAnswer ? 'صحيحة (صح)' : 'غير صحيحة (خطأ)') : q.options[q.correctAnswerIndex];
        feedbackHtml = \`
          <div class="feedback-box \${isCorr ? 'correct' : 'incorrect'}">
            <div class="feedback-title">\${isCorr ? 'أحسنت! إجابة صحيحة ✓' : 'حاول مرة أخرى! إجابة غير صحيحة ✕'}</div>
            \${!isCorr ? \`<div style="font-weight:bold; margin-bottom:8px;">الإجابة الصحيحة: \${correctText}</div>\` : ''}
            <div class="feedback-explanation">
              <strong>التفسير العلمي:</strong><br>
              \${q.explanation}
            </div>
            \${!isCorr ? \`<p style="font-size:12px; margin-top:8px; font-weight:bold;">📌 المفهوم المقترح مراجعته: \${q.concept}</p>\` : ''}
            <div style="text-align:left; margin-top:16px;">
              <button class="btn btn-primary" onclick="nextQuestion()">
                \${state.currentIndex + 1 >= state.questions.length ? 'عرض النتيجة والتقرير النهائي' : 'الانتقال للسؤال التالي ⬅️'}
              </button>
            </div>
          </div>
        \`;
      }

      return \`
        <div class="card">
          <div class="header-bar">
            <div>
              <span class="tag" style="background:rgba(37,99,235,0.12); color:var(--primary); font-weight:bold;">\${q.lessonTitle}</span>
              <span class="tag" style="margin-right:6px;">المعيار: \${q.standard}</span>
            </div>
            <div class="stats">
              <span class="stat-badge">⭐ النقاط: \${state.score}</span>
              \${state.streak > 1 ? \`<span class="stat-badge streak">🔥 متتالية: \${state.streak}</span>\` : ''}
              <span style="font-size:13px; font-weight:bold; color:var(--text-muted);">
                السؤال \${state.currentIndex + 1} / \${state.questions.length}
              </span>
            </div>
          </div>

          <div class="progress-wrap">
            <div class="progress-bar" style="width: \${progressPercent}%"></div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: 13px; color: var(--accent); font-weight:bold; margin-bottom: 6px;">المفهوم: \${q.concept}</div>
            <h2 style="font-size: 20px; font-weight: 900; line-height: 1.5;">\${q.question}</h2>
          </div>

          <div>
            \${optionsHtml}
          </div>

          \${feedbackHtml}
        </div>
      \`;
    }

    function renderReport() {
      const total = state.answers.length;
      const correct = state.answers.filter(a => a.isCorrect).length;
      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

      let tier = 'يحتاج إلى مراجعة';
      let tierColor = '#d97706';
      if (percent >= 90) { tier = 'ممتاز 🌟'; tierColor = '#059669'; }
      else if (percent >= 75) { tier = 'جيد جداً 👏'; tierColor = '#2563eb'; }
      else if (percent >= 60) { tier = 'جيد 👍'; tierColor = '#0284c7'; }

      const mistakes = state.answers.filter(a => !a.isCorrect);
      const uniqueMistakeConcepts = Array.from(new Set(mistakes.map(m => m.question.concept)));
      const uniqueStrengthConcepts = Array.from(new Set(state.answers.filter(a => a.isCorrect).map(a => a.question.concept)));

      return \`
        <div class="card" style="text-align: center;">
          <h1 style="font-size: 26px; font-weight: 900; margin-bottom: 8px;">أحسنت! لقد أكملت اللعبة 🏆</h1>
          <h2 style="font-size: 19px; color: var(--accent); margin-bottom: 16px;">تهانينا يا \${state.studentName}!</h2>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">
            مادة العلوم - الصف السابع - الوحدة الأولى: الطبيعة الجُسيمية للمادة
          </p>

          <div class="grid-2" style="margin-bottom: 24px;">
            <div style="background:rgba(37,99,235,0.1); padding:16px; border-radius:14px; border:1px solid rgba(37,99,235,0.2);">
              <span style="font-size:12px; color:var(--primary); font-weight:bold; display:block;">⭐ مجموع النقاط</span>
              <span style="font-size:30px; font-weight:900; color:var(--primary);">\${state.score}</span>
            </div>
            <div style="background:rgba(5,150,105,0.1); padding:16px; border-radius:14px; border:1px solid rgba(5,150,105,0.2);">
              <span style="font-size:12px; color:var(--success); font-weight:bold; display:block;">الإجابات الصحيحة</span>
              <span style="font-size:30px; font-weight:900; color:var(--success);">\${correct} / \${total}</span>
            </div>
            <div style="background:rgba(148,163,184,0.1); padding:16px; border-radius:14px; border:1px solid var(--card-border);">
              <span style="font-size:12px; color:var(--text-muted); font-weight:bold; display:block;">النسبة المئوية</span>
              <span style="font-size:30px; font-weight:900;">\${percent}%</span>
            </div>
            <div style="background:rgba(217,119,6,0.1); padding:16px; border-radius:14px; border:1px solid rgba(217,119,6,0.25);">
              <span style="font-size:12px; color:var(--warning); font-weight:bold; display:block;">مستوى الأداء</span>
              <span style="font-size:22px; font-weight:900; color:\${tierColor};">\${tier}</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; text-align:right; margin-bottom:24px;">
            <div style="background:rgba(5,150,105,0.08); border:1px solid rgba(5,150,105,0.2); padding:16px; border-radius:14px;">
              <h4 style="color:var(--success); font-size:14px; font-weight:bold; margin-bottom:8px;">نقاط القوة:</h4>
              <ul style="font-size:13px; padding-right:18px;">
                \${uniqueStrengthConcepts.slice(0, 5).map(c => \`<li>\${c}</li>\`).join('') || '<li>واصل التدرب!</li>'}
              </ul>
            </div>
            <div style="background:rgba(225,29,72,0.08); border:1px solid rgba(225,29,72,0.2); padding:16px; border-radius:14px;">
              <h4 style="color:var(--danger); font-size:14px; font-weight:bold; margin-bottom:8px;">المفاهيم التي تحتاج إلى مراجعة:</h4>
              <ul style="font-size:13px; padding-right:18px;">
                \${uniqueMistakeConcepts.map(c => \`<li>\${c}</li>\`).join('') || '<li>لا توجد أخطاء، أحسنت!</li>'}
              </ul>
            </div>
          </div>

          <div style="background:rgba(37,99,235,0.08); padding:16px; border-radius:14px; font-size:13px; text-align:right; margin-bottom:24px; border:1px solid rgba(37,99,235,0.2);">
            <strong style="color:var(--primary);">توجيه تربوي مخصص:</strong><br>
            \${uniqueMistakeConcepts.length > 0 
              ? \`ننصحك يا \${state.studentName} بمراجعة المفاهيم العلمية الموضحة أعلاه، واستخدام زر "مراجعة أخطائي" لإعادة حلها فوراً وترسيخ الفهم.\`
              : \`أداء استثنائي رائع يا \${state.studentName}! إتقان كامل وتام لجميع معايير ومفاهيم الوحدة الأولى.\`}
          </div>

          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
            \${mistakes.length > 0 ? \`
              <button class="btn btn-primary" style="background:var(--warning);" onclick="startQuiz('mistakes', true)">
                مراجعة أخطائي (\${mistakes.length}) 🔄
              </button>
            \` : ''}
            <button class="btn btn-primary" onclick="startQuiz(state.selectedLessonId)">إعادة اللعبة 🔁</button>
            <button class="btn btn-secondary" onclick="state.view='level_select'; render();">قائمة الدروس 📋</button>
            <button class="btn btn-secondary" onclick="window.print()">طباعة التقرير 🖨️</button>
          </div>
        </div>
      \`;
    }

    function render() {
      const app = document.getElementById('app');
      if (!app) return;

      if (state.view === 'welcome') {
        app.innerHTML = renderWelcome();
      } else if (state.view === 'level_select') {
        app.innerHTML = renderLevelSelect();
        initCanvasSim();
      } else if (state.view === 'quiz') {
        app.innerHTML = renderQuiz();
      } else if (state.view === 'report') {
        app.innerHTML = renderReport();
      }
    }

    let simAnimId = null;
    function initCanvasSim() {
      const canvas = document.getElementById('simCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (simAnimId) cancelAnimationFrame(simAnimId);

      let tick = 0;
      function loop() {
        tick++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = state.isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        if (state.simState === 'solid') {
          const solidRadius = 8;
          const diameter = solidRadius * 2; // 16px - touching with zero gaps
          const rows = 5;
          const cols = 12;
          const startX = (canvas.width - cols * diameter) / 2 + solidRadius;
          const startY = canvas.height - 18 - rows * diameter + solidRadius;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const bx = startX + c * diameter;
              const by = startY + r * diameter;
              const x = bx + Math.sin(tick * 0.25 + c + r) * 0.4;
              const y = by + Math.cos(tick * 0.25 + c + r) * 0.4;
              ctx.beginPath();
              ctx.arc(x, y, solidRadius, 0, Math.PI * 2);
              ctx.fillStyle = state.isDark ? '#38bdf8' : '#2563eb';
              ctx.fill();
              ctx.strokeStyle = state.isDark ? '#0284c7' : '#1d4ed8';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        } else if (state.simState === 'liquid') {
          for (let i = 0; i < 22; i++) {
            const x = 30 + (i % 7) * 28 + Math.sin(tick * 0.05 + i) * 6;
            const y = 60 + Math.floor(i / 7) * 20 + Math.cos(tick * 0.05 + i) * 4;
            ctx.beginPath();
            ctx.arc(x, y, 7, 0, Math.PI * 2);
            ctx.fillStyle = state.isDark ? '#06b6d4' : '#0284c7';
            ctx.fill();
          }
        } else {
          for (let i = 0; i < 12; i++) {
            const x = 25 + ((i * 37 + tick * 2) % (canvas.width - 50));
            const y = 25 + ((i * 29 + tick * 1.5) % (canvas.height - 50));
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = state.isDark ? '#fb7185' : '#e11d48';
            ctx.fill();
          }
        }

        simAnimId = requestAnimationFrame(loop);
      }
      loop();
    }

    window.onload = init;
  </script>
</body>
</html>`;
}
