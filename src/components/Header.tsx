import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ImageButton from './ImageButton'; 
import PenButton from './PenButton'; 


const Header: React.FC<{ onRun: () => void; setColor: (color: string) => void; setStrokeSize: (size: number) => void }> = ({ onRun, setColor, setStrokeSize }) => {
    return (
        <div className='grid grid-cols-3 gap-2 justify-center'>  
            <div></div>
            <Card className='z-20 flex flex-col items-center p-4 bg-black mt-2 text-white'>
                <div className='flex flex-row justify-around w-full'>  
                    <PenButton src="https://img.icons8.com/?size=100&id=54032&format=png&color=000000" alt="Pen" setColor={setColor} setStrokeSize={setStrokeSize}/> 
                    <ImageButton src="https://img.icons8.com/?size=100&id=22280&format=png&color=000000" alt="Shapes" />
                    <ImageButton src="src/assets/icons8-text-47.png" alt="Text" />
                </div>
            </Card>
            <Button
                onClick={onRun}
                className='mt-2 z-20 bg-black text-white'
                variant='default'
                color='white'
            >
                Run
            </Button>
        </div>
    );
};

export default Header;