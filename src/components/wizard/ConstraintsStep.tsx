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
        <h2 className="text-2xl font-bold text-foreground mb-2">Cài đặt & Ràng buộc</h2>
        <p className="text-muted-foreground">
          Tùy chỉnh cách tài liệu của bạn sẽ được tạo
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language" className="text-base font-semibold text-foreground">
            Ngôn ngữ viết
          </Label>
          <Select value={constraints.language} onValueChange={(value) => handleChange("language", value)}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="both">Cả hai / Bilingual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="depth" className="text-base font-semibold text-foreground">
            Độ sâu & Chi tiết
          </Label>
          <Select value={constraints.depth} onValueChange={(value) => handleChange("depth", value)}>
            <SelectTrigger id="depth" className="w-full">
              <SelectValue placeholder="Chọn mức độ chi tiết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Ngắn gọn - Tổng quan chính</SelectItem>
              <SelectItem value="medium">Trung bình - Cân bằng chi tiết</SelectItem>
              <SelectItem value="detailed">Chi tiết - Phân tích sâu</SelectItem>
              <SelectItem value="comprehensive">Toàn diện - Đầy đủ nhất</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {constraints.depth === "brief" && "Tài liệu tóm tắt với các điểm chính"}
            {constraints.depth === "medium" && "Tài liệu chuẩn với thông tin cần thiết"}
            {constraints.depth === "detailed" && "Tài liệu chuyên sâu với ví dụ và giải thích"}
            {constraints.depth === "comprehensive" && "Tài liệu đầy đủ nhất với mọi khía cạnh"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentRequirements" className="text-base font-semibold text-foreground">
            Yêu cầu về nội dung
          </Label>
          <Textarea
            id="contentRequirements"
            placeholder="Ví dụ: Bao gồm sơ đồ luồng, use case diagrams, phân tích rủi ro..."
            value={constraints.contentRequirements}
            onChange={(e) => handleChange("contentRequirements", e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-sm text-muted-foreground">
            Mô tả các yêu cầu đặc biệt về format, nội dung, hoặc cấu trúc tài liệu
          </p>
        </div>
      </div>
    </div>
  );
};
