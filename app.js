/* ============================================================
   FocusBoard - Shared Application Logic
   ============================================================ */

// ============================================================
// 1. SHARED DATABASE MODULE (localStorage database)
// ============================================================
const DB = {
  getTasks: function() {
    let tasks = localStorage.getItem('focusboard_tasks');
    if (!tasks) {
      // Initialize with default tasks if empty
      tasks = [
        { id: 1, title: "English Essay Draft", subject: "English", deadline: "2025-07-14", priority: "High", completed: false, notes: "Draft introduction and first paragraph." },
        { id: 2, title: "History Presentation", subject: "History", deadline: "2025-07-16", priority: "Medium", completed: false, notes: "Prepare slides about French Revolution." },
        { id: 3, title: "Physics Lab Report", subject: "Physics", deadline: "2025-07-18", priority: "High", completed: false, notes: "Submit graph sheet and analysis." },
        { id: 4, title: "Math Final Exam", subject: "Mathematics", deadline: "2025-07-22", priority: "High", completed: false, notes: "Review algebra and calculus chapters." },
        { id: 5, title: "Biology Project", subject: "Biology", deadline: "2025-07-25", priority: "Low", completed: false, notes: "Draw diagrams of cell structure." },
        { id: 6, title: "Read Chapter 5", subject: "Physics", deadline: "2025-07-12", priority: "Medium", completed: true, notes: "" },
        { id: 7, title: "Write essay intro", subject: "English", deadline: "2025-07-13", priority: "High", completed: true, notes: "" },
        { id: 8, title: "Math problem set #4", subject: "Mathematics", deadline: "2025-07-11", priority: "Medium", completed: true, notes: "" }
      ];
      localStorage.setItem('focusboard_tasks', JSON.stringify(tasks));
    } else {
      tasks = JSON.parse(tasks);
    }
    return tasks;
  },
  saveTasks: function(tasks) {
    localStorage.setItem('focusboard_tasks', JSON.stringify(tasks));
  },
  addTask: function(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  },
  toggleTask: function(id) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === Number(id) || t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks(tasks);
    }
    return task;
  },
  deleteTask: function(id) {
    let tasks = this.getTasks();
    tasks = tasks.filter(t => t.id !== Number(id) && t.id !== id);
    this.saveTasks(tasks);
  }
};

// Global Date Formatting Helper
function formatDeadline(dateStr) {
  if (!dateStr) return "No date";
  const today = new Date(2025, 6, 14); // July 14, 2025 is the today reference point
  const target = new Date(dateStr);
  
  // Reset hours to compare dates only
  today.setHours(0,0,0,0);
  target.setHours(0,0,0,0);
  
  const diffTime = target - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return "Overdue";
  return target.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}


// ============================================================
// 2. KRISHNAM MAKKER - index.html (Landing page mockup interactivity)
// ============================================================
function initHomePage() {
  const mockTasks = document.querySelectorAll(".mock-task");
  
  mockTasks.forEach((task, index) => {
    const check = task.querySelector(".mock-check");
    const text = task.querySelector(".mock-task-text");
    const badge = task.querySelector(".badge");
    
    if (!check || !text || !badge) return;
    
    // Store original badge states
    const originalText = badge.textContent;
    const originalClass = badge.className;
    
    task.style.cursor = "pointer";
    task.addEventListener("click", (e) => {
      // Toggle check representation
      const isDone = check.classList.toggle("done");
      text.classList.toggle("done", isDone);
      
      // Update badge
      if (isDone) {
        badge.textContent = "Done";
        badge.className = "badge badge-success";
      } else {
        if (index === 0) {
          badge.textContent = "Pending";
          badge.className = "badge badge-blue";
        } else {
          badge.textContent = originalText;
          badge.className = originalClass;
        }
      }
      
      // Update completed count in mockup stat card
      // Default completed is 4. Let's calculate delta based on check states.
      let delta = 0;
      const t1Done = mockTasks[0].querySelector(".mock-check").classList.contains("done");
      const t2Done = mockTasks[1].querySelector(".mock-check").classList.contains("done");
      const t3Done = mockTasks[2].querySelector(".mock-check").classList.contains("done");
      
      // Task 1 was originally done. If unchecked, completed goes down.
      if (!t1Done) delta--;
      // Task 2 was originally pending. If checked, completed goes up.
      if (t2Done) delta++;
      // Task 3 was originally pending. If checked, completed goes up.
      if (t3Done) delta++;
      
      const completedVal = document.querySelectorAll(".mock-card-val")[1];
      if (completedVal) {
        completedVal.textContent = (4 + delta).toString();
      }
    });
  });
}


