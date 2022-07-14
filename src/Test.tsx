import React from 'react';
import ColorPicker from 'react-mobile-circle-color-picker';

export default function Test() {
  return (
    <div className="test">
      <ColorPicker
        onTouchEnd={(rgb) => {
          console.log(rgb, 'rgb');
        }}
      />
    </div>
  );
}
