import React, { useState } from 'react'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider'; 
import { Button } from '@/components/ui/button';

interface PenButtonProps {
    setColor: (color: string) => void;
    setStrokeSize: (size: number) => void;
    setIsErasing: (isErasing: boolean) => void;
    children: React.ReactNode;
}

const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#FFA500', 
    '#FFFF00', '#008000', '#0000FF', '#800080'
];

const PenButton: React.FC<PenButtonProps> = ({ setColor, setStrokeSize, setIsErasing, children }) => {
    const [strokeSize, setLocalStrokeSize] = useState(3);
    const [selectedColor, setSelectedColor] = useState('#000000');

    const handleStrokeSizeChange = (value: number[]) => { 
        const size = value[0]; 
        setLocalStrokeSize(size);
        setStrokeSize(size);
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        setColor(color);
    };

    const handleClick = () => {
        setIsErasing(false);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-2" onClick={handleClick}>
                    {children}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-85">
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <div className="flex flex-wrap gap-3 justify-between">
                            {colorPalette.map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full ${selectedColor === color ? ' border-2 border-black' : ' border-2 border-slate-400'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange(color)}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-md space-x-2 ml-2">
                            <div>Stroke</div>
                            <Slider
                                id="size"
                                value={[strokeSize]}
                                onValueChange={handleStrokeSizeChange}
                                max={20}
                                step={1}
                                className="flex-grow"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default PenButton;