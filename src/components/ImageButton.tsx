import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ImageButton: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {

    const handleClick = () => {

        // Logic to open the MenuBar for this image

        // You can customize this to pass specific props to the MenuBar

    };


    return (

        <div onClick={handleClick} className='flex flex-col items-center cursor-pointer'>

<Popover>
    <PopoverTrigger><img src={src} alt={alt} height={35} width={35} /></PopoverTrigger>
    <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
        </div>
    );
};

export default ImageButton;
