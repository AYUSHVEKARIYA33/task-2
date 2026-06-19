const API_BASE = "/api/students";

const elements = {
  form: document.getElementById("studentForm"),
  studentId: document.getElementById("studentId"),
  formTitle: document.getElementById("formTitle"),
  formMessage: document.getElementById("formMessage"),
  totalStudents: document.getElementById("totalStudents"),
  visibleStudents: document.getElementById("visibleStudents"),
  studentsList: document.getElementById("studentsList"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  searchButton: document.getElementById("searchButton"),
  loadAllButton: document.getElementById("loadAllButton"),
  resetButton: document.getElementById("resetButton"),
};

const fieldIds = ["name", "email", "course", "age"];

const state = {
  students: [],
  mode: "all",
  searchTerm: "",
};

const setMessage = (text, type = "") => {
  elements.formMessage.textContent = text;
  elements.formMessage.className = `message ${type}`.trim();
};

const getFormData = () => ({
  name: document.getElementById("name").value.trim(),
  email: document.getElementById("email").value.trim(),
  course: document.getElementById("course").value.trim(),
  age: Number(document.getElementById("age").value),
});

const clearForm = () => {
  elements.form.reset();
  elements.studentId.value = "";
  elements.formTitle.textContent = "Add Student";
  elements.form.querySelector("button[type='submit']").textContent = "Save Student";
};

const fillForm = (student) => {
  elements.studentId.value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("course").value = student.course;
  document.getElementById("age").value = student.age;
  elements.formTitle.textContent = `Edit Student #${student.id}`;
  elements.form.querySelector("button[type='submit']").textContent = "Update Student";
  setMessage(`Editing ${student.name}.`, "success");
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.details = data.errors || [];
    throw error;
  }

  return data;
};

const loadCount = async () => {
  const data = await apiRequest(`${API_BASE}/count`);
  elements.totalStudents.textContent = data.count;
};

const buildQuery = () => {
  const params = new URLSearchParams();
  const sort = elements.sortSelect.value;
  const search = elements.searchInput.value.trim();

  if (sort) params.set("sort", sort);
  return { params, search };
};

const loadStudents = async () => {
  try {
    setMessage("", "");
    const { params, search } = buildQuery();

    let endpoint = API_BASE;
    if (search) {
      endpoint = `${API_BASE}/search?name=${encodeURIComponent(search)}`;
      state.mode = "search";
      state.searchTerm = search;
    } else if (params.toString()) {
      endpoint = `${API_BASE}?${params.toString()}`;
      state.mode = "sorted";
      state.searchTerm = "";
    } else {
      state.mode = "all";
      state.searchTerm = "";
    }

    const data = await apiRequest(endpoint);
    state.students = data.data || [];
    elements.visibleStudents.textContent = state.students.length;
    renderStudents();
    await loadCount();
  } catch (error) {
    setMessage(error.message, "error");
    renderStudents([]);
  }
};

const renderStudents = (students = state.students) => {
  if (!students.length) {
    elements.studentsList.innerHTML = `
      <div class="empty-state">
        No students found. Add a student or clear the search to load all records.
      </div>
    `;
    return;
  }

  elements.studentsList.innerHTML = students
    .map(
      (student) => `
        <article class="student-card">
          <div class="student-top">
            <div>
              <h3 class="student-name">${student.name}</h3>
              <p class="student-meta">${student.email}</p>
            </div>
            <span class="student-badge">ID ${student.id}</span>
          </div>
          <div class="student-meta">
            <div><strong>Course:</strong> ${student.course}</div>
            <div><strong>Age:</strong> ${student.age}</div>
          </div>
          <div class="student-actions">
            <button class="student-action" data-action="edit" data-id="${student.id}">Edit</button>
            <button class="student-action danger" data-action="delete" data-id="${student.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
};

const createOrUpdateStudent = async (event) => {
  event.preventDefault();

  const formData = getFormData();
  if (!formData.name || !formData.email || !formData.course || !formData.age) {
    setMessage("Please complete all fields before saving.", "error");
    return;
  }

  try {
    const studentId = elements.studentId.value;
    const isEditMode = Boolean(studentId);
    const method = isEditMode ? "PUT" : "POST";
    const endpoint = isEditMode ? `${API_BASE}/${studentId}` : API_BASE;

    await apiRequest(endpoint, {
      method,
      body: JSON.stringify(formData),
    });

    setMessage(isEditMode ? "Student updated successfully." : "Student created successfully.", "success");
    clearForm();
    await loadStudents();
  } catch (error) {
    const details = error.details && error.details.length ? ` ${error.details.join(" ")}` : "";
    setMessage(`${error.message}.${details}`.trim(), "error");
  }
};

const handleListClick = async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    const student = state.students.find((item) => String(item.id) === String(id));
    if (student) fillForm(student);
    return;
  }

  if (action === "delete") {
    const shouldDelete = window.confirm("Delete this student record?");
    if (!shouldDelete) return;

    try {
      await apiRequest(`${API_BASE}/${id}`, { method: "DELETE" });
      setMessage("Student deleted successfully.", "success");
      if (String(elements.studentId.value) === String(id)) {
        clearForm();
      }
      await loadStudents();
    } catch (error) {
      setMessage(error.message, "error");
    }
  }
};

const wireEvents = () => {
  elements.form.addEventListener("submit", createOrUpdateStudent);
  elements.studentsList.addEventListener("click", handleListClick);
  elements.searchButton.addEventListener("click", loadStudents);
  elements.loadAllButton.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.sortSelect.value = "";
    loadStudents();
  });
  elements.sortSelect.addEventListener("change", loadStudents);
  elements.resetButton.addEventListener("click", () => {
    clearForm();
    setMessage("Form reset.", "success");
  });

  elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loadStudents();
    }
  });
};

const init = async () => {
  wireEvents();
  clearForm();
  await loadStudents();
};

init();
