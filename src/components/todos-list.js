import React, { useState, useEffect } from 'react';
import TodoDataService from '../services/todos';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';

const TodosList = (props) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    retrieveTodos();
  }, [props.token]);

  const retrieveTodos = () => {
    TodoDataService.getAll(props.token)
      .then(response => {
        setTodos(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // 删除功能
  const deleteTodo = (todoId) => {
    TodoDataService.deleteTodo(todoId, props.token)
      .then(response => {
        retrieveTodos(); // 删除后重新获取列表
      })
      .catch(e => {
        console.log(e);
      });
  };

  // 标记完成功能
  const completeTodo = (todoId) => {
    TodoDataService.completeTodo(todoId, props.token)
      .then(response => {
        retrieveTodos(); // 标记完成后重新获取列表
        console.log("completeTodo", todoId);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <Container>
      {props.token == null || props.token === "" ? (
        <Alert variant="warning">
          You are not logged in. Please <Link to={"/login"}>login</Link> to see your todos.
        </Alert>
      ) : (
        <div>
          <Link to={"/todos/create"}>
            <Button variant="outline-info" className="mb-3">
              Add To-do
            </Button>
          </Link>

          {todos.map((todo) => {
            return (
              <Card key={todo.id} className="mb-3">
                <Card.Body>
                  {/* 如果完成，给文字加上删除线 */}
                  <div className={todo.completed ? "text-decoration-line-through" : ""}>
                    <Card.Title>{todo.title}</Card.Title>
                    <Card.Text><b>Memo:</b> {todo.memo}</Card.Text>
                    <Card.Text>Date created: {moment(todo.created_at).format("Do MMMM YYYY")}</Card.Text>
                  </div>

                  {/* 只有未完成的任务才显示 Edit 按钮 */}
                  {!todo.completed && (
                    <Link to={{
                      pathname: "/todos/" + todo.id,
                      state: { currentTodo: todo }
                    }}>
                      <Button variant="outline-info" className="me-2">Edit</Button>
                    </Link>
                  )}

                  {/* 删除按钮 */}
                  <Button variant="outline-danger" className="me-2" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </Button>

                  {/* 标记完成按钮 */}
                  <Button variant="outline-success" onClick={() => completeTodo(todo.id)}>
                    Complete
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default TodosList;