"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, Camera, AlertCircle, ImageIcon } from 'lucide-react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/modals/LoginModal';
import AddressModal from '../components/modals/AddressModal';
import NotificationPanel from '../components/notifications/NotificationPanel';

interface UploadedFile { name: string; size: number; preview?: string; type: string; }

export default function UploadPrescriptionPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    Array.from(fileList).forEach((f) => {
      if (f.size > 10 * 1024 * 1024) return; // 10MB max
      const isImage = f.type.startsWith('image/');
      newFiles.push({
        name: f.name,
        size: f.size,
        type: f.type,
        preview: isImage ? URL.createObjectURL(f) : undefined,
      });
    });
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header onLoginClick={() => setShowLogin(true)} onLocationClick={() => setShowAddress(true)} onNotificationClick={() => setShowNotif(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AddressModal isOpen={showAddress} onClose={() => setShowAddress(false)} />
      <NotificationPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-2xl">
        {submitted ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-[#4CAF50]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Prescription Uploaded!</h2>
            <p className="text-gray-500">Our pharmacist will review your prescription and reach out within 30 minutes.</p>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm text-[#1E6FD9] font-medium">
              📞 You will receive a call from our pharmacist at your registered number.
            </div>
            <button onClick={() => { setSubmitted(false); setFiles([]); setNotes(''); }} className="text-[#1E6FD9] font-semibold hover:underline text-sm">
              Upload another prescription
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2"><FileText className="w-6 h-6 text-[#1E6FD9]" /> Upload Prescription</h1>
              <p className="text-gray-500 text-sm">Upload your doctor&apos;s prescription and we&apos;ll pack your medicines within the hour.</p>
            </div>

            {/* Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'border-[#1E6FD9] bg-blue-50' : 'border-gray-300 hover:border-[#1E6FD9] hover:bg-blue-50/30'}`}
            >
              <input ref={fileRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-[#1E6FD9]" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Drop your prescription here</h3>
              <p className="text-sm text-gray-400 mb-4">Supports JPG, PNG, or PDF up to 10MB</p>
              <span className="inline-block bg-[#1E6FD9] text-white px-5 py-2 rounded-xl font-bold text-sm">Browse Files</span>
            </div>

            {/* File previews */}
            {files.length > 0 && (
              <div className="space-y-3">
                {files.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    {f.preview ? (
                      <img src={f.preview} alt={f.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{f.name}</p>
                      <p className="text-xs text-gray-400">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="E.g. 'I need 2 months supply', 'Avoid Brand X'..." className="w-full border-2 border-gray-200 focus:border-[#1E6FD9] rounded-xl px-4 py-3 text-sm outline-none resize-none" />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-orange-700">
                <p className="font-bold">Important:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Valid prescription from a registered doctor only</li>
                  <li>Prescription date should be within the last 6 months</li>
                  <li>Image should be clear and all text should be readable</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={files.length === 0}
              className="w-full bg-[#1E6FD9] disabled:opacity-50 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" /> Submit Prescription
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
