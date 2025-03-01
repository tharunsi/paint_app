import React, { useState } from "react";

const Menu = ({
  setBrushColor,
  setBrushOpacity,
  setBrushWidth,
  toggleEraser,
  isEraser,
  clearCanvas,
  saveImage,
  undo,
  redo,
  setShape,
  uploadImage,
  addText,
  applyGradient,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={toggleMenu}>☰ Menu</button>
      
      {showMenu && (
        <div className="menu-dropdown">
          {/* Brush Controls */}
          <div className="menu-section">
            <label>🎨 Brush Color:</label>
            <input type="color" onChange={(e) => setBrushColor(e.target.value)} disabled={isEraser} />

            <label>🖌️ Brush Width:</label>
            <input type="range" min="3" max="20" onChange={(e) => setBrushWidth(e.target.value)} />

            <label>🌫️ Opacity:</label>
            <input type="range" min="1" max="100" onChange={(e) => setBrushOpacity(e.target.value / 100)} />
          </div>

          {/* Tools */}
          <div className="menu-section">
            <button onClick={toggleEraser}>{isEraser ? "🖌️ Brush Mode" : "🧽 Eraser"}</button>
            <button onClick={clearCanvas}>🗑️ Clear Canvas</button>
            <button onClick={saveImage}>💾 Save Image</button>
            <button onClick={undo}>↩️ Undo</button>
            <button onClick={redo}>↪️ Redo</button>
          </div>

          {/* Shape Selector */}
          <div className="menu-section">
            <label>📏 Shapes:</label>
            <select onChange={(e) => setShape(e.target.value)}>
              <option value="none">None</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="line">Line</option>
            </select>
          </div>

          {/* Extra Features */}
          <div className="menu-section">
            <input type="file" accept="image/*" onChange={uploadImage} />
            <button onClick={addText}>📝 Add Text</button>
            <button onClick={applyGradient}>🎨 Gradient Brush</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
