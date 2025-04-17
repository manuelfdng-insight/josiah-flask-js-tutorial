/**
 * TodoManager - Class for managing todos in the UI
 */
class TodoManager {
  constructor(api) {
    this.api = api;
    this.todos = [];
    this.currentFilter = "all";
    this.currentEditId = null;

    // DOM Elements
    this.todoList = document.getElementById("todo-list");
    this.todoForm = document.getElementById("todo-form");
    this.titleInput = document.getElementById("title");
    this.descriptionInput = document.getElementById("description");
    this.updateBtn = document.getElementById("update-btn");
    this.cancelBtn = document.getElementById("cancel-btn");
    this.emptyState = document.getElementById("empty-state");
    this.currentFilterDisplay = document.getElementById("current-filter");

    // Templates
    this.todoItemTemplate = document.getElementById("todo-item-template");
  }

  /**
   * Initialize the todo manager
   */
  async init() {
    this.bindEvents();
    await this.loadTodos();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submission
    this.todoForm.addEventListener("submit", this.handleSubmit.bind(this));

    // Update and cancel buttons
    this.updateBtn.addEventListener("click", this.handleUpdate.bind(this));
    this.cancelBtn.addEventListener("click", this.cancelEdit.bind(this));

    // Filter options
    document.querySelectorAll(".filter-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        const filter = e.target.dataset.filter;
        this.setFilter(filter);
      });
    });
  }

  /**
   * Handle form submission for new todos
   */
  async handleSubmit(e) {
    e.preventDefault();

    const title = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();

    if (!title) return;

    try {
      const newTodo = await this.api.createTodo({ title, description });
      this.todos.unshift(newTodo);
      this.renderTodos();
      this.resetForm();
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert("Failed to create todo. Please try again.");
    }
  }

  /**
   * Handle todo update
   */
  async handleUpdate() {
    if (!this.currentEditId) return;

    const title = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();

    if (!title) return;

    try {
      const updatedTodo = await this.api.updateTodo(this.currentEditId, {
        title,
        description,
      });
      const index = this.todos.findIndex(
        (todo) => todo.id === this.currentEditId,
      );

      if (index !== -1) {
        this.todos[index] = updatedTodo;
        this.renderTodos();
      }

      this.resetForm();
      this.exitEditMode();
    } catch (error) {
      console.error("Failed to update todo:", error);
      alert("Failed to update todo. Please try again.");
    }
  }

  /**
   * Load todos from the API
   */
  async loadTodos() {
    try {
      this.todos = await this.api.getTodos(
        this.currentFilter !== "all" ? this.currentFilter : null,
      );
      this.renderTodos();
    } catch (error) {
      console.error("Failed to load todos:", error);
      alert("Failed to load todos. Please try refreshing the page.");
    }
  }

  /**
   * Render the todo list
   */
  renderTodos() {
    // Clear all todo items but keep the empty state element
    const children = Array.from(this.todoList.children);
    children.forEach((child) => {
      if (child !== this.emptyState) {
        child.remove();
      }
    });

    // Show or hide empty state
    if (this.todos.length === 0) {
      this.emptyState.classList.remove("d-none");
    } else {
      this.emptyState.classList.add("d-none");

      // Add todo items
      this.todos.forEach((todo) => {
        const todoElement = this.createTodoElement(todo);
        this.todoList.appendChild(todoElement);
      });
    }
  }

  /**
   * Create a todo item element
   */
  createTodoElement(todo) {
    const clone = this.todoItemTemplate.content.cloneNode(true);
    const todoItem = clone.querySelector(".todo-item");

    // Set data attribute for easy access
    todoItem.dataset.id = todo.id;

    // Mark as completed if necessary
    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    // Fill in the details
    const title = todoItem.querySelector(".todo-title");
    const description = todoItem.querySelector(".todo-description");
    const date = todoItem.querySelector(".todo-date");
    const checkbox = todoItem.querySelector(".todo-check");

    title.textContent = todo.title;
    description.textContent = todo.description || "";
    date.textContent = `Created: ${new Date(todo.created_at).toLocaleDateString()}`;
    checkbox.checked = todo.completed;

    // Add event listeners

    // Checkbox for toggling completion
    checkbox.addEventListener("change", async () => {
      try {
        await this.api.toggleCompleted(todo.id, checkbox.checked);
        const index = this.todos.findIndex((t) => t.id === todo.id);

        if (index !== -1) {
          this.todos[index].completed = checkbox.checked;

          if (checkbox.checked) {
            todoItem.classList.add("completed");
          } else {
            todoItem.classList.remove("completed");
          }

          // If filtering by completion status, remove the item if it no longer matches
          if (
            (this.currentFilter === "active" && checkbox.checked) ||
            (this.currentFilter === "completed" && !checkbox.checked)
          ) {
            setTimeout(() => {
              this.loadTodos();
            }, 300);
          }
        }
      } catch (error) {
        console.error("Failed to update todo status:", error);
        // Revert checkbox state on error
        checkbox.checked = !checkbox.checked;
        alert("Failed to update todo status. Please try again.");
      }
    });

    // Edit button
    const editBtn = todoItem.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      this.editTodo(todo);
    });

    // Delete button
    const deleteBtn = todoItem.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this todo?")) {
        try {
          await this.api.deleteTodo(todo.id);
          todoItem.remove();

          const index = this.todos.findIndex((t) => t.id === todo.id);
          if (index !== -1) {
            this.todos.splice(index, 1);
          }

          // Show empty state if no todos left
          if (this.todos.length === 0) {
            this.emptyState.classList.remove("d-none");
          }
        } catch (error) {
          console.error("Failed to delete todo:", error);
          alert("Failed to delete todo. Please try again.");
        }
      }
    });

    return todoItem;
  }

  /**
   * Edit a todo
   */
  editTodo(todo) {
    this.currentEditId = todo.id;
    this.titleInput.value = todo.title;
    this.descriptionInput.value = todo.description || "";

    this.updateBtn.classList.remove("d-none");
    this.cancelBtn.classList.remove("d-none");
    document.querySelector('button[type="submit"]').classList.add("d-none");

    // Scroll to form and focus title
    this.todoForm.scrollIntoView({ behavior: "smooth" });
    this.titleInput.focus();
  }

  /**
   * Cancel editing
   */
  cancelEdit() {
    this.resetForm();
    this.exitEditMode();
  }

  /**
   * Exit edit mode
   */
  exitEditMode() {
    this.currentEditId = null;
    this.updateBtn.classList.add("d-none");
    this.cancelBtn.classList.add("d-none");
    document.querySelector('button[type="submit"]').classList.remove("d-none");
  }

  /**
   * Reset the form
   */
  resetForm() {
    this.todoForm.reset();
  }

  /**
   * Set the current filter
   */
  async setFilter(filter) {
    this.currentFilter = filter;

    // Update filter display
    const filterTexts = {
      all: "All",
      active: "Active",
      completed: "Completed",
    };

    this.currentFilterDisplay.textContent = `Showing: ${filterTexts[filter]}`;

    // Reload todos with the filter
    await this.loadTodos();
  }
}
