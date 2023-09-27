import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../../configs/quill";
export default function QuillWrapper({
  handleQuillChange,
  value,
  placeholder,
}: {
  handleQuillChange: (e: any) => void;
  value: string | any;
  placeholder: string;
}) {
  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      value={value}
      placeholder={placeholder}
      onChange={(e) => handleQuillChange(e)}
    />
  );
}
