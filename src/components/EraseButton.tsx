import React, { useState } from 'react'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider'; 
import { Button } from '@/components/ui/button';

interface EraseButtonProps {
    setEraserSize: (size: number) => void;
    setIsErasing: (isErasing: boolean) => void;
    children: React.ReactNode;
}

const EraseButton: React.FC<EraseButtonProps> = ({ setEraserSize, setIsErasing, children }) => {
    const [eraserSize, setLocalEraserSize] = useState(20); 

    const handleEraserSizeChange = (value: number[]) => { 
        const size = value[0]; 
        setLocalEraserSize(size);   
        setEraserSize(size);
    };

    const handleClick = () => {
        setIsErasing(true);
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
                    <div className="flex items-center gap-2 text-md space-x-2 ml-2">
                            <div>Eraser</div>
                            <Slider
                                id="size"
                                value={[eraserSize]}
                                onValueChange={handleEraserSizeChange}
                                max={50}
                                step={5}
                                min={5}
                                className="flex-grow"
                            />
                        </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default EraseButton;