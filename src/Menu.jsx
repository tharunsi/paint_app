import React from 'react';

const Menu = ({ setBrushColor, setBrushOpacity, setBrushWidth, toggleEraser, isEraser }) => {
  return (
    <div className='menu'>
      <label htmlFor="brush_color">Brush Color:</label>
      <input 
        type="color" 
        onChange={(e) => setBrushColor(e.target.value)} 
        disabled={isEraser} 
      />

      <label htmlFor="brush_width">Brush Width: </label>
      <input type="range" min="3" max="20" onChange={(e) => setBrushWidth(e.target.value)} />

      <label htmlFor="brush_opacity">Brush Opacity:</label>
      <input type="range" min="1" max="100" onChange={(e) => setBrushOpacity(e.target.value / 100)} />

     
      <button onClick={toggleEraser}>
        {isEraser ? "Brush" : "Eraser"}
      </button>
    </div>
  );
};

export default Menu;
