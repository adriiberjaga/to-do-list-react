import React, { useEffect, useState } from "react";
import style from "./Home.module.css";

export default function Home() {
  useEffect(() => {
    const dateInput = document.getElementById("dueDate") as HTMLInputElement;
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
    }
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Estado para manejar las tareas
  interface Task {
    id: number;
    text: string;
    status: string;
    dueDate: string;
  }
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState(""); // Para el texto de la tarea
  const [taskStatus, setTaskStatus] = useState("Por empezar"); // Para el estado
  const [dueDate, setDueDate] = useState(""); // Para la fecha

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!taskInput.trim() || !dueDate) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const newTask: Task = {
      id: tasks.length + 1,
      text: taskInput,
      status: taskStatus,
      dueDate: dueDate,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    // Guardar tareas en el local storage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    // Limpiar el formulario
    setTaskInput("");
    setTaskStatus("Por empezar");
    setDueDate("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  const handleDelete = (taskId: number): void => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  };

  return (
    <div className={style.main}>
      <h1 className={style.title}>ToDo List</h1>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.secctionDivs}>
        <label htmlFor="Tarea">Nueva tarea</label>
          <input
            className={style.input}
            type="text"
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
        </div>
        <div className={`${style.secctionDivs} ${style.middleDivs} `}>
          <label htmlFor="estado">Estado</label>
          <select
            className={style.input}
            name="estado"
            id="estado"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <option value="Por empezar">Por empezar</option>
            <option value="En proceso">En proceso</option>
            <option value="Terminada">Terminada</option>
          </select>
        </div>
        <div className={style.secctionDivs}>
          <label htmlFor="dueDate">Fecha límite</label>
          <input
            className={style.date}
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Selecciona una fecha"
          />
        </div>
        <button className={style.btnAdd} type="submit">
          Add
        </button>
      </form>

      {/* Lista de tareas */}
      <ul className={style.taskList}>
        {tasks.map((task) => (
          <li key={task.id} className={`${style.taskItem} ${taskStatus === "Por empezar" ? style.porEmpezar : taskStatus === "En proceso" ? style.enProceso : style.terminada}`}>
            <strong>{task.text}</strong> - {task.status} (Fecha límite: {task.dueDate})
          <button onClick={() => {
  deleteTask(task.id); 
  handleDelete(task.id);
}}
>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
