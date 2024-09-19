import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

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
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <div className="flex flex-wrap gap-3 justify-between">
                            {['Circle', 'Square', 'Rectangle', 'Triangle'].map((shape) => (
                                <Button 
                                    key={shape} 
                                    onClick={() => handleShapeSelect(shape)}
                                    variant="outline"
                                >
                                    {shape}
                                </Button>
                            ))}
                        </div>
                        <div>Outline Color:</div>
                        <div className="flex flex-wrap gap-3 justify-between">
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
                    <div>Fill Color:</div>
                    <div className="flex flex-wrap gap-3 justify-between">
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