// ============================================================
// 3. MITTAL - dashboard.html (Dashboard stats & interactive list)
// ============================================================
function initDashboardPage() {
  const greetingText = document.getElementById("dashboard-greeting-text");
  const dueCountText = document.getElementById("dashboard-due-count");
  const taskList = document.getElementById("dashboard-task-list");
  const emptyState = document.getElementById("dashboard-task-empty");
  
  if (greetingText) {
    const hour = new Date().getHours();
    let greet = "Good morning, Alex";
    if (hour >= 12 && hour < 17) greet = "Good afternoon, Alex";
    else if (hour >= 17) greet = "Good evening, Alex";
    greetingText.textContent = greet;
  }
  
  function renderDashboard() {
    const tasks = DB.getTasks();
    const todayStr = "2025-07-14";
    
    // Sort tasks: pending first, then by deadline
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    
    // Render list (showing all tasks for dashboard interaction)
    if (sortedTasks.length === 0) {
      taskList.innerHTML = "";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      taskList.innerHTML = sortedTasks.map(task => `
        <div class="task-item" data-id="${task.id}" style="cursor: pointer;">
          <div class="task-check ${task.completed ? 'done' : ''}"></div>
          <div class="task-info">
            <div class="task-name ${task.completed ? 'done' : ''}">${task.title}</div>
            <div class="task-meta">${task.subject} · Due ${formatDeadline(task.deadline)}</div>
          </div>
        </div>
      `).join("");
    }
    
    // Calculate stats relative to today (July 14, 2025)
    const todayPending = tasks.filter(t => !t.completed && t.deadline && t.deadline <= todayStr).length;
    const todayTotal = tasks.filter(t => t.deadline && t.deadline <= todayStr).length;
    
    if (dueCountText) {
      dueCountText.textContent = todayPending;
    }
    
    const statTasksTodayVal = document.getElementById("stat-tasks-today");
    const statTasksRemainingSub = document.getElementById("stat-tasks-remaining");
    if (statTasksTodayVal && statTasksRemainingSub) {
      statTasksTodayVal.textContent = todayTotal;
      statTasksRemainingSub.textContent = `${todayPending} remaining`;
    }
    
    // Focus hours
    const statFocusHours = document.getElementById("stat-focus-hours");
    if (statFocusHours) {
      const hours = localStorage.getItem("focusboard_hours") || "2.5";
      statFocusHours.textContent = hours + "h";
    }
    
    // Streak
    const statStreak = document.getElementById("stat-streak");
    if (statStreak) {
      const streak = localStorage.getItem("focusboard_streak") || "7";
      statStreak.textContent = streak + " days";
    }
    
    // Update Weekly Progress
    const subjects = [
      { name: 'Mathematics', color: '#4f7ef8' },
      { name: 'Physics', color: '#7c3aed' },
      { name: 'English', color: '#f59e0b' },
      { name: 'Biology', color: '#22c55e' }
    ];
    
    const progressSection = document.querySelector(".progress-section");
    if (progressSection) {
      progressSection.innerHTML = subjects.map((sub, idx) => {
        const subTasks = tasks.filter(t => t.subject === sub.name);
        const completedCount = subTasks.filter(t => t.completed).length;
        const pct = subTasks.length > 0 ? Math.round((completedCount / subTasks.length) * 100) : 0;
        
        return `
          <div class="progress-row" ${idx === subjects.length - 1 ? 'style="margin-bottom:0"' : ''}>
            <div class="progress-label"><span>${sub.name}</span><span>${pct}%</span></div>
            <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%; background:${sub.color}"></div></div>
          </div>
        `;
      }).join("");
    }
    
    // Update Upcoming Deadlines panel (only pending deadlines)
    const upcomingDeadlines = tasks.filter(t => !t.completed).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    const deadlineListCard = document.querySelector(".deadline-item") ? document.querySelector(".deadline-item").parentNode : null;
    
    if (deadlineListCard) {
      const top5 = upcomingDeadlines.slice(0, 5);
      let html = `<div class="section-title">Upcoming Deadlines</div>`;
      if (top5.length === 0) {
        html += `<div class="empty-state">No upcoming deadlines.</div>`;
      } else {
        html += top5.map(task => {
          const target = new Date(task.deadline);
          const day = target.getDate();
          const month = target.toLocaleDateString('en-US', { month: 'short' });
          
          const today = new Date(2025, 6, 14);
          const diffTime = target - today;
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          let badgeClass = "badge-blue";
          let badgeText = `${diffDays} days`;
          if (diffDays === 0) {
            badgeClass = "badge-danger";
            badgeText = "Today";
          } else if (diffDays === 1) {
            badgeClass = "badge-warning";
            badgeText = "Tomorrow";
          } else if (diffDays <= 3 && diffDays > 1) {
            badgeClass = "badge-warning";
            badgeText = `${diffDays} days`;
          }
          
          return `
            <div class="deadline-item">
              <div class="deadline-date"><div class="day">${day}</div><div class="mon">${month}</div></div>
              <div class="deadline-info">
                <div class="title">${task.title}</div>
                <div class="sub">${task.subject} · <span class="badge ${badgeClass}" style="font-size:11px">${badgeText}</span></div>
              </div>
            </div>
          `;
        }).join("");
      }
      html += `<a href="deadlines.html" class="btn btn-outline" style="width:100%; justify-content:center; margin-top:16px;">View All Deadlines</a>`;
      deadlineListCard.innerHTML = html;
    }
  }
  
  if (taskList) {
    taskList.addEventListener("click", (e) => {
      const taskItem = e.target.closest(".task-item");
      if (taskItem) {
        const id = taskItem.dataset.id;
        DB.toggleTask(id);
        renderDashboard();
      }
    });
  }
  
  renderDashboard();
}


