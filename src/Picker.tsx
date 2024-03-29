import { useEffect, useState } from 'react';

import './index.less';

import imageSrc from './color.png';

// 色盘
let outerX = 0; //圆相对窗口x
let outerY = 0; //圆相对窗口y
let outerW = 0; //圆的宽
let outerH = 0; //圆的高
let centerX = 0; //圆点相对窗口x
let centerY = 0; //圆点相对窗口y
let handleW = 0; //滑块宽度
let handleH = 0; //滑块高度
let outerRadius = 0; //圆半径

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export default function Picker(props: PickerProps) {
  const [left, setLeft] = useState<string | number>(0);
  const [top, setTop] = useState<string | number>(0);
  const [rgbArr, setRgbArr] = useState<RGB>([1, 1, 1]);

  const { initColor = 'CEC9FF', onTouchMove, onTouchEnd } = props;

  useEffect(() => {
    initDOMProperty();
    drawColorImage(ctx, outerW, outerH, imageSrc, () => {
      getPositionByRGB(initColor);
    });
  }, []);

  /**
   * @method: 色盘初始化
   */
  const initDOMProperty = () => {
    canvas = document.getElementById('picker') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    handleW = getDomProperty('.handler', 'width');
    handleH = getDomProperty('.handler', 'height');
    outerRadius = getDomProperty('.drap-wrap', 'width') / 2;
    outerW = getDomProperty('.drap-wrap', 'width');
    outerH = getDomProperty('.drap-wrap', 'height');
    outerX = getDomProperty('.drap-wrap', 'left');
    outerY = getDomProperty('.drap-wrap', 'top');
    centerX = getDomProperty('.drap-wrap .dot', 'left');
    centerY = getDomProperty('.drap-wrap .dot', 'top');
  };
  /**
   * @method: touchmove事件 设置色彩
   * @param {Event} e
   */
  const handleTouchMove = (e: any) => {
    const { pageX, pageY } = e.changedTouches[0];

    const curDistance = getDistance(
      { x: pageX, y: pageY },
      { x: centerX, y: centerY }
    );

    let left = Math.ceil(pageX - outerX - handleW / 2);
    let top = Math.ceil(pageY - outerY - handleH / 2);

    if (curDistance >= outerRadius - handleW / 2) {
      // 当前滑动位置与色盘中心形成的角度
      const angle = getAngle(centerX, centerY, pageX, pageY);
      // 当前滑动位置p1和色盘圆心所在位置p0连成的直线,穿过色盘圆上点的坐标p2
      const curPosition = getLocation(centerX, centerY, outerRadius, angle);
      // p2与p0连成的直线,穿过滑块圆上的坐标p4
      const handlePosition = {
        x: (Math.cos((Math.PI / 180) * angle) * handleW) / 2,
        y: (Math.sin((Math.PI / 180) * angle) * handleW) / 2,
      };
      left = curPosition.x - outerX - handleW / 2 - handlePosition.x;
      top = curPosition.y - outerY - handleH / 2 + handlePosition.y;
    }

    setLeft(left);
    setTop(top);
    const imageData = ctx.getImageData(
      left + handleW / 2,
      top + handleW / 2,
      1,
      1
    );
    const rgbArr = [...imageData.data].slice(0, 3) as RGB;
    setRgbArr(rgbArr);
    onTouchMove?.(rgbArr);
  };
  /**
   * @method:绘制图像
   * @param {object} ctx canvas上下文
   * @param {number} w 元素宽度
   * @param {number} h 元素高度
   * @param {string} imgScr 图像地址
   */
  const drawColorImage = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    imgScr: string,
    cb: () => void
  ) => {
    const image = new Image();
    image.onload = function () {
      ctx.drawImage(image, 0, 0, w, h);
    };
    image.src = imgScr;
    cb && cb();
  };
  /**
   * @method: 根据rgb颜色获取位置
   * @param {string} rgb 3个2位16进制拼接成的字符串  例: "ffffff"
   */
  const getPositionByRGB = (rgb: string) => {
    const R = parseInt(rgb.slice(0, 2), 16);
    const G = parseInt(rgb.slice(2, 4), 16);
    const B = parseInt(rgb.slice(4, 6), 16);

    const pixs = ctx.getImageData(0, 0, outerW, outerH).data;
    let positions = [];

    if (rgb.toLowerCase() !== 'ffffff') {
      for (let i = 0; i < pixs.length; i += 4) {
        const r = pixs[i];
        const g = pixs[i + 1];
        const b = pixs[i + 2];
        if (r == R && g == G && b == B) {
          const left = (i / 4) % outerW;
          const top = (i / 4 - left) / outerH;
          positions.push({ left, top });
        }
      }
    } else {
      positions.push({ left: '50%', top: '50%' });
    }
    if (!positions.length) {
      positions.push({ left: '50%', top: '50%' });
    }
    const [{ left, top }] = positions;
    setLeft(left);
    setTop(top);
  };
  /**
   * @method:获取元素属性
   * @param {string} selectors CSS选择器字符串
   * @param {string} prop 元素属性 height、width、top、left..  etc.
   * @return {number} number
   */
  const getDomProperty = (selectors: any, prop: string) => {
    return document.querySelector(selectors).getBoundingClientRect()[prop] || 0;
  };
  /**
   * @method:获取两点坐标直线距离
   * @param {object} location1 {x:1, y:1}
   * @param {object} location2 {x:1, y:1}
   * @return:num
   */
  const getDistance = (location1: any, location2: any) => {
    const dx = Math.abs(location1.x - location2.x);
    const dy = Math.abs(location1.y - location2.y);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  };
  /**
   * @method:获取两个坐标之间的角度
   * @param {number} px 坐标1 x轴
   * @param {number} py 坐标1 y轴
   * @param {number} mx 坐标2 x轴
   * @param {number} my 坐标2 y轴
   * @return {number} number 角度 0-360
   */
  const getAngle = (px: number, py: number, mx: number, my: number) => {
    const x = Math.abs(px - mx);
    const y = Math.abs(py - my);
    const tan = y / x;
    const radina = Math.atan(tan); //用反三角函数求弧度
    let angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度d
    if (mx > px && my > py) {
      angle = 360 - angle;
    }
    if (mx > px && my <= py) {
      angle = angle;
    }
    if (mx < px && my >= py) {
      angle = 180 + angle;
    }
    if (mx < px && my < py) {
      angle = 180 - angle;
    }
    return angle;
  };
  /**
   * @method:已知圆心、半径、角度, 求圆上该点坐标
   * @param {number} x0 圆心x轴距离
   * @param {number} y0 圆心y轴距离
   * @param {number} r 圆的半径
   * @param {number} angle 角度
   * @return {Object} { x:1, y:1 }
   */
  const getLocation = (x0: number, y0: number, r: number, angle: number) => {
    return {
      x: x0 + r * Math.cos((angle * Math.PI) / 180),
      y: y0 - r * Math.sin((angle * Math.PI) / 180),
    };
  };

  return (
    <>
      <div className="drap-wrap">
        <canvas id="picker" width={outerW} height={outerH}></canvas>
        <div className="handle-wrap">
          <div
            className="handler"
            style={{ left, top }}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => {
              onTouchEnd?.(rgbArr);
            }}
          ></div>
          <div className="dot"></div>
        </div>
      </div>
    </>
  );
}
