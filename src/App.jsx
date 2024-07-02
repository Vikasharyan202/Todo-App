import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const App = () =>  {

  const [ todos, setTodos ] = useState([]);
  const [ newTodo, setNewTodo ] = useState('');

  const [ isEdit, setIsEdit ] = useState(false);
  const [ currentTodo, setCurrentTodo ] = useState({});

  const [ completedTask, setCompletedTask ] = useState(0);

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await fetch("https://jsonplaceholder.typicode.com/todos/?_limit=5");
      const json = await data.json();
      setTodos(json);
    };

    fetchTodos();
  }, [])

  function handleInputChange(e) {
    setNewTodo(e.target.value);
  }

  const handleEditInputChange = (e) => {
    setCurrentTodo({...currentTodo, title: e.target.value});
  }

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if(newTodo === '') return;

    const todoItem = {
      id: uuidv4(), // Generate a unique ID
      title: newTodo,
      completed: false,
    };

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(todoItem),
      });
      const data = await response.json();
      setTodos([...todos, {...data, id: todoItem.id}]); // use to generate unique ID
      setNewTodo("");
    } catch (error) {
      console.error('Error in adding todo', error);
    }
  }

  const handleEditTodo = (todo) => {
    setIsEdit(true);
    setCurrentTodo({...todo});
  }

  const handleUpdateTodo = async (e) => {
    e.preventDefault();

    if(!currentTodo.id) {
      console.error('Current todo does not have an id');
      return;
    }

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${currentTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(currentTodo),
      });
      //Check if the response status is 200 before parsing JSON
      if(response.ok) {
        const data = await response.json();
        const updatedTodos = todos.map((todo) => ((todo.id === data.id) ? data : todo));
        setTodos(updatedTodos);
        setIsEdit(false);
        setCurrentTodo({});
      } else {
        console.error('Failed to update todo', response.statusText);
      }
      
    } catch(error) {
      console.error('Error in updating', error);
    }
  }

  const handlDeleteTodo = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      });

      if(response.ok) {
        const filteredTodos = todos.filter(todo => todo.id !== id);
        setTodos(filteredTodos);
      } else {
        console.error('Failed to delete todo', response.statusText);
      }
    } catch (error) {
      console.error('Error in deleting', error);
    }
  }

  const clearAllTaskHandler = () => {

  }
  function checkTheTask() {
    setCompletedTask(completedTask+1);
  }
  
  return (
    <div className="todo-cont">
      <div className="heading">
        <h3>Todo List</h3>
        <img alt="logo" src="todoIcon.webp" />
      </div>      
      {isEdit ? (
        <form onSubmit={handleUpdateTodo} className="inputAdd">
        <input
         type="text"       
         placeholder="Edit your task"
         value={currentTodo.title || ""}
         onChange={handleEditInputChange}
         />
        <button type="submit">Update</button>
      </form>
      ) : (
        <form onSubmit={handleAddTodo} className="inputAdd">
        <input
         type="text"       
         placeholder="List down your task"
         value={newTodo}
         onChange={handleInputChange}
         />
        <button type="submit">Add+</button>
      </form>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
          <div className="task">
            <div className="circle" onClick={checkTheTask}></div>
            {todo.title}
          </div>         
          <div className="editBtn">
            <button 
            className="edit"
            onClick={() => handleEditTodo(todo)}
            >Edit</button>
            <button
             className="delete"
             onClick={() => handlDeleteTodo(todo.id)}
            >Delete</button>
          </div> 
         </li>))
        }      
      </ul>
      <div className="clearAndInfo">
        <div className="taskInfo">
          <p>Total Task:{todos.length}</p>
          <p>completed Task:{completedTask}</p>
        </div>
        <button onClick={clearAllTaskHandler}>Clear All</button>       
      </div>
    </div>
  )
}

export default App;
