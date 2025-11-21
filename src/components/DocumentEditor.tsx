import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Copy, ArrowDown, Save, ArrowLeft } from "lucide-react";

type Props = {
  content: string;
  onContentChange: (content: string) => void;
};

export const DocumentEditor = ({ content, onContentChange }: Props) => {
  const [selectedText, setSelectedText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";
      
      if (text && editorRef.current?.contains(selection?.anchorNode || null)) {
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
          className="w-96 p-4" 
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
        ref={editorRef}
        className="bg-card rounded-lg p-6 max-h-[500px] overflow-y-auto border border-border"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onContentChange(e.currentTarget.textContent || "")}
        style={{
          minHeight: "400px",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace"
        }}
      >
        {content}
      </div>
    </div>
  );
};
