import React, { useEffect, useRef, useState } from 'react';
import Menu from './Menu';
import './App.css';

const App = () => {
  const [brushColor, setBrushColor] = useState("green");
  const [brushWidth, setBrushWidth] = useState(8);
  const [brushOpacity, setBrushOpacity] = useState(0.5);
  const [isEraser, setIsEraser] = useState(false);
  const [shape, setShape] = useState("none");
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDraw, setIsDraw] = useState(false);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(-1);

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

  const saveState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setHistory((prev) => [...prev.slice(0, step + 1), dataURL]);
    setStep((prev) => prev + 1);
  };

  const undo = () => {
    if (step <= 0) return;
    setStep((prev) => prev - 1);
    restoreCanvas(history[step - 1]);
  };

  const redo = () => {
    if (step >= history.length - 1) return;
    setStep((prev) => prev + 1);
    restoreCanvas(history[step + 1]);
  };

  const restoreCanvas = (dataURL) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const startDraw = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDraw(true);

    if (shape !== "none") {
      ctxRef.current.startX = offsetX;
      ctxRef.current.startY = offsetY;
    }
  };

  const endDraw = (e) => {
    if (!isDraw) return;
    setIsDraw(false);

    if (shape !== "none") {
      const { offsetX, offsetY } = e.nativeEvent;
      const ctx = ctxRef.current;
      ctx.beginPath();

      switch (shape) {
        case "rectangle":
          ctx.rect(ctx.startX, ctx.startY, offsetX - ctx.startX, offsetY - ctx.startY);
          break;
        case "circle":
          const radius = Math.sqrt(Math.pow(offsetX - ctx.startX, 2) + Math.pow(offsetY - ctx.startY, 2));
          ctx.arc(ctx.startX, ctx.startY, radius, 0, Math.PI * 2);
          break;
        case "line":
          ctx.moveTo(ctx.startX, ctx.startY);
          ctx.lineTo(offsetX, offsetY);
          break;
        default:
          break;
      }

      ctx.stroke();
      ctx.closePath();
    }

    saveState();
  };

  const draw = (e) => {
    if (!isDraw || shape !== "none") return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const uploadImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        ctxRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        saveState();
      };
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const text = prompt("Enter text:");
    if (!text) return;
    const x = parseInt(prompt("Enter X coordinate:"), 10);
    const y = parseInt(prompt("Enter Y coordinate:"), 10);
    ctxRef.current.fillText(text, x, y);
    saveState();
  };

  const applyGradient = () => {
    const ctx = ctxRef.current;
    const gradient = ctx.createLinearGradient(0, 0, canvasRef.current.width, 0);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "blue");
    ctx.strokeStyle = gradient;
  };

  return (
    <div className='App'>
      <h1>Paint App</h1>
      <Menu {...{ setBrushColor, setBrushOpacity, setBrushWidth, toggleEraser, isEraser, clearCanvas, saveImage, undo, redo, setShape, uploadImage, addText, applyGradient }} />
      <canvas width="1200px" height="500px"className='draw-area' ref={canvasRef} onMouseDown={startDraw} onMouseUp={endDraw} onMouseMove={draw} />
    </div>
  );
};

export default App;
