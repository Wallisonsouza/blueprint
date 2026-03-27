
// // --- GRID ---
// function drawGrid() {
//   if (!ctx) return;
//   const w = gridCanvas.width;
//   const h = gridCanvas.height;
//   ctx.clearRect(0, 0, w, h);
//   ctx.strokeStyle = "#ccc";
//   ctx.lineWidth = 1;

//   for (let x = offsetX % (gridSize * scale); x < w; x += gridSize * scale) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, h);
//     ctx.stroke();
//   }

//   for (let y = offsetY % (gridSize * scale); y < h; y += gridSize * scale) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(w, y);
//     ctx.stroke();
//   }
// }
