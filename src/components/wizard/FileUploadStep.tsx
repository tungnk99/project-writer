import { useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
};

export const FileUploadStep = ({ files, setFiles }: Props) => {
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      
      if (files.length + selectedFiles.length > 10) {
        toast({
          title: "Quá nhiều file",
          description: "Bạn chỉ có thể tải lên tối đa 10 file",
          variant: "destructive",
        });
        return;
      }

      const oversizedFiles = selectedFiles.filter(file => file.size > 20 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File quá lớn",
          description: "Mỗi file không được vượt quá 20MB",
          variant: "destructive",
        });
        return;
      }

      setFiles([...files, ...selectedFiles]);
      toast({
        title: "Thành công",
        description: `Đã thêm ${selectedFiles.length} file`,
      });
    },
    [files, setFiles, toast]
  );

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    toast({
      title: "Đã xóa file",
      description: "File đã được xóa khỏi danh sách",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tải file dự án</h2>
        <p className="text-muted-foreground">
          Thêm các tài liệu liên quan đến dự án (tối đa 10 file, mỗi file không quá 20MB)
        </p>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground mb-1">
              Nhấp để chọn file hoặc kéo thả vào đây
            </p>
            <p className="text-sm text-muted-foreground">
              PDF, DOC, DOCX, TXT, MD, XLSX, XLS
            </p>
          </div>
          <Button type="button" variant="outline" className="mt-2">
            Chọn file
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">File đã chọn ({files.length}/10)</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-accent rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
