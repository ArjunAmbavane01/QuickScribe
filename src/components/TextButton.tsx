import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TextButtonProps {
    setIsTextSelected: (isTextSelected: boolean) => void;
    setTextSize: (size: number) => void;
    setTextColor: (color: string) => void;
    setFontFamily: (fontFamily: string) => void;
    children: React.ReactNode;
}

const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#FFA500',
    '#FFFF00', '#008000', '#0000FF', '#800080'
];

const fontFamilies = [
    'Caveat', 'Arial', 'Helvetica', 'Times New Roman', 'Verdana', 'Georgia', 'Palatino', 'Comic Sans MS', 'Impact'
];

const TextButton: React.FC<TextButtonProps> = ({ setIsTextSelected, setTextSize, setTextColor, setFontFamily, children }) => {
    const [localTextSize, setLocalTextSize] = useState(28);
    const [selectedColor, setSelectedColor] = useState('#FFFFFF');
    const [selectedFontFamily, setSelectedFontFamily] = useState('Caveat');

    const handleTextSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(event.target.value);
        if (!isNaN(size) && size > 0) {
            setLocalTextSize(size);
            setTextSize(size);
        }
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        setTextColor(color);
    };

    const handleFontFamilyChange = (value: string) => {
        setSelectedFontFamily(value);
        setFontFamily(value);
    };

    const handleClick = () => {
        setIsTextSelected(true);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-2" onClick={handleClick}>
                    {children}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <Select onValueChange={handleFontFamilyChange} defaultValue={selectedFontFamily}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                                {fontFamilies.map((font) => (
                                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            value={localTextSize}
                            onChange={handleTextSizeChange}
                            className="w-20"
                            min="1"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-between">
                        {colorPalette.map((color) => (
                            <button
                                key={color}
                                className={`w-6 h-6 rounded-full ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-white ring-black' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                            />
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default TextButton;