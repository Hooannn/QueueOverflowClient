import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '../../configs/quill';
import { useRef, forwardRef, ForwardedRef, useImperativeHandle, useState, useEffect } from 'react';

interface PostEditorProps {
  onValueLengthChange: (length: number) => void;
  onValueChange: (value: string) => void;
  value: string;
}

const PostEditor = forwardRef(({ onValueLengthChange, onValueChange, value }: PostEditorProps, ref: ForwardedRef<any>) => {
  const quillRef = useRef<ReactQuill>(null);
  const updateValueLength = () => {
    //@ts-ignore
    const innerText = quillRef?.current?.editingArea?.innerText;
    const replaceBreak = (innerText as string).replace('\n', '');
    const length = replaceBreak.trim().length;
    onValueLengthChange(length);
  };

  useEffect(() => {
    updateValueLength();
  }, [value]);

  return (
    <div ref={ref as any}>
      <ReactQuill
        ref={quillRef}
        placeholder="Text (Optional)"
        className="rounded"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={e => {
          onValueChange(e);
        }}
      />
    </div>
  );
});

export default PostEditor;
