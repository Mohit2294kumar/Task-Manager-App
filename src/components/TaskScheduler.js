// src/components/TaskScheduler.js

"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import TaskList from "./TaskList";
import CompletedTaskList from "./CompletedTaskList";
import TaskForm from "./TaskForm";
// import TaskForm from '../components/TaskForm';
// import TaskList from '../components/TaskList';
// import CompletedTaskList from '../components/CompletedTaskList';

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskPriority, setTaskPriority] = useState("Top");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const TASKS_STORAGE_KEY = "tasks";
  const COMPLETED_TASKS_STORAGE_KEY = "completedTasks";

  // Load from localStorage
  useEffect(() => {
    const storedTasks =
      JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
    const storedCompletedTasks =
      JSON.parse(localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY)) || [];

    setTasks(storedTasks);
    setCompletedTasks(storedCompletedTasks);
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Save completed tasks
  useEffect(() => {
    localStorage.setItem(
      COMPLETED_TASKS_STORAGE_KEY,
      JSON.stringify(completedTasks)
    );
  }, [completedTasks]);

  const addTask = () => {
    if (!taskName.trim() || !taskDeadline) {
      alert("Enter a valid task and deadline!");
      return;
    }

    const selectedDate = new Date(taskDeadline);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      alert("Deadline must be in the future.");
      return;
    }

    const newTask = {
      id: Date.now(), // ✅ Better unique ID
      task: taskName,
      priority: taskPriority,
      deadline: taskDeadline,
      done: false,
    };

    setTasks((prev) => [...prev, newTask]);

    setTaskName("");
    setTaskPriority("Top");
    setTaskDeadline("");
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (!taskToEdit) return;

    setTaskName(taskToEdit.task);
    setTaskPriority(taskToEdit.priority);
    setTaskDeadline(taskToEdit.deadline);

    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const markDone = (id) => {
    const taskToMark = tasks.find((t) => t.id === id);
    if (!taskToMark) return;

    setTasks(tasks.filter((t) => t.id !== id));
    setCompletedTasks((prev) => [
      ...prev,
      { ...taskToMark, done: true },
    ]);
  };

  const filteredTasks = tasks
    .filter((t) => !t.done)
    .filter((t) =>
      t.task.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .filter((t) =>
      filterPriority ? t.priority === filterPriority : true
    );

  return (
    <div className={styles.App}>
      <header className={styles.taskHeader}>
        <h1>Task Manager</h1>
      </header>

      <main>
        <TaskForm
          taskName={taskName}
          taskPriority={taskPriority}
          taskDeadline={taskDeadline}
          handleTaskNameChange={(e) => setTaskName(e.target.value)}
          handleTaskPriorityChange={(e) => setTaskPriority(e.target.value)}
          handleTaskDeadlineChange={(e) =>
            setTaskDeadline(e.target.value)
          }
          addTask={addTask}
        />

        {/* Search + Filter */}
        <div className={styles.searchFilter}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />

          <select
            className={styles.filterPrioritySelect}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All</option>
            <option value="Top">High Priority</option>
            <option value="Middle">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <h2 className={styles.heading}>Tasks</h2>

        <TaskList
          tasks={filteredTasks}
          markDone={markDone}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
        />

        <CompletedTaskList completedTasks={completedTasks} />
      </main>
    </div>
  );
};

export default TaskScheduler;