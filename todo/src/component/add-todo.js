import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { GET_TODOS } from './todo-list'; // Import the query used in TodoList

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
    }
  }
`;

const AddTodo = () => {
  const [text, setText] = useState('');
  const [addTodo] = useMutation(ADD_TODO, {
    update(cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  text
                  completed
                }
              `,
            });
            return [...existingTodos, newTodoRef];
          },
        },
      });
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo({ variables: { text } });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodo;
