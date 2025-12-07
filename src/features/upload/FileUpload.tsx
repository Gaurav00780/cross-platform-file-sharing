import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const removeFile = (name: string) => {
        setFiles(files.filter(f => f.name !== name));
    };

    const handleUpload = () => {
        if (files.length > 0) {
            onFilesSelected(files);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card'}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-foreground">
                            {isDragActive ? "Drop files here" : "Drag & drop files here"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            or click to browse from your device
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
                    >
                        <div className="p-4 border-b border-border bg-muted/50">
                            <h3 className="font-medium text-foreground">Selected Files ({files.length})</h3>
                        </div>
                        <ul className="divide-y divide-border">
                            {files.map((file) => (
                                <li key={file.name} className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <File className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(file.name);
                                        }}
                                        className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="p-4 bg-muted/50 border-t border-border">
                            <Button onClick={handleUpload} className="w-full" size="lg">
                                Upload and Share
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
