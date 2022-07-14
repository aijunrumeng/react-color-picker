type RGB = [number, number, number];

type PickerProps = {
  initColor?: string;
  onTouchMove?: (color: number[]) => void;
  onTouchEnd?: (color: number[]) => void;
};
