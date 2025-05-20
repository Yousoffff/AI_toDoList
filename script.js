// تعریف متغیر جهانی برای وضعیت ویرایش
let editingIndex = null;

// گرفتن عناصر فرم
const form = document.getElementById("task-form");
const titleInput = document.getElementById("input-title");
const dateInput = document.getElementById("input-date");
const taskList = document.getElementById("task-list");
const submitBtn = document.getElementById("addBtn");

// ایجاد کارت تسک
function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";

  taskCard.innerHTML = `
    <span class="task-title">${task.title}</span>
    
    <span class="task-date">${task.date}</span>
    <button class="task-edit"> edit</button>
    <button class="task-delete">delete</button>
    
  `;

  taskList.appendChild(taskCard);
  gsap.from(taskCard, {
  y: 100,
  opacity: 0,
  duration: 0.7,
  ease: "back.out(1.7)"
});
}

// لود اولیه تسک‌ها
window.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(createTaskCard);
});

// مدیریت کلیک روی دکمه‌های حذف و ویرایش
taskList.addEventListener("click", function (e) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (e.target.classList.contains("task-delete")) {
    
    const taskCard = e.target.parentElement;
    const title = taskCard.querySelector(".task-title").innerText;
    const date = taskCard.querySelector(".task-date").innerText;

    const index = tasks.findIndex(task => task.title === title && task.date === date);
    const tl = gsap.timeline({
      onComplete: () => {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskList.innerHTML = "";
        tasks.forEach(createTaskCard);
      }
    });
      
      tl.to(taskCard, {
      scale: 0.9,
      backgroundColor: "#ffebee",
      duration: 0.2
    })
    .to(taskCard, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: "back.in(1.7)"
    });
   
  }

  if (e.target.classList.contains("task-edit")) {
    const taskCard = e.target.parentElement;
    const title = taskCard.querySelector(".task-title").innerText;
    const date = taskCard.querySelector(".task-date").innerText;

    titleInput.value = title;
    dateInput.value = date;

    editingIndex = tasks.findIndex(task => task.title === title && task.date === date);
    submitBtn.innerText = "save";
  }
});

// ارسال فرم (افزودن یا ویرایش)
form.addEventListener("submit", function (e) {
  e.preventDefault();

 

  const title = titleInput.value.trim();
  const date = dateInput.value.trim();
  if (!title || !date) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (editingIndex !== null) {
    // حالت ویرایش
    tasks[editingIndex] = { title, date };
    editingIndex = null;
    submitBtn.innerText = "add";
  } else {
    // حالت افزودن جدید
    tasks.push({ title, date });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  // ریست و بازسازی لیست
  form.reset();
  taskList.innerHTML = "";
  tasks.forEach(createTaskCard);
});


