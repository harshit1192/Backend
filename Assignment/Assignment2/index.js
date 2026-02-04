const {
  addTodo,
  listTodos,
  markDone,
  deleteTodo
} = require("./todo");

addTodo("Learn Node.js fs");
addTodo("Build mini backend");
listTodos();

// Copy an ID from todos.json
markDone(1737263812);
deleteTodo(1737263812);
