// Format todos for AI prompt
const formatTodosForAI = (todos) => {
  return todos
    .map((todo, index) => {
      return `${index + 1}. ${todo.title}${todo.priority ? ` (Priority: ${todo.priority})` : ""}${
        todo.dueDate ? ` (Due: ${new Date(todo.dueDate).toLocaleDateString()})` : ""
      }${todo.description ? `\n   Description: ${todo.description}` : ""}`
    })
    .join("\n")
}

module.exports = {
  formatTodosForAI,
}
