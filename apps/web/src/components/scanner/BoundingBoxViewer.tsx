'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { ExtractedField } from '@/types';

interface BoundingBoxViewerProps {
  imageUrl: string;
  fields: Record<string, ExtractedField | any>;
  selectedFieldKey?: string | null;
  onSelectField?: (fieldKey: string) => void;
}

export function BoundingBoxViewer({
  imageUrl,
  fields,
  selectedFieldKey,
  onSelectField,
}: BoundingBoxViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBoxes, setShowBoxes] = useState(true);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg relative">
      {/* Viewer Toolbar */}
      <div className="h-11 bg-slate-800/90 backdrop-blur px-4 flex items-center justify-between border-b border-slate-700 text-xs text-slate-300 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            Visual Evidence Canvas
          </span>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
              showBoxes
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                : 'bg-slate-700 text-slate-400 border-slate-600'
            }`}
          >
            {showBoxes ? 'Bounding Boxes: Visible' : 'Bounding Boxes: Hidden'}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-700 text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-700 text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded hover:bg-slate-700 text-slate-300"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#070d14] relative min-h-[420px]">
        <div
          className="relative transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Packaging Image / SVG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Packaged Commodity Evidence"
            className="max-w-[580px] w-full h-auto rounded-lg shadow-2xl border border-slate-700 pointer-events-none select-none"
          />

          {/* Overlaid Bounding Boxes */}
          {showBoxes &&
            Object.entries(fields).map(([key, f]) => {
              const bbox = f.bbox || [0, 0, 0, 0];
              const [x, y, w, h] = bbox;
              if (w <= 0 || h <= 0) return null;

              const isSelected = selectedFieldKey === key;
              const status = f.status || 'PASS';

              // Color codes
              const colorClass =
                status === 'PASS'
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                  : status === 'VERIFY'
                  ? 'border-amber-500 bg-amber-500/25 text-amber-300'
                  : 'border-rose-500 bg-rose-500/30 text-rose-200';

              const activeGlow = isSelected ? 'ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-900 z-20' : 'z-10';

              return (
                <div
                  key={key}
                  onClick={() => onSelectField && onSelectField(key)}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${w}%`,
                    height: `${h}%`,
                  }}
                  className={`absolute border-2 rounded cursor-pointer transition-all duration-150 flex flex-col justify-between p-1 group ${colorClass} ${activeGlow}`}
                  title={`${key}: ${f.value || f.detected_value || 'None'} (${status})`}
                >
                  {/* Field Label Badge */}
                  <div className="opacity-90 group-hover:opacity-100 transition-opacity self-start">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950/80 uppercase tracking-tight flex items-center gap-1 shadow-sm">
                      {status === 'PASS' && <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />}
                      {status === 'VERIFY' && <AlertCircle className="w-2.5 h-2.5 text-amber-400" />}
                      {status === 'FAIL' && <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />}
                      {key.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Confidence Badge */}
                  <div className="self-end opacity-75 group-hover:opacity-100">
                    <span className="text-[9px] font-mono px-1 rounded bg-black/60 font-semibold">
                      {Math.round((f.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="h-9 bg-slate-800/90 px-4 flex items-center justify-between border-t border-slate-700 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            Compliant Declaration
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" />
            Verification Required (&lt; Threshold)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" />
            Statutory Violation / Missing
          </span>
        </div>
        <span className="text-slate-400 italic">Click any bounding box to highlight field details</span>
      </div>
    </div>
  );
}
