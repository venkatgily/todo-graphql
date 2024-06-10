import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import './todo-list.css'; // Import the CSS file

const GET_TODOS = gql`
  query {
    todos {
      id
      text
      completed
    }
  }
`;

const EDIT_TODO = gql`
  mutation EditTodo($id: ID!, $text: String!) {
    editTodo(id: $id, text: $text) {
      id
      text
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

const TodoList = () => {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [editTodo] = useMutation(EDIT_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const handleEdit = (id, text) => {
    setEditingTodoId(id);
    setEditingText(text);
  };

  const handleSave = async () => {
    await editTodo({
      variables: { id: editingTodoId, text: editingText },
      update: (cache, { data: { editTodo } }) => {
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        const updatedTodos = existingTodos.todos.map(todo =>
          todo.id === editingTodoId ? editTodo : todo
        );
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: updatedTodos },
        });
      },
    });
    setEditingTodoId(null);
    setEditingText('');
  };

  const handleDelete = async (id) => {
    await deleteTodo({
      variables: { id },
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        const updatedTodos = existingTodos.todos.filter(todo => todo.id !== id);
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: updatedTodos },
        });
      },
    });
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Todos</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.todos.map(todo => (
          <tr key={todo.id}>
            <td>
              {editingTodoId === todo.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                />
              ) : (
                todo.text
              )}
            </td>
            <td>
              {editingTodoId === todo.id ? (
                <button onClick={handleSave}>Save</button>
              ) : (
                <>
                  <button onClick={() => handleEdit(todo.id, todo.text)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TodoList;
