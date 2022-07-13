type RGB = [number, number, number];

type CustomProps = {
  initColor?: string;
  onTouchMove?: (color: number[]) => void;
  onTouchEnd?: (color: number[]) => void;
};
