'use client';

import React, { useState } from 'react';
import { QrCode, Search, ShieldCheck, AlertCircle, AlertTriangle, Send } from 'lucide-react';
import { api } from '@/lib/api';

export default function ConsumerVerificationPage() {
  const [code, setCode] = useState('MC-2026-01001');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  // Grievance Form State
  const [showGrievance, setShowGrievance] = useState(false);
  const [consumerName, setConsumerName] = useState('');
  const [consumerPhone, setConsumerPhone] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [grievanceType, setGrievanceType] = useState('Overcharging above MRP');
  const [description, setDescription] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setNotFound(false);
    try {
      const data = await api.verifyQr(code.trim());
      setResult(data);
    } catch (err) {
      setNotFound(true);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.submitGrievance({
        consumer_name: consumerName,
        consumer_phone: consumerPhone,
        product_name: result?.product_name || 'Reported Commodity',
        manufacturer: result?.manufacturer || 'Unknown',
        store_location: storeLocation,
        violation_type: grievanceType,
        description: description,
      });
      setGrievanceSubmitted(res.grievance_number);
    } catch (err) {
      console.error('Grievance submission error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <QrCode className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Citizen Packaging Verification Portal
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Verify physical retail commodities under the Legal Metrology (Packaged Commodities) Rules, 2011. Enter the packaging QR code or case reference to verify authenticity.
        </p>

        {/* Search / Verify Bar */}
        <form onSubmit={handleVerify} className="flex items-center justify-center gap-2 max-w-md mx-auto pt-3">
          <input
            type="text"
            placeholder="Enter QR / Verification Code (e.g. MC-2026-01001)..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-1 focus:ring-gov-blue outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gov-blue hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            {loading ? 'Verifying...' : 'Verify Product'}
          </button>
        </form>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-1 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Government Verification Record</span>
            </div>
            <h2 className="text-2xl font-black">{result.product_name}</h2>
            <p className="text-emerald-100 text-xs">{result.manufacturer}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 font-bold uppercase">MetroCheck Index</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">
                  {result.compliance_index} <span className="text-sm text-slate-400 font-bold">/ 100</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Verification Date</div>
                <div className="text-base font-black text-slate-900 mt-2">{result.verified_on}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Statutory Status</div>
                <div className="text-base font-black text-emerald-700 mt-2 uppercase">{result.status}</div>
              </div>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Legal Metrology Standards Conformance</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Mandatory declarations (MRP inclusive of all taxes, net quantity, standard unit of measurement, complete packer address, and manufacturing dates) conform to Rule 6 specifications.
              </p>
            </div>

            <div className="text-[11px] text-slate-400 italic text-center">
              {result.disclaimer}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowGrievance(!showGrievance)}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Report Packaging Defect or Overcharging (File Grievance)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Not Found Alert */}
      {notFound && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-center text-xs text-rose-900 space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <h3 className="font-bold text-sm">No Official Verification Record Found</h3>
          <p className="max-w-md mx-auto text-rose-700 text-[11px]">
            The code &quot;{code}&quot; does not match an authenticated Legal Metrology inspection record. If this product was purchased in a retail store, you may lodge a citizen grievance.
          </p>
        </div>
      )}

      {/* Citizen Grievance Form Modal / Inline */}
      {showGrievance && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              Citizen Grievance Redressal Form (Legal Metrology Division)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reports are forwarded to the District Legal Metrology Inspector for physical store verification.
            </p>
          </div>

          {grievanceSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">Grievance Successfully Registered!</h4>
              <p className="text-xs text-emerald-800 font-mono font-bold">
                Docket Number: {grievanceSubmitted}
              </p>
              <p className="text-[11px] text-slate-500">
                You will receive updates via SMS. Thank you for safeguarding consumer rights.
              </p>
            </div>
          ) : (
            <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    placeholder="e.g. Pooja Verma"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Contact Mobile Number:</label>
                  <input
                    type="tel"
                    required
                    value={consumerPhone}
                    onChange={(e) => setConsumerPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Store / Retailer Location:</label>
                  <input
                    type="text"
                    required
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    placeholder="e.g. Supermarket, Sector 18, Noida"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Grievance Category:</label>
                  <select
                    value={grievanceType}
                    onChange={(e) => setGrievanceType(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-1 focus:ring-gov-blue"
                  >
                    <option>Overcharging above printed MRP</option>
                    <option>Dual MRP sticker pasted over original price</option>
                    <option>Missing net quantity or unit declaration</option>
                    <option>Smudged / unreadable manufacturing or expiry date</option>
                    <option>Missing consumer care telephone / contact details</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Description &amp; Observed Facts:</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail what you observed on the packaging or billing counter..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-1 focus:ring-gov-blue"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg transition-colors shadow-xs inline-flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Statutory Grievance</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