// ============================================================
// 4. HARSHIT - tasks.html (Task manager with filter and add form)
// ============================================================
function initTasksPage() {
  const form = document.getElementById("task-form");
  const pendingList = document.getElementById("pending-list");
  const completedList = document.getElementById("completed-list");
  const emptyState = document.getElementById("task-empty");
  const totalCount = document.getElementById("task-total");
  const completedCount = document.getElementById("task-completed");
  const remainingCount = document.getElementById("task-remaining");
  
  let currentFilter = "all";
  
  const deadlineInput = document.getElementById("task-deadline");
  if (deadlineInput) {
    deadlineInput.value = "2025-07-14";
  }

  function getSubjectBadge(sub) {
    if (sub === 'Mathematics') return 'badge-blue';
    if (sub === 'Physics') return 'badge-purple';
    if (sub === 'English') return 'badge-pink';
    if (sub === 'History') return 'badge-warning';
    if (sub === 'Biology') return 'badge-success';
    return 'badge-blue';
  }
  
  function getPriorityBadge(priority) {
    if (priority === 'High') return 'badge-danger';
    if (priority === 'Medium') return 'badge-warning';
    return 'badge-blue';
  }

  function renderTaskCard(task) {
    return `
      <div class="card task-card" data-id="${task.id}">
        <div class="task-card-check ${task.completed ? 'done' : ''}"></div>
        <div class="task-card-body">
          <div class="task-card-title ${task.completed ? 'done' : ''}">${task.title}</div>
          <div class="task-card-meta">
            <span class="badge ${getSubjectBadge(task.subject)}">${task.subject}</span>
            <span class="meta-dot">•</span>
            <span>Due ${formatDeadline(task.deadline)}</span>
            <span class="meta-dot">•</span>
            <span class="badge ${getPriorityBadge(task.priority)}">${task.priority} Priority</span>
            ${task.notes ? `<span class="meta-dot">•</span><span style="color:var(--text-light); font-style:italic;">${task.notes}</span>` : ''}
          </div>
        </div>
        <button class="task-delete-btn" style="background:none; border:none; color:var(--text-light); font-size:18px; cursor:pointer; padding:4px;" title="Delete task">&times;</button>
      </div>
    `;
  }

  function renderTasks() {
    const tasks = DB.getTasks();
    
    // Update summary metrics
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    
    if (totalCount) totalCount.textContent = total;
    if (completedCount) completedCount.textContent = completed;
    if (remainingCount) remainingCount.textContent = remaining;
    
    // Filter tasks
    let filteredTasks = tasks;
    const todayStr = "2025-07-14";
    
    if (currentFilter === "pending") {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === "due-today") {
      filteredTasks = tasks.filter(t => t.deadline === todayStr);
    } else if (currentFilter.startsWith("subject:")) {
      const sub = currentFilter.split(":")[1];
      filteredTasks = tasks.filter(t => t.subject === sub);
    }
    
    const pending = filteredTasks.filter(t => !t.completed);
    const completedListItems = filteredTasks.filter(t => t.completed);
    
    const pendingSection = document.querySelector('.task-section[data-section="pending"]');
    const completedSection = document.querySelector('.task-section[data-section="completed"]');
    
    if (filteredTasks.length === 0) {
      pendingList.innerHTML = "";
      completedList.innerHTML = "";
      if (pendingSection) pendingSection.style.display = "none";
      if (completedSection) completedSection.style.display = "none";
      emptyState.style.display = "block";
      return;
    }
    
    emptyState.style.display = "none";
    
    // Render Pending tasks list
    if (currentFilter === "completed") {
      if (pendingSection) pendingSection.style.display = "none";
    } else {
      if (pendingSection) pendingSection.style.display = "block";
      if (pending.length === 0) {
        pendingList.innerHTML = `<div class="empty-state">No pending tasks.</div>`;
      } else {
        pendingList.innerHTML = pending.map(task => renderTaskCard(task)).join("");
      }
    }
    
    // Render Completed tasks list
    if (currentFilter === "pending") {
      if (completedSection) completedSection.style.display = "none";
    } else {
      if (completedSection) completedSection.style.display = "block";
      if (completedListItems.length === 0) {
        completedList.innerHTML = `<div class="empty-state">No completed tasks.</div>`;
      } else {
        completedList.innerHTML = completedListItems.map(task => renderTaskCard(task)).join("");
      }
    }
  }
  
  // Set up event delegation for checking and deleting
  [pendingList, completedList].forEach(list => {
    if (list) {
      list.addEventListener("click", (e) => {
        const taskCard = e.target.closest(".task-card");
        if (!taskCard) return;
        const id = taskCard.dataset.id;
        
        if (e.target.classList.contains("task-delete-btn")) {
          DB.deleteTask(id);
          renderTasks();
        } else {
          DB.toggleTask(id);
          renderTasks();
        }
      });
    }
  });
  
  // Filter pills click
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
  
  // Form submission logic
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const title = document.getElementById("task-title").value.trim();
      const subject = document.getElementById("task-subject").value;
      const deadline = document.getElementById("task-deadline").value;
      const priority = document.getElementById("task-priority").value;
      const notes = document.getElementById("task-notes").value.trim();
      
      if (!title) return;
      
      const newTask = {
        id: Date.now(),
        title,
        subject,
        deadline,
        priority,
        completed: false,
        notes
      };
      
      DB.addTask(newTask);
      form.reset();
      if (deadlineInput) {
        deadlineInput.value = "2025-07-14";
      }
      renderTasks();
    });
  }
  
  renderTasks();
}


