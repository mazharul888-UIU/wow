import { jsPDF } from "jspdf";

export type DatePlanPdfData = {
  date: string;
  time: string;
  activity: string;
  foods: string[];
  notes: string;
};

const canvasWidth = 1240;
const canvasHeight = 1754;

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawHeart(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  context.save();
  context.translate(x, y);
  context.scale(size / 100, size / 100);
  context.beginPath();
  context.moveTo(50, 88);
  context.bezierCurveTo(42, 76, 8, 55, 8, 28);
  context.bezierCurveTo(8, 8, 32, 0, 50, 20);
  context.bezierCurveTo(68, 0, 92, 8, 92, 28);
  context.bezierCurveTo(92, 55, 58, 76, 50, 88);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let currentLine = words[0];

  for (const word of words.slice(1)) {
    const candidate = `${currentLine} ${word}`;
    if (context.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);
  return lines;
}

function drawDetailCard({
  context,
  x,
  y,
  width,
  height,
  label,
  value,
  accent,
  valueSize = 40,
  italic = false,
}: {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: string;
  accent: string;
  valueSize?: number;
  italic?: boolean;
}) {
  context.save();
  roundedRect(context, x, y, width, height, 28);
  context.fillStyle = "#fffdfc";
  context.fill();
  context.strokeStyle = "#efd9dc";
  context.lineWidth = 2;
  context.stroke();

  context.beginPath();
  context.arc(x + 54, y + 54, 24, 0, Math.PI * 2);
  context.fillStyle = accent;
  context.fill();
  drawHeart(context, x + 42, y + 42, 24, "#ffffff");

  context.fillStyle = "#a65b6b";
  context.font = '700 22px Arial, sans-serif';
  context.fillText(label.toUpperCase(), x + 94, y + 63);

  context.fillStyle = "#57373d";
  context.font = `${italic ? "italic " : ""}600 ${valueSize}px Georgia, serif`;
  const valueLines = wrapText(context, value, width - 92);
  const lineHeight = valueSize * 1.28;
  valueLines.forEach((line, index) => {
    context.fillText(line, x + 46, y + 124 + index * lineHeight);
  });
  context.restore();
}

export function createDatePlanPdf(data: DatePlanPdfData) {
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("PDF canvas could not be created.");
  }

  const background = context.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  background.addColorStop(0, "#fff9f7");
  background.addColorStop(0.52, "#fff3f4");
  background.addColorStop(1, "#fbe9e2");
  context.fillStyle = background;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  context.globalAlpha = 0.55;
  context.beginPath();
  context.arc(105, 220, 210, 0, Math.PI * 2);
  context.fillStyle = "#f7cfd7";
  context.fill();
  context.beginPath();
  context.arc(1185, 1510, 260, 0, Math.PI * 2);
  context.fillStyle = "#f3d8c8";
  context.fill();
  context.globalAlpha = 1;

  context.save();
  context.shadowColor = "rgba(107, 52, 65, 0.16)";
  context.shadowBlur = 42;
  context.shadowOffsetY = 18;
  roundedRect(context, 70, 60, 1100, 1634, 48);
  context.fillStyle = "rgba(255, 255, 255, 0.96)";
  context.fill();
  context.restore();

  roundedRect(context, 92, 82, 1056, 1590, 38);
  context.strokeStyle = "#ecc9cf";
  context.lineWidth = 2;
  context.stroke();

  roundedRect(context, 434, 126, 372, 62, 31);
  context.fillStyle = "#fff1f3";
  context.fill();
  context.strokeStyle = "#e9b7c0";
  context.stroke();
  drawHeart(context, 465, 143, 30, "#d85e77");
  context.fillStyle = "#ad5467";
  context.font = '700 22px Arial, sans-serif';
  context.textAlign = "center";
  context.fillText("SAMI + JOHRA", 645, 165);

  context.fillStyle = "#55343a";
  context.font = 'italic 700 76px Georgia, serif';
  context.fillText("Our Date Plan", 620, 292);
  context.fillStyle = "#936870";
  context.font = '500 27px Arial, sans-serif';
  context.fillText("A little plan for our favorite kind of day", 620, 345);

  context.beginPath();
  context.moveTo(150, 390);
  context.lineTo(1090, 390);
  context.strokeStyle = "#efd9dc";
  context.lineWidth = 2;
  context.stroke();
  context.textAlign = "left";

  drawDetailCard({
    context,
    x: 128,
    y: 430,
    width: 474,
    height: 190,
    label: "Our day",
    value: data.date,
    accent: "#df7187",
    valueSize: 34,
  });
  drawDetailCard({
    context,
    x: 638,
    y: 430,
    width: 474,
    height: 190,
    label: "Our time",
    value: data.time,
    accent: "#e8a06e",
    valueSize: 38,
  });
  drawDetailCard({
    context,
    x: 128,
    y: 648,
    width: 984,
    height: 180,
    label: "The vibe",
    value: data.activity,
    accent: "#c78bae",
    valueSize: 42,
  });
  drawDetailCard({
    context,
    x: 128,
    y: 856,
    width: 984,
    height: 220,
    label: "On the menu",
    value: data.foods.join("  -  "),
    accent: "#d6a647",
    valueSize: 36,
  });
  drawDetailCard({
    context,
    x: 128,
    y: 1104,
    width: 984,
    height: 350,
    label: "A note from Johra",
    value: data.notes.trim() || "No special requests - just a beautiful date together.",
    accent: "#75a995",
    valueSize: 31,
    italic: true,
  });

  drawHeart(context, 585, 1500, 70, "#d85e77");
  context.textAlign = "center";
  context.fillStyle = "#714b53";
  context.font = '700 26px Arial, sans-serif';
  context.fillText("Made with infinite love by Sami", 620, 1602);
  context.fillStyle = "#ad7d86";
  context.font = '500 20px Arial, sans-serif';
  context.fillText("Sami loves Johra to infinity", 620, 1640);

  const pdfDocument = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  pdfDocument.setProperties({
    title: "Sami and Johra - Our Date Plan",
    subject: "Our romantic date plan",
    author: "Sami",
    creator: "Johra Date Planner",
  });
  pdfDocument.addImage(
    canvas.toDataURL("image/jpeg", 0.94),
    "JPEG",
    0,
    0,
    210,
    297,
    undefined,
    "FAST",
  );

  return {
    blob: pdfDocument.output("blob"),
    fileName: "Sami-and-Johra-Date-Plan.pdf",
  };
}
