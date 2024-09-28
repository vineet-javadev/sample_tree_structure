// nodesEdgesContext.js
"use client"
import { createContext, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
  } from "reactflow";

const NodesEdgesContext = createContext();

const NodesEdgesProvider = ({ children, initialNodes, initialEdges }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <NodesEdgesContext.Provider value={{ nodes, edges, setNodes , setEdges , onNodesChange, onEdgesChange }}>
      {children}
    </NodesEdgesContext.Provider>
  );
};

export { NodesEdgesProvider, NodesEdgesContext };