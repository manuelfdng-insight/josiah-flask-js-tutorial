/**
 * TodoAPI - Service for handling API requests to the todo backend
 */
class TodoAPI {
  constructor(baseUrl = "/api/todos") {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all todos with optional filtering
   * @param {string|null} filter - Optional filter (all, active, completed)
   * @returns {Promise<Array>} - Promise resolving to array of todos
   */
  async getTodos(filter = null) {
    let url = this.baseUrl;

    if (filter === "active") {
      url += "?completed=false";
    } else if (filter === "completed") {
      url += "?completed=true";
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }

    const data = await response.json();
    return data.todos;
  }

  /**
   * Get a specific todo by ID
   * @param {number} id - Todo ID
   * @returns {Promise<Object>} - Promise resolving to todo object
   */
  async getTodo(id) {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todo: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data (title, description)
   * @returns {Promise<Object>} - Promise resolving to created todo
   */
  async createTodo(todoData) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Update an existing todo
   * @param {number} id - Todo ID
   * @param {Object} todoData - Updated todo data
   * @returns {Promise<Object>} - Promise resolving to updated todo
   */
  async updateTodo(id, todoData) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Delete a todo
   * @param {number} id - Todo ID
   * @returns {Promise<Object>} - Promise resolving to confirmation message
   */
  async deleteTodo(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Toggle todo completion status
   * @param {number} id - Todo ID
   * @param {boolean} completed - New completion status
   * @returns {Promise<Object>} - Promise resolving to updated todo
   */
  async toggleCompleted(id, completed) {
    return this.updateTodo(id, { completed });
  }
}
