import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectData } from "../DocumentWizard";

type Props = {
  projectData: ProjectData;
  setProjectData: (data: ProjectData) => void;
};

export const ProjectInfoStep = ({ projectData, setProjectData }: Props) => {
  const handleChange = (field: keyof ProjectData, value: string) => {
    setProjectData({ ...projectData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Project Information</h2>
        <p className="text-muted-foreground">Enter detailed information about your project</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="overview" className="text-base font-semibold text-foreground">
            1. Project Overview <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="overview"
            placeholder="Describe the project overview, objectives, scope..."
            value={projectData.overview}
            onChange={(e) => handleChange("overview", e.target.value)}
            className="min-h-[100px] resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessRequirements" className="text-base font-semibold text-foreground">
            2. Business Requirements
          </Label>
          <Textarea
            id="businessRequirements"
            placeholder="Describe the business requirements of the project..."
            value={projectData.businessRequirements}
            onChange={(e) => handleChange("businessRequirements", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="functionalRequirements" className="text-base font-semibold text-foreground">
            3. Functional Requirements
          </Label>
          <Textarea
            id="functionalRequirements"
            placeholder="Describe specific system functionalities..."
            value={projectData.functionalRequirements}
            onChange={(e) => handleChange("functionalRequirements", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nonFunctionalRequirements" className="text-base font-semibold text-foreground">
            4. Non-Functional Requirements
          </Label>
          <Textarea
            id="nonFunctionalRequirements"
            placeholder="Performance, security, scalability..."
            value={projectData.nonFunctionalRequirements}
            onChange={(e) => handleChange("nonFunctionalRequirements", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataInfo" className="text-base font-semibold text-foreground">
            5. Data Information
          </Label>
          <Textarea
            id="dataInfo"
            placeholder="Data structure, data sources, data processing..."
            value={projectData.dataInfo}
            onChange={(e) => handleChange("dataInfo", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deploymentInfo" className="text-base font-semibold text-foreground">
            6. Deployment & Environment
          </Label>
          <Textarea
            id="deploymentInfo"
            placeholder="Development environment, staging, production..."
            value={projectData.deploymentInfo}
            onChange={(e) => handleChange("deploymentInfo", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduleInfo" className="text-base font-semibold text-foreground">
            7. Schedule & Project Management
          </Label>
          <Textarea
            id="scheduleInfo"
            placeholder="Timeline, milestones, task assignments..."
            value={projectData.scheduleInfo}
            onChange={(e) => handleChange("scheduleInfo", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};
