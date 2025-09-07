'use client';

import React, { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import { useRouter } from "next/navigation";

interface UploadedDoc {
  id: string;
  name: string;
  url: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch uploaded documents (replace with real API call)
  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      // TODO: Replace with real API call
      const res = await fetch("/api/upload");
      if (res.ok) {
        setDocs(await res.json());
      }
      setLoading(false);
    }
    fetchDocs();
  }, []);

  // Upload new or replacement document
  const handleUpload = async (file: File, replaceId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (replaceId) formData.append("replaceId", replaceId);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const updated = await res.json();
      setDocs(updated);
    }
  };

  // Delete document
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/upload?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setDocs(docs.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-green-gradient flex flex-col items-center justify-center text-brand-black dark:text-brand-white">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-brand-green">Your Uploaded Documents</h1>
        <FileUpload label="Upload New Document" onChange={file => file && handleUpload(file)} />
        <div className="mt-8 space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : docs.length === 0 ? (
            <div className="text-brand-black/60 dark:text-brand-white/60">No documents uploaded yet.</div>
          ) : (
            docs.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 bg-brand-green-light rounded-lg p-4 shadow-card">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-brand-green font-medium hover:underline">{doc.name}</a>
                <button className="text-xs text-brand-green hover:underline" onClick={() => document.getElementById(`replace-${doc.id}`)?.click()}>Replace</button>
                <input id={`replace-${doc.id}`} type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], doc.id)} />
                <button className="text-xs text-red-500 hover:underline ml-2" onClick={() => handleDelete(doc.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
      <button
        className="btn btn-secondary mt-4 w-full max-w-xs"
        onClick={() => router.back()}
      >
         Back
      </button>
    </div>
  );
}
