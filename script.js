// تعریف متغیر جهانی برای وضعیت ویرایش
let editingIndex = null;

// گرفتن عناصر فرم
const form = document.getElementById("task-form");
const titleInput = document.getElementById("input-title");
const dateInput = document.getElementById("input-date");
const taskList = document.getElementById("task-list");
const submitBtn = document.getElementById("addBtn");
const categoryInput = document.getElementById("input-category");



// ایجاد کارت تسک
function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";

  taskCard.innerHTML = `
    <span class="task-title">${task.title}</span>
    <span class="task-date">${task.date}</span>
    <span class="task-category">${task.category}</span>
    <button class="task-edit"> edit</button>
    <button class="task-delete">delete</button>
  `;

  taskList.appendChild(taskCard);
//   gsap.from(taskCard, {
//   y: 100,
//   opacity: 0,
//   duration: 0.7,
//   ease: "back.out(1.7)"
// });
gsap.from(taskCard, {
  y: -70,
  opacity: 0,
  scale: 0.8,
  rotationY: 90,
  duration: 1.7,
  ease: "power4.out"
});
}

// لود اولیه تسک‌ها
window.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(createTaskCard);
});









document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    // اکتیو کردن تب فعلی
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;
    renderTasksByCategory(category);
  });
});








// مدیریت کلیک روی دکمه‌های حذف و ویرایش
taskList.addEventListener("click", function (e) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (e.target.classList.contains("task-delete")) {
    
    const taskCard = e.target.parentElement;
    const title = taskCard.querySelector(".task-title").innerText;
    const date = taskCard.querySelector(".task-date").innerText;
    const category = taskCard.querySelector(".task-category").innerText;

    const index = tasks.findIndex(task => task.title === title && task.date === date && task.category === category);
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
    const category = taskCard.querySelector(".task-category").innerText;

    titleInput.value = title;
    dateInput.value = date;
    categoryInput.value = category;

    editingIndex = tasks.findIndex(task => task.title === title && task.date === date && task.category === category);
    submitBtn.innerText = "save";
  }
});

// ارسال فرم (افزودن یا ویرایش)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const date = dateInput.value.trim();
  const category = categoryInput.value;
  

  if (!title || !date || !category) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (editingIndex !== null) {
    // حالت ویرایش
    tasks[editingIndex] = { title, date , category };
    editingIndex = null;
    submitBtn.innerText = "add";
  } else {
    // حالت افزودن جدید
    tasks.push({ title, date , category });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  // ریست و بازسازی لیست
  form.reset();
  taskList.innerHTML = "";
  tasks.forEach(createTaskCard);
});











function renderTasksByCategory(category) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  
  const filteredTasks = category === "all"
    ? tasks
    : tasks.filter(task => task.category === category);

  filteredTasks.forEach(createTaskCard);
}
