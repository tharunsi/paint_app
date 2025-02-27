import React, { useEffect, useRef, useState } from 'react';
import Menu from './Menu';
import './App.css';

const App = () => {
  const [brushColor, setBrushColor] = useState("green");
  const [brushWidth, setBrushWidth] = useState(8);
  const [brushOpacity, setBrushOpacity] = useState(0.5);
  const [isEraser, setIsEraser] = useState(false); // Track eraser mode
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = brushOpacity;
    ctx.strokeStyle = isEraser ? "white" : brushColor; 
    ctx.lineWidth = brushWidth;
    ctxRef.current = ctx;
  }, [brushColor, brushOpacity, brushWidth, isEraser]);

  const startDraw = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDraw(true);
  };

  const endDraw = () => {
    ctxRef.current.closePath();
    setIsDraw(false);
  };

  const draw = (e) => {
    if (!isDraw) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

 
  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  return (
    <div className='App'>
      <h1>Paint App</h1>
      <div className="draw-area">
        <Menu
          setBrushColor={setBrushColor}
          setBrushOpacity={setBrushOpacity}
          setBrushWidth={setBrushWidth}
          toggleEraser={toggleEraser}
          isEraser={isEraser}
        />
        <canvas
          width="1200px"
          height="500px"
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseMove={draw}
        />
      </div>
    </div>
  );
};

export default App;
