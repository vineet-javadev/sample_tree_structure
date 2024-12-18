"use client";
import { useMemo, useContext, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

import { NodesEdgesContext } from "@/app/service/nodesEdgesContext";

const handleStyle = { left: 10 };

const CopperNode = ({ id, data, isConnectable }) => {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } =
    useContext(NodesEdgesContext);
  const [portsCount, setPortsCount] = useState(parseInt(data.ports));

  useEffect(() => {
    setPortsCount(parseInt(data.ports));
  }, [nodes]);

  const portElements = useMemo(() => {
    return Array.from({ length: portsCount }, (_, index) => (
      <div
        key={index}
        className={`${
          data.connected ? "bg-green-500" : "bg-red-600"
        } p-[3px] rounded-full`}
      />
    ));
  }, [portsCount, data.connected]);

  return (
    <div
      className={`flex ${
        data.isVisible ? "visible" : "hidden"
      } justify-center rounded bg-gradient-to-b from-cyan-500 to-blue-500 text-black w-[220px]`}
    >
      <div className="block w-full rounded-lg bg-success text-black shadow-secondary-1">
        <div className="border-b-2 flex gap-2 items-center justify-between border-black/20 px-6 py-3 font-bold font-mono">
          <span>Copper : {data.label}</span>
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
        <div className="p-4">
          <div className="flex gap-2 w-full flex-wrap  px-3 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {portElements}
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="inputHandle"
        isConnectable={isConnectable}
        className="p-1 !bg-green-600 !border-green-800 "
        // style={{ left: -10 }}
      />
    </div>
  );
};

export default CopperNode;
