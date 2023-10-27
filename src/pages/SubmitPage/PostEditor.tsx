import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '../../configs/quill';
export default function PostEditor({ onValueChange, value }: { onValueChange: (value: string) => void; value: string }) {
  return (
    <>
      <ReactQuill
        placeholder="Text (Optional)"
        className="rounded"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={e => onValueChange(e)}
      />
    </>
  );
}
