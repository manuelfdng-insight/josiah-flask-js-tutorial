/**
 * Main application script
 */
document.addEventListener("DOMContentLoaded", () => {
  const api = new TodoAPI();
  const todoManager = new TodoManager(api);

  todoManager.init().catch((error) => {
    console.error("Failed to initialize todo manager:", error);
    alert("Failed to initialize application. Please refresh the page.");
  });
});
