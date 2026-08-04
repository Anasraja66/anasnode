"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  Edge,
  Node,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Play, Save, Settings } from 'lucide-react';
import { CustomNode } from './nodes/CustomNode';
import { WorkflowSidebar } from './WorkflowSidebar';

const nodeTypes = {
  customNode: CustomNode,
};

export interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowCanvasProps {
  workflowId: string;
  workflowName: string;
  initialData?: WorkflowData;
  onBack: () => void;
}

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'customNode',
    position: { x: 250, y: 150 },
    data: { label: 'WhatsApp Trigger', type: 'trigger', app: 'whatsapp', description: 'On new message received' },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow({ workflowName, onBack, initialData }: any) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#0A6BFF', strokeWidth: 2 } }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const typeStr = event.dataTransfer.getData('application/reactflow');
      
      if (!typeStr) return;

      const { type, data } = JSON.parse(typeStr);

      if (!type || !reactFlowBounds) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-zinc-50">
      <WorkflowSidebar />
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-zinc-50/50"
        >
          <Panel position="top-left" className="m-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[13px] font-bold text-zinc-600 shadow-sm border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Panel>

          <Panel position="top-right" className="m-4 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[13px] font-bold text-zinc-700 shadow-sm border border-zinc-200 hover:bg-zinc-50 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0A6BFF] rounded-full text-[13px] font-bold text-white shadow-sm hover:bg-blue-600 transition-colors">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full text-[13px] font-bold text-white shadow-sm hover:bg-green-600 transition-colors">
              <Play className="w-4 h-4" />
              Test
            </button>
          </Panel>

          <Controls />
          <MiniMap zoomable pannable nodeColor={(node) => {
            if (node.data?.type === 'trigger') return '#22c55e';
            if (node.data?.type === 'condition') return '#a855f7';
            return '#3b82f6';
          }} />
          <Background color="#ccc" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
