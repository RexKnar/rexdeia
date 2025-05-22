'use client';
// Main.jsx or App.jsx
import 'reactflow/dist/style.css';

import React, { useCallback, useState } from 'react';
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { cn } from 'utils';

const nodeTypes = {
  module: ModuleNode,
  chapter: ChapterNode,
  chapterItem: ChapterItemNode,
  assessment: AssessmentNode,
  project: ProjectNode,
};

function BaseNode({ data, isConnectable }) {
  const className = cn(
    'text-white text-center cursor-pointer min-w-[120px] p-2 rounded-[12px] shadow-md',
    {
      'bg-green-500': data.completed && !data.color,
      'bg-blue-500': !data.completed && !data.color,
    }
  );

  return (
    <div className={className} onClick={() => data.onClick(data)}>
      {data.label}
      {data.side === 'left' && (
        <Handle
          type="target"
          position={Position.Right}
          isConnectable={isConnectable}
          id="right"
        />
      )}
      {data.side === 'right' && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          id="left"
        />
      )}
      {!data.side && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          id="top"
        />
      )}
      {data.side === 'left' && (
        <Handle
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
          id="left"
        />
      )}
      {data.side === 'right' && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          id="right"
        />
      )}
      {!data.side && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            isConnectable={isConnectable}
            id="left"
          />
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            id="right"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            id="bottom"
          />
        </>
      )}
    </div>
  );
}

function TextNode({ data, isConnectable }) {
  const className = cn(
    'text-[8px] text-white text-center cursor-pointer min-w-[120px] p-1 rounded-[12px] shadow-md',
    {
      'bg-green-500': data.completed && !data.color,
      'bg-blue-500': !data.completed && !data.color,
    }
  );

  return (
    <div className={className} onClick={() => data.onClick(data)}>
      {data.label}
      {data.side === 'left' && (
        <Handle
          type="target"
          position={Position.Right}
          isConnectable={isConnectable}
          id="right"
        />
      )}
      {data.side === 'right' && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          id="left"
        />
      )}
      {!data.side && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          id="top"
        />
      )}
      {data.side === 'left' && (
        <Handle
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
          id="left"
        />
      )}
      {data.side === 'right' && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          id="right"
        />
      )}
      {!data.side && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            isConnectable={isConnectable}
            id="left"
          />
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            id="right"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            id="bottom"
          />
        </>
      )}
    </div>
  );
}

function ModuleNode(props) {
  return <BaseNode {...props} />;
}
function ChapterNode(props) {
  return <TextNode {...props} />;
}
function ChapterItemNode(props) {
  return <TextNode {...props} />;
}
function AssessmentNode(props) {
  return <TextNode {...props} />;
}
function ProjectNode(props) {
  return <BaseNode {...props} />;
}

function FlowChart({ courseStructure, courseNodes, courseEdges }: any = []) {
  const [nodes] = useNodesState(courseNodes);
  const [edges] = useEdgesState(courseEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const nodesWithClick = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onClick: () => onNodeClick(null, node),
    },
  }));

  return (
    courseStructure.length > 0 && (
      <div style={{ height: '100vh', width: '100%' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodesWithClick}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>

        {selectedNode && (
          <div
            style={{
              position: 'fixed',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              padding: '16px',
              borderRadius: '8px',
              zIndex: 50,
            }}
          >
            <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
              {selectedNode.data.label}
            </h2>
            <p>
              Status: {selectedNode.data.completed ? 'Completed' : 'Incomplete'}
            </p>
            <button
              style={{
                marginTop: '8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
              }}
              onClick={() => setSelectedNode(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    )
  );
}

export default FlowChart;
