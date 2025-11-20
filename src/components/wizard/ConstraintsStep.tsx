import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConstraintsData } from "../DocumentWizard";

type Props = {
  constraints: ConstraintsData;
  setConstraints: (data: ConstraintsData) => void;
};

export const ConstraintsStep = ({ constraints, setConstraints }: Props) => {
  const handleChange = (field: keyof ConstraintsData, value: string) => {
    setConstraints({ ...constraints, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings & Constraints</h2>
        <p className="text-muted-foreground">
          Customize how your document will be generated
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language" className="text-base font-semibold text-foreground">
            Language
          </Label>
          <Select value={constraints.language} onValueChange={(value) => handleChange("language", value)}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vietnamese">Vietnamese</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="both">Bilingual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="depth" className="text-base font-semibold text-foreground">
            Depth & Detail Level
          </Label>
          <Select value={constraints.depth} onValueChange={(value) => handleChange("depth", value)}>
            <SelectTrigger id="depth" className="w-full">
              <SelectValue placeholder="Select detail level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief - Main overview</SelectItem>
              <SelectItem value="medium">Medium - Balanced details</SelectItem>
              <SelectItem value="detailed">Detailed - In-depth analysis</SelectItem>
              <SelectItem value="comprehensive">Comprehensive - Most complete</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {constraints.depth === "brief" && "Summary document with key points"}
            {constraints.depth === "medium" && "Standard document with essential information"}
            {constraints.depth === "detailed" && "In-depth document with examples and explanations"}
            {constraints.depth === "comprehensive" && "Most complete document covering all aspects"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentRequirements" className="text-base font-semibold text-foreground">
            Content Requirements
          </Label>
          <Textarea
            id="contentRequirements"
            placeholder="E.g.: Include flowcharts, use case diagrams, risk analysis..."
            value={constraints.contentRequirements}
            onChange={(e) => handleChange("contentRequirements", e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-sm text-muted-foreground">
            Describe special requirements for format, content, or document structure
          </p>
        </div>
      </div>
    </div>
  );
};
