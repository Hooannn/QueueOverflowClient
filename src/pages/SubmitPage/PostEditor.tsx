import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '../../configs/quill';
import { useEffect, useRef } from 'react';
export default function PostEditor({
  onValueLengthChange,
  onValueChange,
  value,
}: {
  onValueLengthChange: (length: number) => void;
  onValueChange: (value: string) => void;
  value: string;
}) {
  const quillRef = useRef<ReactQuill>(null);

  const updateValueLength = () => {
    const innerText = quillRef?.current?.editingArea?.innerText;
    const replaceBreak = (innerText as string).replace('\n', '');
    const length = replaceBreak.trim().length;
    onValueLengthChange(length);
  };

  return (
    <>
      <ReactQuill
        ref={quillRef}
        placeholder="Text (Optional)"
        className="rounded"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={e => {
          updateValueLength();
          onValueChange(e);
        }}
      />
    </>
  );
}
