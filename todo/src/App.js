import React from 'react';
import AddTodo from './component/add-todo';
import TodoList from './component/todo-list';

const App = () => {
  return (
    <div>
      <h1>TODO List</h1>
      <AddTodo />
      <TodoList />
    </div>
  );
};

export default App;
