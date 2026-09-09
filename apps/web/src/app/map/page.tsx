'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, ShieldAlert, AlertTriangle, ShieldCheck, Filter, Sparkles } from 'lucide-react';

const SEEDED_MAP_POINTS = [
  { id: 1, name: 'ABC Foods Packaging Plant', district: 'South East Delhi', state: 'Delhi', lat: 28.5494, lon: 77.2694, score: 94, risk: 'LOW', violations: 0, status: 'Compliant' },
  { id: 2, name: 'Connaught Place Central Market Inspection', district: 'New Delhi', state: 'Delhi', lat: 28.6315, lon: 77.2167, score: 88, risk: 'LOW', violations: 0, status: 'Compliant' },
  { id: 3, name: 'XYZ Agro Mills Oil Facility', district: 'Alwar', state: 'Rajasthan', lat: 27.5530, lon: 76.6346, score: 68, risk: 'MEDIUM', violations: 2, status: 'Verified' },
  { id: 4, name: 'Heritage Grain Mandi Checkpoint', district: 'Fatehgarh Sahib', state: 'Punjab', lat: 30.6436, lon: 76.3994, score: 38, risk: 'CRITICAL', violations: 4, status: 'Notice Issued' },
  { id: 5, name: 'Fresh Organics Unit Baddi', district: 'Solan', state: 'Himachal Pradesh', lat: 30.9045, lon: 77.0967, score: 98, risk: 'LOW', violations: 0, status: 'Compliant' },
  { id: 6, name: 'Noida Sector 62 Retail Hub', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', lat: 28.6280, lon: 77.3649, score: 62, risk: 'MEDIUM', violations: 1, status: 'Under Review' },
  { id: 7, name: 'Gurugram Udyog Vihar Warehouse', district: 'Gurugram', state: 'Haryana', lat: 28.4986, lon: 77.0878, score: 48, risk: 'HIGH', violations: 3, status: 'Notice Issued' },
  { id: 8, name: 'Peenya Industrial Inspection Point', district: 'Bengaluru Urban', state: 'Karnataka', lat: 13.0285, lon: 77.5197, score: 58, risk: 'MEDIUM', violations: 2, status: 'Under Review' },
  { id: 9, name: 'BKC Port Clearance Hub', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.0664, lon: 72.8687, score: 92, risk: 'LOW', violations: 0, status: 'Compliant' },
  { id: 10, name: 'Ahmedabad GIDC Distribution Point', district: 'Ahmedabad', state: 'Gujarat', lat: 23.0020, lon: 72.5850, score: 44, risk: 'HIGH', violations: 3, status: 'Notice Issued' },
  { id: 11, name: 'Faridabad Industrial Unit 14', district: 'Faridabad', state: 'Haryana', lat: 28.4089, lon: 77.3178, score: 72, risk: 'MEDIUM', violations: 1, status: 'Compliant' },
  { id: 12, name: 'Guwahati Tea Warehousing Center', district: 'Kamrup', state: 'Assam', lat: 26.1445, lon: 91.7362, score: 96, risk: 'LOW', violations: 0, status: 'Compliant' }
];

export default function RiskMapPage() {
  const [selectedPoint, setSelectedPoint] = useState<any>(SEEDED_MAP_POINTS[0]);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Initialize Map if not already created
        const container = document.getElementById('leaflet-map');
        if (!container || (container as any)._leaflet_id) return;

        const map = L.map('leaflet-map').setView([28.6139, 77.2090], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | MetroCheck GIS',
          maxZoom: 18,
        }).addTo(map);

        SEEDED_MAP_POINTS.forEach((pt) => {
          const color =
            pt.risk === 'LOW'
              ? '#16a34a'
              : pt.risk === 'MEDIUM'
              ? '#d97706'
              : pt.risk === 'HIGH'
              ? '#ea580c'
              : '#dc2626';

          const markerHtml = `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`;
          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-pin',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          const m = L.marker([pt.lat, pt.lon], { icon: customIcon }).addTo(map);
          m.on('click', () => {
            setSelectedPoint(pt);
          });
        });

        setMapLoaded(true);
      });
    }
  }, []);

  const filteredPoints =
    filterRisk === 'ALL'
      ? SEEDED_MAP_POINTS
      : SEEDED_MAP_POINTS.filter((p) => p.risk === filterRisk);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">
              Geo-Spatial Packaging Risk Map
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold">
              OpenStreetMap + GIS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            District-level statutory enforcement monitoring, violation clusters, and repeat offender surveillance across Delhi NCR and India.
          </p>
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterRisk === r ? 'bg-white text-gov-navy shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
            <div className="flex items-center gap-4 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Compliant (Low Risk)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Medium Risk (60-79)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                High Risk (40-59)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Critical Violator
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Click pin for profile</span>
          </div>

          <div
            id="leaflet-map"
            className="w-full h-[520px] rounded-lg border border-slate-200 shadow-inner z-0"
          />
        </div>

        {/* Selected Inspection / District Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {selectedPoint ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {selectedPoint.district}, {selectedPoint.state}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                    {selectedPoint.name}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedPoint.risk === 'LOW'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedPoint.risk === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedPoint.risk} RISK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Compliance Index</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{selectedPoint.score} / 100</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Recorded Contraventions</div>
                  <div className="text-xl font-black text-rose-700 mt-0.5">{selectedPoint.violations}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="font-semibold text-slate-800">State Legal Metrology Controller</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-semibold text-slate-800">{selectedPoint.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-mono text-slate-500 text-[11px]">{selectedPoint.lat.toFixed(4)}°N, {selectedPoint.lon.toFixed(4)}°E</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert(`Initiating priority inspection order for ${selectedPoint.name}...`)}
                  className="w-full py-2 bg-gov-blue hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Schedule Priority Enforcement Inspection
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
              Select any marker on the map to inspect district metrics.
            </div>
          )}

          {/* Quick Hotspots List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
              Monitored Surveillance Hotspots ({filteredPoints.length})
            </h3>
            <div className="space-y-2 max-h-[220px] overflow-y-auto text-xs pr-1">
              {filteredPoints.map((pt) => (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedPoint?.id === pt.id
                      ? 'border-gov-blue bg-blue-50/60 font-bold'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="text-slate-900 truncate">{pt.name}</div>
                    <div className="text-[10px] text-slate-400">{pt.district}</div>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 ${
                      pt.risk === 'LOW'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pt.risk === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {pt.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
