import { Button } from '@/components/ui/button';
import PenButton from './PenButton'; 
import EraseButton from './EraseButton'; 
import ShapesButton from './ShapesButton'; 
import { Pen, Eraser, Shapes, Type, Loader2 } from 'lucide-react';

interface HeaderProps {
    onRun: () => void;
    setColor: (color: string) => void;
    setStrokeSize: (size: number) => void;
    setEraserSize: (size: number) => void;
    setIsErasing: (isErasing: boolean) => void;
    setSelectedShape: (shape: string) => void;
    setShapeOutlineColor: (color: string) => void;
    setShapeFillColor: (color: string) => void;
    isCalculating: boolean; 
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
}) => {

    return (
        <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-md shadow-xl shadow-indigo-700/40">
            <PenButton setColor={setColor} setStrokeSize={setStrokeSize} setIsErasing={setIsErasing} >
                <Pen className="w-5 h-5" />
            </PenButton>
            <EraseButton setEraserSize={setEraserSize} setIsErasing={setIsErasing} >
                <Eraser className="w-5 h-5" />
            </EraseButton>
            <ShapesButton 
                setSelectedShape={setSelectedShape}
                setShapeOutlineColor={setShapeOutlineColor}
                setShapeFillColor={setShapeFillColor}
            >
                <Shapes className="w-5 h-5" />
            </ShapesButton>
            <Button variant="ghost" size="icon" className="p-1">
                <Type className="w-5 h-5" />
            </Button>
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