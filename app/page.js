"use client";
import { useCallback , useEffect , useContext, useState , useRef} from "react";
import dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  Panel ,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import "./globals.css";

import rootNode from "./components/nodesType/RootNode.js";
import branchNode from "./components/nodesType/BranchNode.js";
import leafNode from "./components/nodesType/LeafNode.js";
import { NodesEdgesContext  } from "./service/nodesEdgesContext";


const nodeTypes = {
  rootNodeType: rootNode,
  branchNodeType: branchNode,
  leafNodeType: leafNode,
};

const nodeColor = (node) => {
  switch (node.type) {
    case "rootNodeType":
      return "red";
    case "branchNodeType":
      return "orange";
    default:
      return "yellow";
  }
};


// Dagre layout function to automatically position the nodes
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 350, height: 100 });
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
  const { nodes, edges, setNodes , setEdges , onNodesChange, onEdgesChange } = useContext(NodesEdgesContext);

  const { fitView } = useReactFlow();
  const [ viewAngle , setViewAngle] = useState("LR");
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const updateNodesAndEdges = (newChildren , newEdges) => {
  //   setNodes((prevNodes) => [...prevNodes, ...newChildren]);
  //   setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  // };



  // Prevent all edges from being deleted
  const onEdgesDelete = useCallback(() => {
    // Do nothing here to prevent deletion of edges
    alert("Unable to Remove edges");
  }, []);

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   []
  // );
  
  const onLayout = useCallback(
    (direction) => {
      const layoutedElements = getLayoutedElements(nodes, edges, direction);
      const layoutedNodes = layoutedElements.filter((el) => el.id && el.data); // Filter nodes
      const layoutedEdges = layoutedElements.filter((el) => el.source && el.target); // Filter edges

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      fitView(); // Adjust view after applying the layout
    },
    [nodes, edges, fitView]
  );

  useEffect(() => {
    onLayout(viewAngle);
  }, [])

  const prevNodesRef = useRef(nodes);
const prevEdgesRef = useRef(edges);

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

useEffect(() => {
  if (!isEqual(prevNodesRef.current, nodes) || !isEqual(prevEdgesRef.current, edges)) {
    onLayout(viewAngle);
    prevNodesRef.current = nodes;
    prevEdgesRef.current = edges;
  }
}, [nodes, edges]);

  return (
    <div className="w-screen h-screen bg-slate-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={onEdgesDelete}
          // onConnect={onConnect}
          nodeTypes={nodeTypes}
          // fitView
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={nodeColor}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          {/* <Panel position="top-right">
        <button className="text-white rounded-lg bg-black p-2 px-3 mr-2" onClick={() => {onLayout('TB'); setViewAngle('TB')}}>V View</button>
        <button className="text-white rounded-lg bg-black p-2 px-3" onClick={() => {onLayout('LR'); setViewAngle('LR')}}>H View</button>
      </Panel> */}
        </ReactFlow>
    </div>
  );
}

const WrappedFlow = () => (
  <ReactFlowProvider>
    <Home />
  </ReactFlowProvider>
);

export default WrappedFlow;