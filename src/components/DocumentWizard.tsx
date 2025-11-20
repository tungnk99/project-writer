import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectInfoStep } from "./wizard/ProjectInfoStep";
import { FileUploadStep } from "./wizard/FileUploadStep";
import { ConstraintsStep } from "./wizard/ConstraintsStep";
import { PreviewStep } from "./wizard/PreviewStep";
import { ResultsStep } from "./wizard/ResultsStep";
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";

export type ProjectData = {
  overview: string;
  businessRequirements: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  dataInfo: string;
  deploymentInfo: string;
  scheduleInfo: string;
};

export type ConstraintsData = {
  language: string;
  depth: string;
  contentRequirements: string;
};

const STEPS = [
  { id: 1, name: "Thông tin dự án", component: ProjectInfoStep },
  { id: 2, name: "Tải file", component: FileUploadStep },
  { id: 3, name: "Ràng buộc", component: ConstraintsStep },
  { id: 4, name: "Xem trước", component: PreviewStep },
  { id: 5, name: "Kết quả", component: ResultsStep },
];

export const DocumentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    overview: "",
    businessRequirements: "",
    functionalRequirements: "",
    nonFunctionalRequirements: "",
    dataInfo: "",
    deploymentInfo: "",
    scheduleInfo: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [constraints, setConstraints] = useState<ConstraintsData>({
    language: "vietnamese",
    depth: "medium",
    contentRequirements: "",
  });
  const [generatedDoc, setGeneratedDoc] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setProjectData({
      overview: "",
      businessRequirements: "",
      functionalRequirements: "",
      nonFunctionalRequirements: "",
      dataInfo: "",
      deploymentInfo: "",
      scheduleInfo: "",
    });
    setFiles([]);
    setConstraints({
      language: "vietnamese",
      depth: "medium",
      contentRequirements: "",
    });
    setGeneratedDoc("");
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/30 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Document Generator</h1>
          </div>
          <p className="text-muted-foreground">Tạo tài liệu dự án chuyên nghiệp với AI</p>
        </div>

        {/* Progress Steps */}
        <Card className="p-6 shadow-[var(--shadow-medium)]">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-medium)]"
                        : currentStep > step.id
                        ? "bg-success text-success-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium transition-colors ${
                      currentStep === step.id
                        ? "text-primary"
                        : currentStep > step.id
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                      currentStep > step.id ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <Card className="p-8 shadow-[var(--shadow-strong)]">
          <CurrentStepComponent
            projectData={projectData}
            setProjectData={setProjectData}
            files={files}
            setFiles={setFiles}
            constraints={constraints}
            setConstraints={setConstraints}
            generatedDoc={generatedDoc}
            setGeneratedDoc={setGeneratedDoc}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            onNext={handleNext}
            onReset={handleReset}
          />
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !projectData.overview}
              className="gap-2"
            >
              Tiếp theo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
