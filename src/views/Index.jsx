import React, { Component } from "react";

import "./index.less";

//色盘
let outerX = 0; //圆相对窗口x
let outerY = 0; //圆相对窗口y
let outerW = 0; //圆的宽
let outerH = 0; //圆的高
let centerX = 0; //圆点相对窗口x
let centerY = 0; //圆点相对窗口y
let handleW = 0; //滑块宽度
let handleH = 0; //滑块高度
let outerRadius = 0; //圆半径
//画布
let canvas = null;
let ctx = null;

//canvas  背景图
const imageSrc = require("../static/images/icon_colorpick.png");

class ColourLight extends Component {
  state = {
    left: "", //左偏移量
    top: "", //右偏移量
  };
  componentDidMount() {
    this.init();
  }
  /**
   * @method: 色盘初始化
   */
  init = () => {
    const { lightcolor = "CEC9FF" } = this.props;
    canvas = document.getElementById("picker");
    ctx = canvas.getContext("2d");
    handleW = this.getDomProperty(".handler", "width");
    handleH = this.getDomProperty(".handler", "height");
    outerRadius = this.getDomProperty(".drap-wrap", "width") / 2;
    outerW = this.getDomProperty(".drap-wrap", "width");
    outerH = this.getDomProperty(".drap-wrap", "height");
    outerX = this.getDomProperty(".drap-wrap", "left");
    outerY = this.getDomProperty(".drap-wrap", "top");
    centerX = this.getDomProperty(".drap-wrap .dot", "left");
    centerY = this.getDomProperty(".drap-wrap .dot", "top");
    this.drawColorImage(ctx, outerW, outerH, imageSrc);
    setTimeout(() => {
      this.getPositionByRGB(lightcolor);
    }, 300);
    this.getPositionByRGB(lightcolor);
  };
  /**
   * @method: touchmove事件 设置色彩
   * @param {Event} e
   */
  handleColor = (e) => {
    const { pageX, pageY } = e.changedTouches[0];
    const curDistance = this.getDistance(
      { x: pageX, y: pageY },
      { x: centerX, y: centerY }
    );
    if (curDistance >= outerRadius - handleW / 2) return;
    const left = parseInt(pageX - outerX - handleW / 2);
    const top = parseInt(pageY - outerY - handleH / 2);
    this.setState({ left, top });
    const imageData = ctx.getImageData(left, top, 1, 1);
    const rgbArr = [...imageData.data].slice(0, 3);
    console.log(rgbArr, "rgbArr");
    //...methods
  };
  /**
   * @method:绘制图像
   * @param {object} ctx canvas上下文
   * @param {number} w 元素宽度
   * @param {number} h 元素高度
   * @param {string} imgScr 图像地址
   */
  drawColorImage = (ctx, w, h, imgScr) => {
    const image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0, w, h);
    };
    image.src = imgScr;
  };
  /**
   * @method: 根据rgb颜色获取位置
   * @param {string} rgb 3个2位16进制拼接成的字符串  例: "ffffff"
   * @return {object}  { x: 1, y: 1 }
   */
  getPositionByRGB = (rgb) => {
    console.log(rgb, "rgb");
    const R = parseInt(rgb.slice(0, 2), 16);
    const G = parseInt(rgb.slice(2, 4), 16);
    const B = parseInt(rgb.slice(4, 6), 16);
    const pixs = ctx.getImageData(0, 0, outerW, outerH).data;
    let positions = [];
    if (rgb.toLowerCase() !== "ffffff") {
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
      positions.push({ left: "50%", top: "50%" });
    }
    if (!positions.length) {
      positions.push({ left: "50%", top: "50%" });
    }
    const { left, top } = positions[0];
    this.setState({ left, top });
  };
  /**
   * @method:获取元素属性
   * @param {string} selectors CSS选择器字符串
   * @param {string} prop 元素属性 height、width、top、left..  etc.
   * @return {number} number
   */
  getDomProperty = (selectors, prop) => {
    return document.querySelector(selectors).getBoundingClientRect()[prop] || 0;
  };
  /**
   * @method:获取两个坐标之间的距离
   * @param {object} location1 {x:1, y:1}
   * @param {object} location2 {x:2, y:2}
   * @return {number} number
   */
  getDistance = (location1, location2) => {
    const dx = Math.abs(location1.x - location2.x);
    const dy = Math.abs(location1.y - location2.y);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  };
  render() {
    const { left, top } = this.state;
    console.log(left, top, "render");
    return (
      <div className="drap-wrap" onTouchMove={this.handleMouseMove}>
        <canvas id="picker" width={outerW} height={outerH}></canvas>
        <div className="handle-wrap">
          <div
            className="handler"
            style={{ left, top }}
            onTouchMove={this.handleColor}
          ></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }
}
export default ColourLight;
