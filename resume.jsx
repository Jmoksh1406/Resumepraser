import React, { useState } from 'react';
import { Upload, Download, FileText, Code, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const ResumeParser = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch('http://localhost:8000/parse', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error("Parsing failed");
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      alert("Error parsing resume. Please check the backend connection.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  // Feature: Download the parsed data since we aren't saving to DB
  const downloadJSON = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${data.full_name.replace(" ", "_")}_parsed.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gemini Resume Parser</h1>
            <p className="text-gray-500 text-sm">Stateless Extraction API</p>
          </div>
          {data && (
            <button 
              onClick={downloadJSON}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Download size={16} /> Download JSON
            </button>
          )}
        </header>

        {/* 1. Upload State */}
        {!data && !loading && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-96 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/10 transition-all bg-white">
            <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" id="resume-upload" />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-300 mb-4" />
              <span className="text-lg font-medium text-gray-700">Drop resume PDF here</span>
            </label>
          </div>
        )}

        {/* 2. Loading State */}
        {loading && (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Reading Document & Normalizing Data...</p>
          </div>
        )}

        {/* 3. Result State */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Quick Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl mb-4">
                  {data.full_name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{data.full_name}</h2>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>📧 {data.email}</p>
                  <p>📱 {data.phone || "No phone found"}</p>
                  <p>📍 {data.location || "No location found"}</p>
                </div>
              </div>

              {/* Raw JSON Preview (For Debugging/Devs) */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-sm text-gray-300 text-xs font-mono overflow-auto max-h-64">
                <div className="flex items-center gap-2 mb-3 text-white font-bold">
                   <Code size={14} /> JSON Output
                </div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>

            {/* Right: Detailed View */}
            <div className="lg:col-span-2 space-y-4">
              <Section title="Work Experience" count={data.work_experience.length}>
                {data.work_experience.map((job, i) => (
                  <div key={i} className="mb-6 last:mb-0 border-l-2 border-gray-200 pl-4">
                    <h3 className="font-bold">{job.role}</h3>
                    <div className="text-blue-600 text-sm font-medium mb-1">{job.company}</div>
                    <div className="text-xs text-gray-400 mb-2">
                      {job.start_date} - {job.is_current ? "Present" : job.end_date}
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {job.responsibilities.slice(0, 3).map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </Section>

              <Section title="Skills" count={data.skills.technical.length}>
                 <div className="flex flex-wrap gap-2">
                    {data.skills.technical.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">{skill}</span>
                    ))}
                 </div>
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, count, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 hover:bg-gray-50">
        <span className="font-bold text-gray-800">{title} <span className="text-gray-400 font-normal ml-1">({count})</span></span>
        {open ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
      </button>
      {open && <div className="p-5 pt-0">{children}</div>}
    </div>
  );
};

export default ResumeParser;