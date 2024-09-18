import { Button } from '@/components/ui/button';
import PenButton from './PenButton'; 
import EraseButton from './EraseButton'; 
import { Pen, Eraser, Shapes, Type } from 'lucide-react';

interface HeaderProps {
    onRun: () => void;
    setColor: (color: string) => void;
    setStrokeSize: (size: number) => void;
    setEraserSize: (size: number) => void;
    setIsErasing: (isErasing: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onRun, setColor, setStrokeSize, setEraserSize, setIsErasing}) => {

    return (
        <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-md shadow-lg shadow-indigo-700/40">
            <PenButton setColor={setColor} setStrokeSize={setStrokeSize} setIsErasing={setIsErasing} >
                <Pen className="w-5 h-5" />
            </PenButton>
            <EraseButton setEraserSize={setEraserSize} setIsErasing={setIsErasing} >
                <Eraser className="w-5 h-5" />
            </EraseButton>
            <Button variant="ghost" size="icon" className="p-1">
                <Shapes className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1">
                <Type className="w-5 h-5" />
            </Button>
            <Button
                onClick={onRun}
                className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-sm px-4 py-1"
            >
                Run
            </Button>
        </div>
    );
};

export default Header;