import { Popover, Button } from 'antd';
import { useState, useEffect } from 'react';
import { TwitterPicker } from 'react-color';
import { IResponseData } from '../../hooks/useFetch';

export default function ColorPicker({
  initColor,
  onUpdateColor,
}: {
  initColor: string;
  onUpdateColor: (value: string) => Promise<IResponseData<unknown>>;
}) {
  const [color, setColor] = useState(initColor);

  useEffect(() => {
    setColor(initColor);
  }, [initColor]);

  return (
    <Popover
      trigger="click"
      className="color_picker"
      onOpenChange={value => {
        if (!value && color !== initColor) onUpdateColor(color);
      }}
      content={
        <div>
          <TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} />
        </div>
      }
    >
      <div
        style={{
          height: '30px',
          width: '30px',
          cursor: 'pointer',
          borderRadius: '4px',
          background: color,
        }}
      />
    </Popover>
  );
}
