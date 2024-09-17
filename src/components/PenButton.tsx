import React, { useState } from 'react'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider'; 
// import { ColorPicker } from '@/components/ui/color-picker'; // Import the color picker component

const PenButton: React.FC<{ src: string; alt: string; setColor: (color: string) => void; setStrokeSize: (size: number) => void }> = ({ src, alt, setColor, setStrokeSize }) => {
    const [strokeSize, setLocalStrokeSize] = useState(3); 
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        // Logic to open the MenuBar for this image
    };

    // const handleColorChange = (color: string) => {
    //     setColor(color);
    // };

    const handleStrokeSizeChange = (value: number[]) => { // Change parameter to array
        const size = value[0]; // Get the first element
        setLocalStrokeSize(size);
        setStrokeSize(size);
        // setShowTooltip(true); // Show tooltip when changing size

        // // Hide tooltip after 2 seconds
        // setTimeout(() => {
        //     setShowTooltip(false);
        // }, 1200);
    };

    return (
        <div onClick={handleClick} className='flex flex-col items-center cursor-pointer'>
            <Popover>
                <PopoverTrigger>
                    <img src={src} alt={alt} height={50} width={50} />
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col p-4 text-black rounded-lg shadow-lg">
                        {/* <ColorPicker onChange={handleColorChange} /> Color Picker */}
                        <span className="mb-2">Stroke Size : {strokeSize}</span> 
                        <Slider
                            value={[strokeSize]}
                            onValueChange={handleStrokeSizeChange}
                            onKeyDown={()=> setShowTooltip(true)}
                            onKeyUp={()=> setShowTooltip(false)}
                            min={1}
                            max={20}
                            step={2}
                        />
                        {showTooltip && ( // Conditional rendering for tooltip
                            <span className="mt-2 text-center text-xs">{strokeSize}</span>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default PenButton;
