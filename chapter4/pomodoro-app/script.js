class PomodoroTimer {
    constructor() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.modeIndicator = document.getElementById('mode-indicator');
        this.statusMessage = document.getElementById('status-message');
        this.sessionCountDisplay = document.getElementById('session-count');

        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.WORK_TIME = 25 * 60; // 25 minutes
        this.SHORT_BREAK = 5 * 60; // 5 minutes
        this.LONG_BREAK = 20 * 60; // 20 minutes
        this.SESSIONS_BEFORE_LONG_BREAK = 4;

        this.timeLeft = this.WORK_TIME;
        this.timerId = null;
        this.isRunning = false;
        this.isWorkSession = true;
        this.completedSessions = 0;

        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggleBtn.querySelector('.icon');

        this.historyList = document.getElementById('history-list');
        this.exportBtn = document.getElementById('export-history-btn');
        this.history = [];

        this.initializeEventListeners();
        this.initializeTheme();
        this.loadHistory();
        this.updateDisplay();
        this.renderHistory();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        this.exportBtn.addEventListener('click', () => this.exportHistory());
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('pomodoro-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            this.themeIcon.textContent = '🌙';
        } else {
            this.themeIcon.textContent = '☀️';
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        this.themeIcon.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('pomodoro-theme', isLight ? 'light' : 'dark');
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;

        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');

        // Update document title for visibility in tabs
        document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Pomodoro`;
    }

    startTimer() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.statusMessage.textContent = this.isWorkSession ? "집중하세요!" : "편안하게 휴식하세요.";

        this.timerId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateDisplay();
            } else {
                this.handleTimerComplete();
            }
        }, 1000);
    }

    pauseTimer() {
        if (!this.isRunning) return;

        clearInterval(this.timerId);
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.statusMessage.textContent = "일시정지됨";
    }

    resetTimer() {
        this.pauseTimer();
        this.isWorkSession = true;
        this.timeLeft = this.WORK_TIME;
        this.updateModeUI();
        this.updateDisplay();
        this.statusMessage.textContent = "준비되셨나요?";
        document.title = "Pomodoro Timer";
    }

    handleTimerComplete() {
        this.pauseTimer();

        if (this.isWorkSession) {
            this.addHistoryEntry('집중', this.WORK_TIME);
            this.completedSessions++;
            this.sessionCountDisplay.textContent = this.completedSessions;

            if (this.completedSessions % this.SESSIONS_BEFORE_LONG_BREAK === 0) {
                this.startLongBreak();
            } else {
                this.startShortBreak();
            }
        } else {
            const duration = (this.completedSessions % this.SESSIONS_BEFORE_LONG_BREAK === 0)
                ? this.LONG_BREAK
                : this.SHORT_BREAK;
            const type = (this.completedSessions % this.SESSIONS_BEFORE_LONG_BREAK === 0)
                ? '긴 휴식'
                : '짧은 휴식';
            this.addHistoryEntry(type, duration);
            this.startWork();
        }
    }

    startWork() {
        this.isWorkSession = true;
        this.timeLeft = this.WORK_TIME;
        this.updateModeUI();
        this.updateDisplay();
        this.statusMessage.textContent = "작업 세션 시작";
        // Optional: Auto-start next session? For now, let user start manually or keep stopped.
        // Alert user
        alert("휴식이 끝났습니다! 다시 집중해볼까요?");
    }

    startShortBreak() {
        this.isWorkSession = false;
        this.timeLeft = this.SHORT_BREAK;
        this.updateModeUI();
        this.updateDisplay();
        this.statusMessage.textContent = "짧은 휴식 시간";
        alert("작업 완료! 5분간 휴식하세요.");
    }

    startLongBreak() {
        this.isWorkSession = false;
        this.timeLeft = this.LONG_BREAK;
        this.updateModeUI();
        this.updateDisplay();
        this.statusMessage.textContent = "긴 휴식 시간";
        alert("4개의 세션을 완료했습니다! 20분간 푹 쉬세요.");
    }

    updateModeUI() {
        const body = document.body;
        if (this.isWorkSession) {
            body.classList.remove('rest-mode');
            this.modeIndicator.textContent = "Focus Time";
            this.modeIndicator.style.color = "var(--accent-color)";
            this.modeIndicator.style.backgroundColor = "rgba(187, 134, 252, 0.1)";
        } else {
            body.classList.add('rest-mode');
            this.modeIndicator.textContent = this.timeLeft === this.LONG_BREAK ? "Long Break" : "Short Break";
        }
    }

    loadHistory() {
        try {
            this.history = JSON.parse(localStorage.getItem('pomodoro-history')) || [];
        } catch (e) {
            this.history = [];
        }
    }

    saveHistory() {
        localStorage.setItem('pomodoro-history', JSON.stringify(this.history));
    }

    addHistoryEntry(type, duration) {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            type: type,
            duration: duration
        };
        this.history.unshift(entry);
        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach(entry => {
            const li = document.createElement('li');
            const date = new Date(entry.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const durationMin = Math.floor(entry.duration / 60);

            li.innerHTML = `
                <div>
                    <strong>${entry.type}</strong>
                    <span class="history-time"> - ${dateStr}</span>
                </div>
                <span>${durationMin}분</span>
            `;
            this.historyList.appendChild(li);
        });
    }

    exportHistory() {
        if (this.history.length === 0) {
            alert('내보낼 히스토리가 없습니다.');
            return;
        }

        const escapeCsv = (str) => {
            if (str === null || str === undefined) return '';
            const stringValue = String(str);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        const BOM = '\uFEFF';
        const csvHeader = ['Date', 'Type', 'Duration (Seconds)', 'Duration (Minutes)'];

        const rows = this.history.map(e => {
            const date = new Date(e.date).toLocaleString();
            return [
                date,
                e.type,
                e.duration,
                (e.duration / 60).toFixed(1)
            ];
        });

        const csvContent = BOM + [
            csvHeader.map(escapeCsv).join(','),
            ...rows.map(row => row.map(escapeCsv).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'pomodoro_history.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
});
