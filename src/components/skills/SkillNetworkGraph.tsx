import React, { useRef, useEffect, useState } from 'react';
import {
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Zap,
  TrendingUp,
  Download
} from 'lucide-react';
import { skillRelationshipNodes, skillRelationshipEdges } from '../../services/marketData';

export const SkillNetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(skillRelationshipNodes[0]);
  const [filterCluster, setFilterCluster] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const clusters = ['All', 'AI', 'DevOps', 'Data', 'Security', 'Backend'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 480);

    const nodes = skillRelationshipNodes.map((node, i) => {
      const angle = (i / skillRelationshipNodes.length) * 2 * Math.PI;
      const radius = 150 + (i % 3) * 35;
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Edges
      skillRelationshipEdges.forEach((edge: any) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = edge.weight * 2;
          ctx.stroke();
        }
      });

      // Draw Nodes
      nodes.forEach((node: any) => {
        const isSelected = selectedNode?.id === node.id;
        const matchesCluster = filterCluster === 'All' || node.category === filterCluster;
        const opacity = matchesCluster ? 1 : 0.2;

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * zoomLevel, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isSelected ? 20 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isSelected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Draw Label
        ctx.font = isSelected ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
        ctx.globalAlpha = 1;
      });
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 480;
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedNode, filterCluster, zoomLevel]);

  return (
    <div className="w-full space-y-10 animate-fade-in flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">
              Skill Co-occurrence & Cluster Network
            </h2>
            <span className="azure-badge">Physics Engine</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Visual graph mapping co-requisite Azure cloud skills, emerging clusters, and salary premiums.
          </p>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {clusters.map(cluster => (
            <button
              key={cluster}
              onClick={() => setFilterCluster(cluster)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterCluster === cluster
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {cluster}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Details Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Canvas Graph */}
        <div className="lg:col-span-8 saas-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-[var(--text-primary)]">Interactive Cloud Skill Graph</span>
            </div>
            <span className="text-xs text-[var(--text-muted)]">Physics Nodes</span>
          </div>

          <div className="relative w-full h-[450px] bg-[var(--bg-surface-subtle)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
            <span>Node size = Market posting volume</span>
            <span>Edge thickness = Co-occurrence frequency</span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node Inspector */}
        <div className="lg:col-span-4 space-y-6">
          {selectedNode && (
            <div className="saas-card p-8 rounded-3xl space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 block mb-1">
                  {selectedNode.category} Specialization
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mt-1.5 mb-1">{selectedNode.label}</h3>
                <span className="text-xs text-emerald-400 font-bold block leading-relaxed">
                  Demand Score: {selectedNode.demand} / 100
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-color)] text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Category:</span>
                  <span className="text-sky-400 font-bold font-mono">{selectedNode.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Relative Demand:</span>
                  <span className="text-emerald-400 font-bold font-mono">High Surge</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
