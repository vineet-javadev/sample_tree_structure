"use client";
import { useCallback, useContext } from "react";
import { Handle, Position } from "reactflow";

import { NodesEdgesContext } from "@/app/service/nodesEdgesContext";

const handleStyle = { left: 10 };

const RootNode = ({ id, data, isConnectable }) => {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } =
    useContext(NodesEdgesContext);

  // create dynamic children
  const handleCreateChildren = (parentId, numChildren) => {
    numChildren = parseInt(numChildren);
    const parentNode = nodes.find((node) => node.id === parentId);
    if (!parentNode) return;

    if (numChildren > data.childCount) {
      const newChildren = [];
      for (let i = 0; i < numChildren; i++) {
        if (i < data.childCount) {
          continue;
        }
        const childId = `${parentId}-${i}`;
        const childNode = {
          id: childId,
          data: { label: `Child ${i + 1}`, childCount: 0, isVisible: true },
          position: {
            x: parentNode.position.x + 200,
            y: parentNode.position.y,
          },
          type: "leafNodeType",
          draggable: false,
        };
        newChildren.push(childNode);
      }

      const newEdges = newChildren.map((childNode) => ({
        id: `${parentId}_${childNode.id}`,
        source: parentId,
        target: childNode.id,
        animated: true,
        hidden: false,
      }));
      updateNodeType(parentId, numChildren);

      setNodes((prevNodes) => [...prevNodes, ...newChildren]);
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    }
  };

  // changing node type leafNodeType to BranchNodeType and update the childCount
  const updateNodeType = (nodeId, count) => {
    const node = nodes.find((node) => node.id === nodeId);
    if (node) {
      node.data.childCount = count;
      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.id === nodeId ? node : n))
      );
    }
  };

  // toggle visibility of there child node
  const toggleChildNodesVisibility = (parentId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id.substring(0, id.length) == parentId &&
        node.id.length != parentId.length
          ? { ...node, hidden: !node.hidden }
          : node
      )
    );
    edges.forEach((edge) => {
      edge.hidden = !edge.hidden;
    });
  };

  return (
    <div
      className={`flex ${
        data.isVisible ? "visible" : "hidden"
      } justify-center rounded bg-gradient-to-b from-red-700 to-orange-950 w-[220px]`}
    >
      {/* Label for the handle */}
      <div className="absolute right-0 h-full bg-transparent text-sm flex justify-end items-center p-1">
        <span style={{ color: "white" }}>{data.childCount}</span>
      </div>
      <div className="block w-full rounded-lg bg-success text-white shadow-secondary-1">
        <div className="border-b-2  flex gap-2 rounded-t-md items-center justify-between border-black/20 px-6 py-3 font-bold font-mono">
          <span>Root : {data.label}</span>
          {data.isActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="10"
              height="10"
              color="#8cfd13"
              fill="#8cfd13"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="10"
              height="10"
              color="red"
              fill="red"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div className="p-6 ">
          {/* <h5 className="mb-2 text-xl font-medium leading-tight">
        Success card title
      </h5>
      <p className="text-base">
        Some quick example text to build on the card title and make up the
        bulk of the cards content.
      </p> */}
          <select
            className=" pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            onChange={(e) => {
              if (confirm("Would you like to make more children?") == true) {
                let parentId = id;
                let count = e.target.value;
                handleCreateChildren(parentId, count);
              }
            }}
          >
            <option defaultValue>Splitter</option>
            <option value="2">1/2</option>
            <option value="4">1/4</option>
            <option value="8">1/8</option>
            <option value="16">1/16</option>
          </select>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="inputHandle"
        isConnectable={isConnectable}
        className="p-1 !bg-green-600 !border-green-800 cursor-pointer"
        style={{ right: -10 }}
        onClick={() => toggleChildNodesVisibility(id)}
      />
    </div>
  );
};

export default RootNode;
