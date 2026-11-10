import React, { useState } from 'react';
import TodoDataService from '../services/todos';
import { Link, useLocation } from 'react-router-dom'; // 新增 useLocation
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddTodo = (props) => {
  const location = useLocation(); // 获取路由传过来的数据
  let editing = false;
  let initialTodoTitle = "";
  let initialTodoMemo = "";

  // 如果地址栏带了数据（从 TodosList 的 Edit 按钮点进来的），就进入编辑模式
  if (location.state && location.state.currentTodo) {
    editing = true;
    initialTodoTitle = location.state.currentTodo.title;
    initialTodoMemo = location.state.currentTodo.memo;
  }

  const [title, setTitle] = useState(initialTodoTitle);
  const [memo, setMemo] = useState(initialTodoMemo);
  const [submitted, setSubmitted] = useState(false);

  const onChangeTitle = e => {
    setTitle(e.target.value);
  };

  const onChangeMemo = e => {
    setMemo(e.target.value);
  };

  const saveTodo = () => {
    var data = {
      title: title,
      memo: memo,
      completed: false,
    };

    // 如果是编辑模式，调用 updateTodo
    if (editing) {
      TodoDataService.updateTodo(location.state.currentTodo.id, data, props.token)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // 如果是新建模式，调用 createTodo
      TodoDataService.createTodo(data, props.token)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <Container>
      {submitted ? (
        <div className="mt-3">
          <h4>Todo submitted successfully</h4>
          <Link to={"/todos"}>Back to Todos</Link>
        </div>
      ) : (
        <Form className="mt-3">
          <Form.Group className="mb-3">
            {/* 标题会根据模式自动变化 */}
            <Form.Label>{editing ? "Edit" : "Create"} Todo</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="e.g. buy gift tomorrow"
              value={title}
              onChange={onChangeTitle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter details..."
              value={memo}
              onChange={onChangeMemo}
            />
          </Form.Group>

          <Button variant="info" onClick={saveTodo}>
            {editing ? "Edit" : "Add"} To-do
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default AddTodo;