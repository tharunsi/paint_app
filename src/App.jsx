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
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

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
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
  
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  
    setStartPos({ x, y }); // Store start position
    setIsDraw(true);
  };

  const endDraw = (e) => {
    if (!isDraw) return;
    setIsDraw(false);

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const ctx = ctxRef.current;
    ctx.strokeStyle = isEraser ? "white" : brushColor;
    ctx.beginPath();

    switch (shape) {
      case "rectangle":
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
        break;
      case "circle":
        const radius = Math.sqrt((x - startPos.x) ** 2 + (y - startPos.y) ** 2);
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        break;
      case "line":
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        break;
      default:
        return;
    }

    ctx.stroke();
    ctx.closePath();
    saveState();
    setShape("none");
  };

  const draw = (e) => {
    if (!isDraw || shape !== "none") return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctxRef.current.lineTo(x, y);
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
      <canvas 
        width="1500px" 
        height="600px" 
        className='draw-area' 
        ref={canvasRef} 
        onMouseDown={startDraw} 
        onMouseUp={endDraw} 
        onMouseMove={draw} 
      />
    </div>
  );
};

export default App;
