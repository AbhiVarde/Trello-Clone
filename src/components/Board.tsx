"use client";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Stage from "./Stage";

interface Task {
  id: string;
  content: string;
}

interface StageData {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardProps {
  initialBoardData: {
    id: string;
    title: string;
    stages: StageData[];
  }[];
}

const Board = ({ initialBoardData }: BoardProps) => {
  const [boardData, setBoardData] = useState(initialBoardData);
  const [newBoardName, setNewBoardName] = useState("");
  const [newStageNames, setNewStageNames] = useState<{ [key: string]: string }>(
    {}
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    const sourceStageId = source.droppableId;
    const destinationStageId = destination.droppableId;
    const sourceTaskIndex = source.index;
    const destinationTaskIndex = destination.index;
    const updatedData = [...boardData];
    const sourceBoardIndex = updatedData.findIndex((board) =>
      board.stages.some((stage) => stage.id === sourceStageId)
    );
    const destinationBoardIndex = updatedData.findIndex((board) =>
      board.stages.some((stage) => stage.id === destinationStageId)
    );

    if (
      sourceBoardIndex === -1 ||
      destinationBoardIndex === -1 ||
      sourceTaskIndex >=
        updatedData[sourceBoardIndex].stages.find(
          (stage) => stage.id === sourceStageId
        )!.tasks.length
    ) {
      return;
    }

    const taskToMove = updatedData[sourceBoardIndex].stages
      .find((stage) => stage.id === sourceStageId)!
      .tasks.find((task) => task.id === draggableId);

    if (!taskToMove) {
      return;
    }

    updatedData[sourceBoardIndex].stages
      .find((stage) => stage.id === sourceStageId)!
      .tasks.splice(sourceTaskIndex, 1);

    updatedData[destinationBoardIndex].stages
      .find((stage) => stage.id === destinationStageId)!
      .tasks.splice(destinationTaskIndex, 0, taskToMove);

    setBoardData(updatedData);
  };

  const generateUniqueId = (): string => {
    return `id-${Date.now()}`;
  };

  const addBoard = () => {
    if (newBoardName.trim() === "") return;
    const newBoardId = generateUniqueId();
    const newBoard = {
      id: newBoardId,
      title: newBoardName,
      stages: [],
    };
    setBoardData([...boardData, newBoard]);
    setNewBoardName("");
  };

  const addStage = (boardId: string) => {
    const trimmedStageName = newStageNames[boardId]?.trim();
    if (!trimmedStageName) {
      return;
    }
    const newStageId = generateUniqueId();
    const updatedData = boardData.map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          stages: [
            ...board.stages,
            {
              id: newStageId,
              title: trimmedStageName,
              tasks: [],
            },
          ],
        };
      }
      return board;
    });
    setBoardData(updatedData);
    setNewStageNames({ ...newStageNames, [boardId]: "" });
  };

  const addTask = (stageId: string, taskContent: string) => {
    const updatedData = [...boardData];
    const boardIndex = updatedData.findIndex((board) =>
      board.stages.some((stage) => stage.id === stageId)
    );
    if (boardIndex !== -1) {
      const stageIndex = updatedData[boardIndex].stages.findIndex(
        (stage) => stage.id === stageId
      );
      if (stageIndex !== -1) {
        const newTask = {
          id: generateUniqueId(),
          content: taskContent,
        };
        updatedData[boardIndex].stages[stageIndex].tasks.push(newTask);
        setBoardData(updatedData);
      }
    }
  };

  const editTask = (stageId: string, taskId: string, newContent: string) => {
    const updatedData = [...boardData];
    const boardIndex = updatedData.findIndex((board) =>
      board.stages.some((stage) => stage.id === stageId)
    );
    if (boardIndex !== -1) {
      const stageIndex = updatedData[boardIndex].stages.findIndex(
        (stage) => stage.id === stageId
      );
      if (stageIndex !== -1) {
        const taskIndex = updatedData[boardIndex].stages[
          stageIndex
        ].tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          updatedData[boardIndex].stages[stageIndex].tasks[taskIndex].content =
            newContent;
          setBoardData(updatedData);
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-2xl font-semibold my-1 text-white">
          Mini Trello Clone
        </h2>
        <div className="flex gap-2 my-2">
          <input
            type="text"
            placeholder="Enter board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none w-48 md:w-56 lg:w-auto text-black"
          />
          <button
            onClick={addBoard}
            className="border-2 text-white px-2 rounded-md bg-sky-500 border-sky-500 hover:bg-sky-600 hover:border-sky-600"
          >
            Create Board
          </button>
        </div>
        {boardData.map((board) => (
          <div
            key={board.id}
            className="my-4 bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold my-2 text-black">
              {board.title}
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter stage name"
                value={newStageNames[board.id] || ""}
                onChange={(e) =>
                  setNewStageNames({
                    ...newStageNames,
                    [board.id]: e.target.value,
                  })
                }
                className="p-2 rounded-md border border-gray-300 focus:outline-none w-48 lg:w-auto text-black"
              />
              <button
                onClick={() => addStage(board.id)}
                className="border-2 text-white px-2 rounded-md bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600"
              >
                Add Stage
              </button>
            </div>
            <div className="flex flex-col lg:flex-row space-x-4 p-4 w-auto sm:w-96 lg:w-full">
              {board.stages.map((stage) => (
                <Stage
                  key={stage.id}
                  id={stage.id}
                  title={stage.title}
                  tasks={stage.tasks}
                  addTask={(content) => addTask(stage.id, content)}
                  editTask={(taskId, newContent) =>
                    editTask(stage.id, taskId, newContent)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center my-4 text-gray-400 ">
        &copy; {new Date().getFullYear()}, Designed & Build by{" "}
        <a href="https://www.abhivarde.in/" className="text-white">
          AbhiVarde
        </a>
        .
      </footer>
    </DragDropContext>
  );
};

export default Board;
