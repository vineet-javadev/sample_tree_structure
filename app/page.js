"use client";
import { useCallback, useEffect, useContext, useState, useRef } from "react";
import dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import "./globals.css";

import rootNode from "./components/nodesType/RootNode.js";
import branchNode from "./components/nodesType/BranchNode.js";
import leafNode from "./components/nodesType/LeafNode.js";
import SwitchNode from "./components/nodesType/SwitchNode";
import CopperNode from "./components/nodesType/CopperNode";
import OntNode from "./components/nodesType/OntNode";
import OnuNode from "./components/nodesType/OnuNode";

import { NodesEdgesContext } from "./service/nodesEdgesContext";

// popUpBox

const nodeTypes = {
  rootNodeType: rootNode,
  branchNodeType: branchNode,
  leafNodeType: leafNode,
  switchNodeType: SwitchNode,
  CopperNodeType: CopperNode,
  OntNodeType: OntNode,
  OnuNodeType: OnuNode,
};

const nodeColor = (node) => {
  switch (node.type) {
    case "rootNodeType":
      return "red";
    case "branchNodeType":
      return "orange";
    case "switchNodeType":
      return "green";
    case "CopperNodeType":
      return "cyan";
    case "OntNodeType":
      return "indigo";
    case "OnuNodeType":
      return "violet";
    default:
      return "yellow";
  }
};

// Dagre layout function to automatically position the nodes
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 350, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Update node positions after layout
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 0, // Adjust for node width
      y: nodeWithPosition.y - 0, // Adjust for node height
    };
    return node;
  });

  return [...layoutedNodes, ...edges];
};

function Home() {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange , popUp , setPopUp} =
    useContext(NodesEdgesContext);

  const { fitView } = useReactFlow();
  const [viewAngle, setViewAngle] = useState("LR");

  const onEdgesDelete = useCallback(() => {
    alert("Unable to Remove edges");
  }, []);

  const onLayout = useCallback(
    (direction) => {
      const layoutedElements = getLayoutedElements(nodes, edges, direction);
      const layoutedNodes = layoutedElements.filter((el) => el.id && el.data); // Filter nodes
      const layoutedEdges = layoutedElements.filter(
        (el) => el.source && el.target
      ); // Filter edges

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      fitView(); // Adjust view after applying the layout
    },
    [nodes, edges, fitView]
  );

  useEffect(() => {
    onLayout(viewAngle);
  }, []);

  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);

  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  useEffect(() => {
    if (
      !isEqual(prevNodesRef.current, nodes) ||
      !isEqual(prevEdgesRef.current, edges)
    ) {
      onLayout(viewAngle);
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
    }
  }, [nodes, edges]);

  return (
    <>
    {popUp && <div
      className="w-full fixed top-3 flex justify-center animate-slideIn"
      id="confirmMsgBox"
    >
      <div className=" w-[400px] border rounded-lg shadow  bg-gradient-to-b from-slate-800 to-slate-950">
        <div className="flex items-center gap-3 justify-center py-5">
          <svg
            className="text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width={40}
            height={40}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-lg font-sans text-white">
            Its a Irreversible process.
          </h3>
        </div>
        <div className="flex gap-3 pb-4 items-center rounded-b-lg justify-center">
          <button className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-3 py-1.5 text-center mr-2">
            Keep Changes
          </button>
          <button className="text-black bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-sm px-3 py-1.5 text-center">
            Discard Changes
          </button>
        </div>
      </div>
    </div>}
      <div className="w-screen h-screen bg-slate-800">
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
      </div>
    </>
  );
}

const WrappedFlow = () => (
  <ReactFlowProvider>
    <Home />
  </ReactFlowProvider>
);

export default WrappedFlow;

// trace

{
  /* <Panel position="top-right">
        <button className="text-white rounded-lg bg-black p-2 px-3 mr-2" onClick={() => {onLayout('TB'); setViewAngle('TB')}}>V View</button>
        <button className="text-white rounded-lg bg-black p-2 px-3" onClick={() => {onLayout('LR'); setViewAngle('LR')}}>H View</button>
      </Panel> */
}
