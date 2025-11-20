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
        <h2 className="text-2xl font-bold text-foreground mb-2">Thông tin dự án</h2>
        <p className="text-muted-foreground">Nhập các thông tin chi tiết về dự án của bạn</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="overview" className="text-base font-semibold text-foreground">
            1. Thông tin tổng quan về dự án <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="overview"
            placeholder="Mô tả tổng quan về dự án, mục tiêu, phạm vi..."
            value={projectData.overview}
            onChange={(e) => handleChange("overview", e.target.value)}
            className="min-h-[100px] resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessRequirements" className="text-base font-semibold text-foreground">
            2. Yêu cầu nghiệp vụ (Business Requirements)
          </Label>
          <Textarea
            id="businessRequirements"
            placeholder="Mô tả các yêu cầu nghiệp vụ của dự án..."
            value={projectData.businessRequirements}
            onChange={(e) => handleChange("businessRequirements", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="functionalRequirements" className="text-base font-semibold text-foreground">
            3. Yêu cầu chức năng (Functional Requirements)
          </Label>
          <Textarea
            id="functionalRequirements"
            placeholder="Mô tả các chức năng cụ thể của hệ thống..."
            value={projectData.functionalRequirements}
            onChange={(e) => handleChange("functionalRequirements", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nonFunctionalRequirements" className="text-base font-semibold text-foreground">
            4. Yêu cầu phi chức năng (Non-Functional Requirements)
          </Label>
          <Textarea
            id="nonFunctionalRequirements"
            placeholder="Hiệu năng, bảo mật, khả năng mở rộng..."
            value={projectData.nonFunctionalRequirements}
            onChange={(e) => handleChange("nonFunctionalRequirements", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataInfo" className="text-base font-semibold text-foreground">
            5. Thông tin về dữ liệu
          </Label>
          <Textarea
            id="dataInfo"
            placeholder="Cấu trúc dữ liệu, nguồn dữ liệu, xử lý dữ liệu..."
            value={projectData.dataInfo}
            onChange={(e) => handleChange("dataInfo", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deploymentInfo" className="text-base font-semibold text-foreground">
            6. Thông tin triển khai / môi trường
          </Label>
          <Textarea
            id="deploymentInfo"
            placeholder="Môi trường phát triển, staging, production..."
            value={projectData.deploymentInfo}
            onChange={(e) => handleChange("deploymentInfo", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduleInfo" className="text-base font-semibold text-foreground">
            7. Lịch trình & quản lý dự án
          </Label>
          <Textarea
            id="scheduleInfo"
            placeholder="Timeline, milestones, phân công công việc..."
            value={projectData.scheduleInfo}
            onChange={(e) => handleChange("scheduleInfo", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};
