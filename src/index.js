const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const userExists = users.find((user) => user.username === username);

  if (!userExists) {
    return response.status(400).json({ error: "User account does't exists" });
  }

  request.user = userExists;

  next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  const data = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(data);

  return response.status(201).json(data);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const data = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
  };

  user.todos.push(data);

  return response.status(201).json(data);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todoExists = user.todos.some((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({ error: "Todo not found" });
  }

  let updatedTodo = {};

  user.todos.forEach((todo) => {
    if (todo.id === id) {
      todo.deadline = new Date(deadline);
      todo.title = title;

      updatedTodo = todo;
    }

    return todo;
  });

  return response.json(updatedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoExists = user.todos.some((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({ error: "Todo not found" });
  }

  let updatedTodo = {};

  user.todos.forEach((todo) => {
    if (todo.id === id) {
      todo.done = true;

      updatedTodo = todo;
    }

    return todo;
  });

  return response.json(updatedTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  
  const todoExists = user.todos.some((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({ error: "Todo not found" });
  }

  const newTodos = user.todos.filter((todo) => todo.id !== id);

  user.todos = newTodos;

  return response.status(204).json(newTodos);
});

module.exports = app;