// ============================================================
// 5. NAVEEN MAAN - deadlines.html (Calendar grid & deadlines list)
// ============================================================
function initDeadlinesPage() {
  const calMonth = document.getElementById("cal-month");
  const calGrid = document.getElementById("cal-grid");
  const upcomingList = document.getElementById("upcoming-list");
  const emptyState = document.getElementById("deadlines-empty");
  const countText = document.getElementById("deadlines-count");
  
  let currentYear = 2025;
  let currentMonth = 6; // July (0-indexed)
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  function getSubjectDotClass(sub) {
    if (sub === 'Mathematics') return 'dot-math';
    if (sub === 'Physics') return 'dot-physics';
    if (sub === 'English') return 'dot-english';
    if (sub === 'History') return 'dot-history';
    if (sub === 'Biology') return 'dot-biology';
    return '';
  }
  
  function getSubjectBadge(sub) {
    if (sub === 'Mathematics') return 'badge-blue';
    if (sub === 'Physics') return 'badge-purple';
    if (sub === 'English') return 'badge-pink';
    if (sub === 'History') return 'badge-warning';
    if (sub === 'Biology') return 'badge-success';
    return 'badge-blue';
  }
  
  function getSubjectColor(sub) {
    if (sub === 'Mathematics') return '#4f7ef8';
    if (sub === 'Physics') return '#7c3aed';
    if (sub === 'English') return '#be185d';
    if (sub === 'History') return '#f59e0b';
    if (sub === 'Biology') return '#22c55e';
    return '#4f7ef8';
  }

  function renderCalendar() {
    const tasks = DB.getTasks();
    
    if (calMonth) {
      calMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Calendar calculation
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    let cellsHtml = "";
    
    // Prev month days
    for (let x = firstDayIndex; x > 0; x--) {
      cellsHtml += `<div class="cal-day other-month"><div class="cal-day-num">${prevLastDay - x + 1}</div></div>`;
    }
    
    // Current month days
    for (let i = 1; i <= lastDay; i++) {
      const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.deadline === dayStr);
      
      const isToday = currentYear === 2025 && currentMonth === 6 && i === 14;
      
      let dayClass = "cal-day";
      if (isToday) dayClass += " today";
      if (dayTasks.length > 0) dayClass += " has-deadline";
      
      let dotsHtml = "";
      if (dayTasks.length > 0) {
        dotsHtml = `<div class="cal-dots">${dayTasks.map(t => `<div class="cal-dot ${getSubjectDotClass(t.subject)}" title="${t.title}"></div>`).join("")}</div>`;
      }
      
      cellsHtml += `
        <div class="${dayClass}" data-date="${dayStr}">
          <div class="cal-day-num">${i}</div>
          ${dotsHtml}
        </div>
      `;
    }
    
    // Next month days
    const totalCells = firstDayIndex + lastDay;
    const remainingCells = 42 - totalCells;
    for (let j = 1; j <= remainingCells; j++) {
      cellsHtml += `<div class="cal-day other-month"><div class="cal-day-num">${j}</div></div>`;
    }
    
    if (calGrid) {
      calGrid.innerHTML = cellsHtml;
    }
    
    // Render side panel pending deadlines
    const pendingDeadlines = tasks.filter(t => !t.completed).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    if (countText) {
      const activeMonthDeadlines = pendingDeadlines.filter(t => {
        if (!t.deadline) return false;
        const d = new Date(t.deadline);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });
      countText.textContent = `${activeMonthDeadlines.length} upcoming deadlines this month`;
    }
    
    if (pendingDeadlines.length === 0) {
      upcomingList.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
    } else {
      if (emptyState) emptyState.style.display = "none";
      upcomingList.innerHTML = pendingDeadlines.map(task => `
        <div class="dl-item" data-id="${task.id}" style="cursor: pointer;">
          <div class="dl-top">
            <div class="dl-title">${task.title}</div>
            <span class="badge ${getSubjectBadge(task.subject)}">${task.subject}</span>
          </div>
          <div class="dl-date">Due ${formatDeadline(task.deadline)}</div>
          <div class="dl-bar-wrap">
            <div class="progress-wrap"><div class="progress-bar" style="width:${task.completed ? '100%' : '0%'}; background:${getSubjectColor(task.subject)}"></div></div>
          </div>
        </div>
      `).join("");
    }
  }
  
  // Nav buttons listeners
  const prevBtn = document.querySelector('[data-cal-nav="prev"]');
  const nextBtn = document.querySelector('[data-cal-nav="next"]');
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }
  
  // Toggle status clicking upcoming list
  if (upcomingList) {
    upcomingList.addEventListener("click", (e) => {
      const dlItem = e.target.closest(".dl-item");
      if (dlItem) {
        const id = dlItem.dataset.id;
        DB.toggleTask(id);
        renderCalendar();
      }
    });
  }
  
  renderCalendar();
}


