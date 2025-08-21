
import React, { useState, useRef, useCallback } from 'react';
import { QuizSource } from '../services/geminiService';

interface TopicInputFormProps {
  onGenerate: (source: QuizSource) => void;
}

const TopicInputForm: React.FC<TopicInputFormProps> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
    if (newTopic) {
      setFile(null); // Clear file if user starts typing
    }
  };
  
  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setTopic(''); // Clear topic when file is selected
      } else {
        alert('Please upload a valid file type: PDF, DOC, or DOCX.');
      }
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, over: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onGenerate({ file });
    } else if (topic.trim()) {
      onGenerate({ topic: topic.trim() });
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Your Own Quiz</h2>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Enter a topic, or upload a document, and our AI will generate a unique quiz just for you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic-input" className="sr-only">Topic</label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={handleTopicChange}
            placeholder="e.g., The Solar System, React Hooks, World War II"
            className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
            required={!file}
            disabled={!!file}
          />
        </div>

        <div className="flex items-center">
          <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
          <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 font-semibold">OR</span>
          <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={!!topic.trim()}
          />
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDrop={handleDrop}
              className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${topic.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-slate-700/50' : 'border-slate-300 dark:border-slate-600'}`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l4-4m0 0l-4-4m4 4H8" />
                </svg>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">PDF, DOC, or DOCX</p>
              </div>
            </div>
          ) : (
            <div className="w-full p-4 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Remove file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg hover:shadow-xl"
          disabled={!topic.trim() && !file}
        >
          Generate Quiz
        </button>
      </form>
    </div>
  );
};

export default TopicInputForm;
