"use client";
import React, { useEffect } from "react";
import Board from "@/components/Board";

const STORAGE_KEY = "boardData";

const fetchBoardData = () => {
  return [
    {
      id: "board1",
      title: "My First Board",
      stages: [
        {
          id: "stage1",
          title: "To Do",
          tasks: [{ id: "task1", content: "Task 1" }],
        },
        {
          id: "stage2",
          title: "Doing",
          tasks: [],
        },
        {
          id: "stage3",
          title: "Done",
          tasks: [],
        },
      ],
    },
  ];
};

const Page = () => {
  const storedData =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) || ""
      : "";

  const initialBoardData = storedData
    ? JSON.parse(storedData)
    : fetchBoardData();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBoardData));
    }
  }, [initialBoardData]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Board initialBoardData={initialBoardData} />
    </div>
  );
};

export default Page;