// ============================================================
// 6. MITTAL - focus.html (Pomodoro timer with session control)
// ============================================================
function initFocusPage() {
  const timerDisplay = document.getElementById("timer-display");
  const progressCircle = document.getElementById("timer-ring-progress");
  const playBtn = document.getElementById("focus-play");
  const restartBtn = document.getElementById("focus-restart");
  const skipBtn = document.getElementById("focus-skip");
  
  const taskNameText = document.getElementById("current-task-name");
  const taskSubText = document.getElementById("current-task-sub");
  
  const sessionsVal = document.getElementById("stat-sessions");
  const focusTimeVal = document.getElementById("stat-focus-time");
  const breaksVal = document.getElementById("stat-breaks");
  
  const tabs = document.querySelectorAll(".session-tab");
  
  let currentMode = "pomodoro";
  let isRunning = false;
  let timerInterval = null;
  
  const durations = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };
  
  let totalDuration = durations.pomodoro;
  let timeLeft = totalDuration;
  
  // Retrieve metrics
  let sessions = Number(localStorage.getItem("focusboard_sessions")) || 3;
  let focusTimeMin = Number(localStorage.getItem("focusboard_focus_time_min")) || 75;
  let breaks = Number(localStorage.getItem("focusboard_breaks")) || 2;
  
  function updateStatsUI() {
    if (sessionsVal) sessionsVal.textContent = sessions;
    if (breaksVal) breaksVal.textContent = breaks;
    if (focusTimeVal) {
      const hrs = Math.floor(focusTimeMin / 60);
      const mins = focusTimeMin % 60;
      focusTimeVal.textContent = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    }
    
    localStorage.setItem("focusboard_sessions", sessions);
    localStorage.setItem("focusboard_focus_time_min", focusTimeMin);
    localStorage.setItem("focusboard_breaks", breaks);
    localStorage.setItem("focusboard_hours", (focusTimeMin / 60).toFixed(1));
  }
  
  function updateTimerUI() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    
    if (timerDisplay) {
      timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    if (progressCircle) {
      const circumference = 754; // 2 * Math.PI * 120
      const offset = circumference * (1 - timeLeft / totalDuration);
      progressCircle.style.strokeDashoffset = offset;
    }
  }
  
  function setMode(mode) {
    currentMode = mode;
    totalDuration = durations[mode];
    timeLeft = totalDuration;
    
    tabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.session === mode);
    });
    
    pause();
    updateTimerUI();
  }
  
  function play() {
    if (isRunning) return;
    isRunning = true;
    if (playBtn) playBtn.textContent = "❚❚";
    
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timerInterval);
        isRunning = false;
        handleTimerComplete();
      } else {
        updateTimerUI();
      }
    }, 1000);
  }
  
  function pause() {
    isRunning = false;
    if (playBtn) playBtn.textContent = "▶";
    clearInterval(timerInterval);
  }
  
  function handleTimerComplete() {
    alert(`Time is up! Your ${currentMode === 'pomodoro' ? 'Focus' : 'Break'} session is complete.`);
    
    if (currentMode === "pomodoro") {
      sessions++;
      focusTimeMin += 25;
      updateStatsUI();
      setMode("short");
    } else {
      breaks++;
      updateStatsUI();
      setMode("pomodoro");
    }
  }
  
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (isRunning) {
        pause();
      } else {
        play();
      }
    });
  }
  
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      pause();
      timeLeft = totalDuration;
      updateTimerUI();
    });
  }
  
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      pause();
      if (confirm("Are you sure you want to skip this session?")) {
        if (currentMode === "pomodoro") {
          setMode("short");
        } else {
          setMode("pomodoro");
        }
      }
    });
  }
  
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      setMode(tab.dataset.session);
    });
  });
  
  function updateActiveTask() {
    const tasks = DB.getTasks();
    const activeTask = tasks.find(t => !t.completed);
    
    if (activeTask && taskNameText && taskSubText) {
      taskNameText.textContent = activeTask.title;
      taskSubText.textContent = `${activeTask.subject} · Due ${formatDeadline(activeTask.deadline)}`;
    } else if (taskNameText && taskSubText) {
      taskNameText.textContent = "No pending tasks!";
      taskSubText.textContent = "Take a break or create a task on Tasks page.";
    }
  }
  
  updateStatsUI();
  setMode("pomodoro");
  updateActiveTask();
}


// ============================================================
// PAGE INITIATOR ROUTER
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") {
    initHomePage();
  } else if (page === "dashboard") {
    initDashboardPage();
  } else if (page === "tasks") {
    initTasksPage();
  } else if (page === "deadlines") {
    initDeadlinesPage();
  } else if (page === "focus") {
    initFocusPage();
  }
});
