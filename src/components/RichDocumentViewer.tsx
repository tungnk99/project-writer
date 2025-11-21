import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Copy, ArrowDown, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  onContentChange: (content: string) => void;
};

export const RichDocumentViewer = ({ content, onContentChange }: Props) => {
  const [selectedText, setSelectedText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";
      
      if (text && viewerRef.current?.contains(selection?.anchorNode || null)) {
        setSelectedText(text);
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setPopoverPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
          setShowPopover(true);
        }
      } else {
        if (!aiSuggestion) {
          setShowPopover(false);
        }
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, [aiSuggestion]);

  const handleGetSuggestion = async () => {
    if (!instruction.trim()) {
      toast({
        title: "Instruction required",
        description: "Please enter an instruction for editing",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("edit-document", {
        body: {
          selectedText,
          instruction,
          fullDocument: content
        }
      });

      if (error) throw error;

      setAiSuggestion(data.editedText);
      toast({
        title: "Suggestion ready",
        description: "AI has generated an edit suggestion"
      });
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplace = () => {
    const newContent = content.replace(selectedText, aiSuggestion);
    onContentChange(newContent);
    resetPopover();
    toast({
      title: "Content updated",
      description: "The selected text has been replaced"
    });
  };

  const handleInsertBelow = () => {
    const newContent = content.replace(selectedText, `${selectedText}\n\n${aiSuggestion}`);
    onContentChange(newContent);
    resetPopover();
    toast({
      title: "Content inserted",
      description: "The suggestion has been inserted below"
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiSuggestion);
    toast({
      title: "Copied",
      description: "Suggestion copied to clipboard"
    });
  };

  const resetPopover = () => {
    setShowPopover(false);
    setInstruction("");
    setAiSuggestion("");
    setSelectedText("");
  };

  return (
    <div className="relative">
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <div
            style={{
              position: "fixed",
              left: popoverPosition.x,
              top: popoverPosition.y,
              width: 1,
              height: 1,
              pointerEvents: "none"
            }}
          />
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 p-4 z-50" 
          side="top" 
          align="center"
          onInteractOutside={(e) => {
            if (!isLoading) {
              resetPopover();
            } else {
              e.preventDefault();
            }
          }}
        >
          {!aiSuggestion ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Selected text:</p>
                <p className="text-sm text-muted-foreground bg-accent/30 p-2 rounded max-h-20 overflow-y-auto">
                  {selectedText}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  How would you like to edit this?
                </label>
                <Textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="E.g., Make it more concise, Fix grammar, Expand with details..."
                  className="min-h-[80px]"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleGetSuggestion}
                disabled={isLoading || !instruction.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting suggestion...
                  </>
                ) : (
                  "Get AI Suggestion"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">AI Suggestion:</p>
                <div className="text-sm bg-accent/30 p-3 rounded max-h-48 overflow-y-auto">
                  {aiSuggestion}
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleReplace}
                  className="w-full gap-2"
                  variant="default"
                >
                  <Check className="w-4 h-4" />
                  Replace with this
                </Button>
                <Button
                  onClick={handleInsertBelow}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <ArrowDown className="w-4 h-4" />
                  Insert below
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={resetPopover}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div
        ref={viewerRef}
        className="bg-white rounded-lg shadow-sm border border-border max-w-4xl mx-auto"
        style={{
          minHeight: "600px",
          maxHeight: "800px",
          overflowY: "auto"
        }}
      >
        <div className="p-12 prose prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base text-gray-700 mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">
                  {children}
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-blue-50">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody>
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-gray-300">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-gray-100 p-4 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                    {children}
                  </code>
                );
              },
              strong: ({ children }) => (
                <strong className="font-bold text-gray-900">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-700">
                  {children}
                </em>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        <div className="px-12 pb-4 text-xs text-gray-400 border-t border-gray-200 pt-4">
          ---
          <br />
          *Document automatically generated by Document Generator*
          <br />
          *Detail level: medium | Language: vietnamese*
        </div>
      </div>
    </div>
  );
};
