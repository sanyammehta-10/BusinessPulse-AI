'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Button from './button';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onUpload, isLoading = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Only CSV files are supported.');
        return;
      }
      
      setFile(selectedFile);
      
      // Parse a preview
      Papa.parse(selectedFile, {
        header: true,
        preview: 3, // Just show first 3 rows
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data);
        },
        error: (err) => {
          setError(`Failed to parse CSV preview: ${err.message}`);
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const clearFile = () => {
    setFile(null);
    setPreview([]);
    setError(null);
  };

  const handleUpload = () => {
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-white bg-white/10' 
              : 'border-[#2A2A2D] bg-[#111113] hover:bg-[#171719] hover:border-[#3A3A3D]'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-[#A1A1AA] mb-4" />
          <h3 className="text-lg font-semibold text-[#F5F5F5]">Upload your data</h3>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Drag & drop your CSV file here, or click to browse.
          </p>
        </div>
      ) : (
        <div className="bg-[#171719] rounded-xl border border-[#2A2A2D] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <FileType className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">{file.name}</p>
                <p className="text-xs text-[#A1A1AA]">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={clearFile} disabled={isLoading} className="text-[#A1A1AA] hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {preview.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-[#A1A1AA] mb-2 uppercase font-semibold tracking-wider">Preview</p>
              <div className="overflow-x-auto bg-[#0A0A0B] rounded-lg border border-[#2A2A2D]">
                <table className="min-w-full text-xs text-left text-[#F5F5F5]">
                  <thead className="bg-[#111113] text-[#A1A1AA] uppercase">
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="px-3 py-2 font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2D]">
                    {preview.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val: any, vIdx) => (
                          <td key={vIdx} className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                            {val?.toString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleUpload} isLoading={isLoading} className="w-full sm:w-auto">
              Confirm Upload
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-[#F87171] bg-[#F87171]/10 p-3 rounded-lg border border-[#F87171]/20 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
