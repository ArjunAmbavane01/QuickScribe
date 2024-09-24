import React from 'react';
import { Button } from '@/components/ui/button';
import { Pen, Eraser, Shapes, Type, Loader2 } from 'lucide-react';
import PenButton from './PenButton';
import EraserButton from './EraseButton';
import ShapesButton from './ShapesButton';
import TextButton from './TextButton';

interface HeaderProps {
    onRun: () => void;
    setColor: (color: string) => void;
    setStrokeSize: (size: number) => void;
    setEraserSize: (size: number) => void;
    setIsErasing: (isErasing: boolean) => void;
    setSelectedShape: (shape: string | null) => void;
    setShapeOutlineColor: (color: string) => void;
    setShapeFillColor: (color: string) => void;
    isCalculating: boolean;
    setIsTextSelected: (isTextSelected: boolean) => void;
    setTextSize: (size: number) => void;
    setTextColor: (color: string) => void;
    setFontFamily: (fontFamily: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    onRun,
    setColor,
    setStrokeSize,
    setEraserSize,
    setIsErasing,
    setSelectedShape,
    setShapeOutlineColor,
    setShapeFillColor,
    isCalculating,
    setIsTextSelected,
    setTextSize,
    setTextColor,
    setFontFamily
}) => {
    return (
        <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-md shadow-xl shadow-indigo-700/40">
            <PenButton setColor={setColor} setStrokeSize={setStrokeSize} setIsErasing={setIsErasing}>
                <Pen className="h-5 w-5" />
            </PenButton>
            <EraserButton setEraserSize={setEraserSize} setIsErasing={setIsErasing}>
                <Eraser className="h-5 w-5" />
            </EraserButton>
            <ShapesButton
                setSelectedShape={setSelectedShape}
                setShapeOutlineColor={setShapeOutlineColor}
                setShapeFillColor={setShapeFillColor}
            >
                <Shapes className="h-5 w-5" />
            </ShapesButton>
            <TextButton
                setIsTextSelected={setIsTextSelected}
                setTextSize={setTextSize}
                setTextColor={setTextColor}
                setFontFamily={setFontFamily}
            >
                <Type className="h-5 w-5" />
            </TextButton>
            <Button
                onClick={onRun}
                className="bg-indigo-800 hover:bg-indigo-500 text-white font-bold rounded-sm px-4 py-1 "
            >
                {isCalculating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    'Run'
                )}
            </Button>
        </div>
    );
};

export default Header;