import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

interface TaskProps {
  index: number;
  task: {
    id: string;
    content: string;
  };
  editTask: (taskId: string, newContent: string) => void;
}

const Task = ({ index, task, editTask }: TaskProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(task.content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (newContent.trim() !== "") {
      editTask(task.id, newContent);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContent(e.target.value);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div className="flex flex-col">
          {isEditing ? (
            <div className="flex mb-2 gap-2 items-center">
              <input
                type="text"
                value={newContent}
                onChange={handleChange}
                className="w-full p-2 border border-black rounded text-black"
              />
              <button
                className="border-2 p-2 bg-emerald-500 border-emerald-500 rounded-lg text-white hover:bg-emerald-600 hover:border-emerald-600"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          ) : (
            <div className="flex mb-2 gap-2 items-center">
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-white p-2 rounded-md shadow-md w-full text-black"
              >
                {task.content}
              </div>
              <button
                className={`p-2 ${
                  isEditing
                    ? "hidden"
                    : "border-2 text-white hover:bg-emerald-600 hover:border-emerald-600"
                }  rounded-lg bg-emerald-500 border-emerald-500 `}
                onClick={handleEdit}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
