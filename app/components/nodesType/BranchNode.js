"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";

import { NodesEdgesContext } from "@/app/service/nodesEdgesContext";

const handleStyle = { left: 10 };

const BranchNode = ({ id, data, isConnectable }) => {
  const [isVisibleContainer, setIsVisibleContainer] = useState("hidden");
  const [splitterExpend, setSplitterExpend] = useState(false);
  const [switchExpand, setSwitchExpand] = useState(false);
  const [onuExpand, setOnuExpand] = useState(false);
  const [ontExpand, setOntExpand] = useState(false);
  const [copperExpand, setCopperExpand] = useState(false);
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } =
    useContext(NodesEdgesContext);

  // create dynamic children of splitter
  const handleCreateChildren = (parentId, numChildren) => {
    const parentNode = nodes.find((node) => node.id === parentId);
    let switchAsChild = parentNode.data.switchExist === null ? 0 : 1;
    let copperAsChild = parentNode.data.copperExist === null ? 0 : 1;
    let ontAsChild = parentNode.data.ontExist === null ? 0 : 1;
    let onuAsChild = parentNode.data.onuAsChild === null ? 0 : 1;
    let noOfSplitterPresent =
      parentNode.data.childCount -
      (switchAsChild + copperAsChild + onuAsChild + ontAsChild);
    numChildren = parseInt(numChildren) + data.childCount - noOfSplitterPresent;
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
          data: {
            label: `Child ${i + 1}`,
            childCount: 0,
            isVisible: true,
            switchExist: null,
            onuExist: null,
            ontExist: null,
            copperExist: null,
          },
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

  // create dynamic children of Switch
  const switchCreationHandle = (parentId, numPorts) => {
    const parentNode = nodes.find((node) => node.id === parentId);
    if (!parentNode) return;

    const existingSwitchChild = nodes.find((node) => {
      return node.type === "switchNodeType" && node.id.startsWith(parentId);
    });

    if (!existingSwitchChild) {
      const newChildId = `${parentId}-${data.childCount}`;
      const newChildNode = {
        id: newChildId,
        data: {
          label: `Child ${data.childCount + 1}`,
          ports: numPorts,
          isVisible: true,
        },
        position: {
          x: parentNode.position.x + 200,
          y: parentNode.position.y,
        },
        type: "switchNodeType",
        draggable: false,
      };

      const newEdge = {
        id: `${parentId}_${newChildId}`,
        source: parentId,
        target: newChildId,
        animated: true,
        hidden: false,
      };

      parentNode.data.switchExist = newChildId;
      updateNodeType(parentId, data.childCount + 1);

      setNodes((prevNodes) => [...prevNodes, newChildNode]);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    } else {
      existingSwitchChild.data.ports = numPorts;
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === existingSwitchChild.id ? existingSwitchChild : node
        )
      );
    }
    const existingSwitchChildUpdated = nodes.find((node) => {
      return node.type === "switchNodeType" && node.id.startsWith(parentId);
    });
    console.log(existingSwitchChildUpdated);
  };

  // create dynamic children of Copper
  const copperCreationHandle = (parentId, numPorts) => {
    if (data.copperExist === null) {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      const newChildId = `${parentId}-${data.childCount}`;
      const newChildNode = {
        id: newChildId,
        data: {
          label: `Child ${data.childCount + 1}`,
          ports: `${numPorts}`,
          isVisible: true,
        },
        position: {
          x: parentNode.position.x + 200,
          y: parentNode.position.y,
        },
        type: "CopperNodeType",
        draggable: false,
      };

      const newEdge = {
        id: `${parentId}_${newChildId}`,
        source: parentId,
        target: newChildId,
        animated: true,
        hidden: false,
      };

      parentNode.data.copperExist = newChildId;
      updateNodeType(parentId, data.childCount + 1);

      setNodes((prevNodes) => [...prevNodes, newChildNode]);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    } else {
      const existingChildNode = nodes.find(
        (node) => node.id === data.copperExist
      );
      if (existingChildNode) {
        existingChildNode.data.ports = numPorts;
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === existingChildNode.id ? existingChildNode : node
          )
        );
      }
    }
  };

  // create dynamic children of ONU
  const onuCreationHandle = (parentId, numPorts) => {
    if (!data.onuExist) {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      const newChildId = `${parentId}-${data.childCount}`;
      const newChildNode = {
        id: newChildId,
        data: {
          label: `Child ${data.childCount + 1}`,
          ports: `${numPorts}`,
          isVisible: true,
        },
        position: {
          x: parentNode.position.x + 200,
          y: parentNode.position.y,
        },
        type: "OnuNodeType",
        draggable: false,
      };

      const newEdge = {
        id: `${parentId}_${newChildId}`,
        source: parentId,
        target: newChildId,
        animated: true,
        hidden: false,
      };

      parentNode.data.onuExist = true;
      updateNodeType(parentId, data.childCount + 1);

      setNodes((prevNodes) => [...prevNodes, newChildNode]);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    } else {
      const existingChildNode = nodes.find((node) => node.id === data.onuExist);
      if (existingChildNode) {
        existingChildNode.data.ports = numPorts;
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === existingChildNode.id ? existingChildNode : node
          )
        );
      }
    }
  };

  // create dynamic children of ONT
  const ontCreationHandle = (parentId, numPorts) => {
    if (!data.ontExist) {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      const newChildId = `${parentId}-${data.childCount}`;
      const newChildNode = {
        id: newChildId,
        data: {
          label: `Child ${data.childCount + 1}`,
          ports: `${numPorts}`,
          isVisible: true,
        },
        position: {
          x: parentNode.position.x + 200,
          y: parentNode.position.y,
        },
        type: "OntNodeType",
        draggable: false,
      };

      const newEdge = {
        id: `${parentId}_${newChildId}`,
        source: parentId,
        target: newChildId,
        animated: true,
        hidden: false,
      };

      parentNode.data.ontExist = newChildId;
      updateNodeType(parentId, data.childCount + 1);

      setNodes((prevNodes) => [...prevNodes, newChildNode]);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    } else {
      const existingChildNode = nodes.find((node) => node.id === data.ontExist);
      if (existingChildNode) {
        existingChildNode.data.ports = numPorts;
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === existingChildNode.id ? existingChildNode : node
          )
        );
      }
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
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const parentNode = nodes.find((node) => node.id === edge.source);
        if (parentNode.id === parentId) {
          return { ...edge, hidden: !parentNode.data.isVisible };
        }
        return edge;
      })
    );
  };

  return (
    <div
      className={`flex ${
        data.isVisible ? "visible" : "hidden"
      } justify-center rounded bg-gradient-to-b from-orange-600 pb-2 to-slate-900 max-h-32  w-[220px] h-32`}
    >
      {/* Label for the handle */}
      <div className="absolute bottom-0 h-full bg-transparent text-sm flex justify-center items-end p-1">
        <span style={{ color: "white" }}>{data.childCount}</span>
      </div>
      <div className="block w-full rounded-lg bg-success text-white shadow-secondary-1">
        <div className="border-b-2 flex gap-2 items-center justify-between border-black/20 px-6 py-3 font-bold font-mono">
          <span>Branch : {data.label}</span>
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
          {/* it only exist in node  */}
          <div className="px-1 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ">
            <div
              className="flex items-center justify-between"
              onClick={() => {
                if (isVisibleContainer == "hidden") {
                  setIsVisibleContainer("block");
                } else {
                  setIsVisibleContainer("hidden");
                }

                // setInterval(() => {
                //   setIsVisibleContainer("hidden");
                //   setSplitterExpend(false);
                //   setSwitchExpand(false);
                //   setOntExpand(false);
                //   setOnuExpand(false);
                //   setCopperExpand(false);
                // }, 10000);
              }}
            >
              <span>Choose</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  color="#000000"
                  fill="none"
                >
                  <path
                    d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div
              className={`${
                isVisibleContainer == "hidden" ? "hidden" : "block"
              } pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `}
            >
              <ul className="block flex-col gap-[2px]">
                {/* splitter */}
                <li
                  className="hover:bg-slate-200 rounded-md w-full"
                  onClick={() => {
                    if (splitterExpend) {
                      setSplitterExpend(false);
                    } else {
                      setSplitterExpend(true);
                    }
                  }}
                >
                  Splitter
                  <div
                    className={`${
                      isVisibleContainer == "block" && splitterExpend
                        ? "block"
                        : "hidden"
                    } absolute pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `}
                  >
                    <ul className="block flex-col gap-[2px]">
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          handleCreateChildren(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={2}
                      >
                        1/2
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          handleCreateChildren(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={4}
                      >
                        1/4
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          handleCreateChildren(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={8}
                      >
                        1/8
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          handleCreateChildren(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={16}
                      >
                        1/16
                      </li>
                    </ul>
                  </div>
                </li>
                {/* switch */}
                <li
                  className="hover:bg-slate-200 rounded-md w-full"
                  onClick={() => {
                    if (switchExpand) {
                      setSwitchExpand(false);
                    } else {
                      setSwitchExpand(true);
                    }
                  }}
                >
                  Switch
                  <div
                    className={`${
                      isVisibleContainer == "block" && switchExpand
                        ? "block"
                        : "hidden"
                    } absolute pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `}
                  >
                    <ul className="block flex-col gap-[2px]">
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          switchCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={2}
                      >
                        1/2
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          switchCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={4}
                      >
                        1/4
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          switchCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={8}
                      >
                        1/8
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          switchCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={16}
                      >
                        1/16
                      </li>
                    </ul>
                  </div>
                </li>
                {/* ONU */}
                <li
                  className="hover:bg-slate-200 rounded-md w-full"
                  onClick={() => {
                    if (onuExpand) {
                      setOnuExpand(false);
                    } else {
                      setOnuExpand(true);
                    }
                  }}
                >
                  ONU
                  <div
                    className={`${
                      isVisibleContainer == "block" && onuExpand
                        ? "block"
                        : "hidden"
                    } absolute pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `}
                  >
                    <ul className="block flex-col gap-[2px]">
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          onuCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={2}
                      >
                        1/2
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          onuCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={4}
                      >
                        1/4
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          onuCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={8}
                      >
                        1/8
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          onuCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={16}
                      >
                        1/16
                      </li>
                    </ul>
                  </div>
                </li>
                {/* ont */}
                <li
                  className="hover:bg-slate-200 rounded-md w-full"
                  onClick={() => {
                    if (ontExpand) {
                      setOntExpand(false);
                    } else {
                      setOntExpand(true);
                    }
                  }}
                >
                  ONT
                  <div
                    className={`${
                      isVisibleContainer == "block" && ontExpand
                        ? "block"
                        : "hidden"
                    } absolute pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `}
                  >
                    <ul className="block flex-col gap-[2px]">
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          ontCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={2}
                      >
                        1/2
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          ontCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={4}
                      >
                        1/4
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          ontCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={8}
                      >
                        1/8
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          ontCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={16}
                      >
                        1/16
                      </li>
                    </ul>
                  </div>
                </li>
                {/* Copper */}
                <li
                  className="hover:bg-slate-200 rounded-md w-full"
                  onClick={() => {
                    if (copperExpand) {
                      setCopperExpand(false);
                    } else {
                      setCopperExpand(true);
                    }
                  }}
                >
                  Copper
                  <div
                    className={`${
                      isVisibleContainer == "block" && copperExpand
                        ? "block"
                        : "hidden"
                    } absolute pr-5 z-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `}
                  >
                    <ul className="block flex-col gap-[2px]">
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          copperCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={2}
                      >
                        1/2
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          copperCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={4}
                      >
                        1/4
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          copperCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={8}
                      >
                        1/8
                      </li>
                      <li
                        className="hover:bg-slate-200 rounded-md w-full"
                        onClick={(e) => {
                          copperCreationHandle(id, e.target.value);
                          setIsVisibleContainer("hidden");
                        }}
                        value={16}
                      >
                        1/16
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="give"
        isConnectable={isConnectable}
        className="p-1 !bg-green-600 !border-green-800 cursor-pointer"
        // style={{ right: -10 }}
        onClick={() => toggleChildNodesVisibility(id)}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="take"
        isConnectable={isConnectable}
        className="p-1 !bg-green-600 !border-green-800"
        // style={{ left: -10 }}
      />
    </div>
  );
};

export default BranchNode;
