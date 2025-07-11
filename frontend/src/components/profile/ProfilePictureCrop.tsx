import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Save, X, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ProfilePictureCropProps {
  open: boolean;
  onClose: () => void;
  onCrop: (croppedImageUrl: string) => void;
  imageUrl: string;
}

export const ProfilePictureCrop = ({
  open,
  onClose,
  onCrop,
  imageUrl,
}: ProfilePictureCropProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState([1]);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    // Apply transformations
    ctx.translate(size / 2 + position.x, size / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale[0], scale[0]);

    // Draw image centered
    const imageSize = Math.max(image.naturalWidth, image.naturalHeight);
    const drawSize = (size * scale[0]) / 2;
    ctx.drawImage(image, -drawSize, -drawSize, drawSize * 2, drawSize * 2);

    ctx.restore();

    // Draw crop circle overlay
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }, [scale, rotation, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create final crop canvas
    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");
    if (!finalCtx) return;

    const size = 200;
    finalCanvas.width = size;
    finalCanvas.height = size;

    // Draw the cropped image
    finalCtx.drawImage(canvas, 0, 0, size, size);

    const croppedImageUrl = finalCanvas.toDataURL("image/jpeg", 0.9);
    onCrop(croppedImageUrl);
  };

  const resetTransform = () => {
    setScale([1]);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative mx-auto w-[300px] h-[300px] border-2 border-dashed border-gray-300 rounded-full overflow-hidden bg-gray-50">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Profile"
              className="hidden"
              onLoad={drawCanvas}
            />
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Zoom</label>
              <div className="flex items-center gap-2 mt-1">
                <ZoomOut className="h-4 w-4" />
                <Slider
                  value={scale}
                  onValueChange={(value) => {
                    setScale(value);
                    setTimeout(drawCanvas, 0);
                  }}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRotation((prev) => prev - 90);
                  setTimeout(drawCanvas, 0);
                }}
              >
                <RotateCw className="h-4 w-4 mr-1 scale-x-[-1]" />
                Rotate Left
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRotation((prev) => prev + 90);
                  setTimeout(drawCanvas, 0);
                }}
              >
                <RotateCw className="h-4 w-4 mr-1" />
                Rotate Right
              </Button>
              <Button variant="outline" size="sm" onClick={resetTransform}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
