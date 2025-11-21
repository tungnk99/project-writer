import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileDown, FileText, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentEditor } from "@/components/DocumentEditor";

type Props = {
  generatedDoc: string;
  isGenerating: boolean;
  onReset: () => void;
};

export const ResultsStep = ({ generatedDoc, isGenerating, onReset }: Props) => {
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState(generatedDoc);

  const handleDownload = (format: string) => {
    toast({
      title: "Downloading...",
      description: `Downloading document as ${format.toUpperCase()}`,
    });

    // Create blob and download
    const blob = new Blob([documentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-document.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success!",
      description: `${format.toUpperCase()} file downloaded successfully`,
    });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-accent rounded-full"></div>
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Generating document...</h3>
          <p className="text-muted-foreground">AI is analyzing and creating your document</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Document Generated!</h2>
        <p className="text-muted-foreground">
          Preview content and download in your preferred format
        </p>
      </div>

      <Card className="p-6 bg-accent/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Document Content</h3>
          <p className="text-sm text-muted-foreground ml-auto">
            Select text to edit with AI
          </p>
        </div>
        <DocumentEditor 
          content={documentContent}
          onContentChange={setDocumentContent}
        />
      </Card>

      <Separator />

      <div>
        <h3 className="font-semibold text-foreground mb-4">Download Document</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => handleDownload("md")}
            className="gap-2 h-auto py-4 flex-col"
          >
            <FileDown className="w-5 h-5" />
            <span className="font-medium">Markdown</span>
            <span className="text-xs text-muted-foreground">.md</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownload("docx")}
            className="gap-2 h-auto py-4 flex-col"
          >
            <FileDown className="w-5 h-5" />
            <span className="font-medium">Word</span>
            <span className="text-xs text-muted-foreground">.docx</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownload("pdf")}
            className="gap-2 h-auto py-4 flex-col"
          >
            <FileDown className="w-5 h-5" />
            <span className="font-medium">PDF</span>
            <span className="text-xs text-muted-foreground">.pdf</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownload("txt")}
            className="gap-2 h-auto py-4 flex-col"
          >
            <FileDown className="w-5 h-5" />
            <span className="font-medium">Text</span>
            <span className="text-xs text-muted-foreground">.txt</span>
          </Button>
        </div>
      </div>

      <Separator />

      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        className="w-full gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Create New Document
      </Button>
    </div>
  );
};
