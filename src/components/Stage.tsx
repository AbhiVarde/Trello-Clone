import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

interface Task {
  id: string;
  content: string;
}

interface StageProps {
  id: string;
  title: string;
  tasks: Task[];
  addTask: (content: string) => void;
  editTask: (taskId: string, newContent: string) => void;
}

const Stage: React.FC<StageProps> = ({
  id,
  title,
  tasks,
  addTask,
  editTask,
}) => {
  const [newTaskContent, setNewTaskContent] = useState("");

  const handleAddTask = () => {
    if (newTaskContent.trim() === "") return;
    addTask(newTaskContent);
    setNewTaskContent("");
  };

  return (
    <div className="bg-gray-100 p-2 rounded-md shadow-md m-2 w-64">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-2 space-y-2"
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                index={index}
                task={task}
                editTask={editTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <input
        type="text"
        placeholder="Enter task name"
        value={newTaskContent}
        onChange={(e) => setNewTaskContent(e.target.value)}
        className="p-2 m-2 rounded-md border border-gray-300 focus:outline-none"
      />
      <button
        onClick={handleAddTask}
        className="border-2 border-cyan-500 bg-cyan-500 text-white p-2 rounded-md hover:bg-cyan-600 hover:border-cyan-600"
      >
        Add Task
      </button>{" "}
    </div>
  );
};

export default Stage;
