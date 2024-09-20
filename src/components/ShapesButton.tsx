import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Circle, Square, RectangleHorizontal, Triangle, Minus } from 'lucide-react';


interface ShapesButtonProps {
    children: React.ReactNode;
    setSelectedShape: (shape: string) => void;
    setShapeOutlineColor: (color: string) => void;
    setShapeFillColor: (color: string) => void;
}

const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#FFA500',
    '#FFFF00', '#008000', '#0000FF', '#800080'
];

const ShapesButton: React.FC<ShapesButtonProps> = ({
    children,
    setSelectedShape,
    setShapeOutlineColor,
    setShapeFillColor
}) => {
    const [outlineColor, setOutlineColor] = useState('#000000');
    const [fillColor, setFillColor] = useState('#FFFFFF');

    const handleShapeSelect = (shape: string) => {
        setSelectedShape(shape);
    };

    const handleOutlineColorSelect = (color: string) => {
        setOutlineColor(color);
        setShapeOutlineColor(color);
    };

    const handleFillColorSelect = (color: string) => {
        setFillColor(color);
        setShapeFillColor(color);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-2">
                    {children}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-85">
                <div className="grid gap-1">
                    <div className="grid gap-1">
                        <div className="flex flex-wrap gap-1 justify-between">
                            <Minus className={`w-7 h-7 p-2px hover:scale-110 hover:bg-stone-100 transition-transform rounded-sm`} onClick={() => handleShapeSelect('Line')} />
                            <Circle className={`w-7 h-7 p-2px hover:scale-110 hover:bg-stone-100 transition-transform rounded-sm`} onClick={() => handleShapeSelect('Circle')} />
                            <Square className={`w-7 h-7 p-2px hover:scale-110 hover:bg-stone-100 transition-transform rounded-sm`} onClick={() => handleShapeSelect('Square')} />
                            <RectangleHorizontal className={`w-7 h-7 p-2px hover:scale-110 hover:bg-stone-100 transition-transform rounded-sm`} onClick={() => handleShapeSelect('Rectangle')} />
                            <Triangle className={`w-7 h-7 p-2px hover:scale-110 hover:bg-stone-100 transition-transform rounded-sm`} onClick={() => handleShapeSelect('Triangle')} />
                        </div>
                        <div>Outline :</div>
                        <div className="flex flex-wrap gap-2 justify-between">
                            {colorPalette.map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full ${outlineColor === color ? 'border-2 border-black' : 'border-2 border-slate-400'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleOutlineColorSelect(color)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>Fill :</div>
                    <div className="flex flex-wrap gap-2 justify-between">
                        {colorPalette.map((color) => (
                            <button
                                key={color}
                                className={`w-6 h-6 rounded-full ${fillColor === color ? 'border-2 border-black' : 'border-2 border-slate-400'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleFillColorSelect(color)}
                            />
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ShapesButton;