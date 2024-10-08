import Header from '@/components/Header';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { Undo, Redo, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
}

export default function Home() {
    const nodeRef = useRef(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [eraserSize, setEraserSize] = useState(20);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [color, setColor] = useState('#FFFFFF');
    const [strokeSize, setStrokeSize] = useState(3);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [shapeOutlineColor, setShapeOutlineColor] = useState('#000000');
    const [shapeFillColor, setShapeFillColor] = useState('#FFFFFF');
    const [isDrawingShape, setIsDrawingShape] = useState(false);
    const [shapeStartPoint, setShapeStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [canvasStates, setCanvasStates] = useState<ImageData[]>([]);
    const [currentStateIndex, setCurrentStateIndex] = useState(-1);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [textSize, setTextSize] = useState(28);
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [fontFamily, setFontFamily] = useState('Caveat');
    const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
    const textInputRef = useRef<HTMLTextAreaElement>(null);
    const [textElements, setTextElements] = useState<TextElement[]>([]);
    // const [activeTextId, setActiveTextId] = useState<string | null>(null);


    const { toast } = useToast();

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.style.background = 'black';
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = strokeSize;

                // Save initial blank canvas state
                const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
                setCanvasStates([initialState]);
                setCurrentStateIndex(0);
            }
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        //to load the Caveat font
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);


    const renderLatexToCanvas = (expression: string, answer: any) => {
        const latex = typeof answer === 'string'
            ? answer.split(' ').join('\\ ')
            : `\\(${expression.replace(/ /g, '\\,')} = ${String(answer).replace(/ /g, '\\,')}\\)`;

        setLatexExpression([...latexExpression, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                saveCanvasState();
            }
        }
    };


    const saveCanvasState = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const newStates = canvasStates.slice(0, currentStateIndex + 1);
                newStates.push(currentState);

                // Keep only the last 5 states
                if (newStates.length > 6) {
                    newStates.shift();
                }

                setCanvasStates(newStates);
                setCurrentStateIndex(newStates.length - 1);
            }
        }
    };

    const undo = () => {
        if (currentStateIndex > 0) {
            setCurrentStateIndex(currentStateIndex - 1);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.putImageData(canvasStates[currentStateIndex - 1], 0, 0);
                }
            }
        }
    };

    const redo = () => {
        if (currentStateIndex < canvasStates.length - 1) {
            setCurrentStateIndex(currentStateIndex + 1);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.putImageData(canvasStates[currentStateIndex + 1], 0, 0);
                }
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (isTextSelected) {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setTextInputPosition({ x, y });
                    if (textInputRef.current) {
                        textInputRef.current.style.left = `${x}px`;
                        textInputRef.current.style.top = `${y}px`;
                        textInputRef.current.style.display = 'block';
                        setTimeout(() => {
                            if (textInputRef.current) {
                                textInputRef.current.focus();
                            }
                        }, 0);
                    }
                } else if (selectedShape) {
                    setIsDrawingShape(true);
                    setShapeStartPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
                } else {
                    ctx.beginPath();
                    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    setIsDrawing(true);
                }
            }
        }
    };

    const erase = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(e.nativeEvent.offsetX, e.nativeEvent.offsetY, eraserSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };


    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (isDrawingShape && shapeStartPoint) {
                    ctx.putImageData(canvasStates[currentStateIndex], 0, 0);
                    drawShapePreview(ctx, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                } else if (isDrawing) {
                    if (isErasing) {
                        erase(e);
                    } else {
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.strokeStyle = color;
                        ctx.lineWidth = strokeSize;
                        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        ctx.stroke();
                    }
                }
            }
        }
    };


    const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawingShape && shapeStartPoint) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    drawShape(ctx, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    setSelectedShape(null);
                    saveCanvasState();
                }
            }
        } else if (isDrawing) {
            saveCanvasState();
        }
        setIsDrawing(false);
        setIsDrawingShape(false);
        setShapeStartPoint(null);
    };

    const drawShapePreview = (ctx: CanvasRenderingContext2D, endX: number, endY: number) => {
        if (!shapeStartPoint) return;

        ctx.save();
        ctx.strokeStyle = shapeOutlineColor;
        ctx.fillStyle = shapeFillColor;
        ctx.lineWidth = strokeSize;

        const width = endX - shapeStartPoint.x;
        const height = endY - shapeStartPoint.y;

        switch (selectedShape) {
            case 'Circle':
                const radius = Math.sqrt(width * width + height * height);
                ctx.beginPath();
                ctx.arc(shapeStartPoint.x, shapeStartPoint.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            case 'Square':
                const size = Math.max(Math.abs(width), Math.abs(height));
                ctx.fillRect(shapeStartPoint.x, shapeStartPoint.y, size, size);
                ctx.strokeRect(shapeStartPoint.x, shapeStartPoint.y, size, size);
                break;
            case 'Rectangle':
                ctx.fillRect(shapeStartPoint.x, shapeStartPoint.y, width, height);
                ctx.strokeRect(shapeStartPoint.x, shapeStartPoint.y, width, height);
                break;
            case 'Triangle':
                ctx.beginPath();
                ctx.moveTo(shapeStartPoint.x, shapeStartPoint.y);
                ctx.lineTo(shapeStartPoint.x + width, shapeStartPoint.y + height);
                ctx.lineTo(shapeStartPoint.x - width, shapeStartPoint.y + height);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'Line':
                ctx.beginPath();
                ctx.moveTo(shapeStartPoint.x, shapeStartPoint.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                break;
        }

        ctx.restore();
    };

    const drawShape = (ctx: CanvasRenderingContext2D, endX: number, endY: number) => {
        if (!shapeStartPoint) return;

        ctx.save();
        ctx.strokeStyle = shapeOutlineColor;
        ctx.fillStyle = shapeFillColor;
        ctx.lineWidth = strokeSize;

        const width = endX - shapeStartPoint.x;
        const height = endY - shapeStartPoint.y;

        switch (selectedShape) {
            case 'Circle':
                const radius = Math.sqrt(width * width + height * height);
                ctx.beginPath();
                ctx.arc(shapeStartPoint.x, shapeStartPoint.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            case 'Square':
                const size = Math.max(Math.abs(width), Math.abs(height));
                ctx.fillRect(shapeStartPoint.x, shapeStartPoint.y, size, size);
                ctx.strokeRect(shapeStartPoint.x, shapeStartPoint.y, size, size);
                break;
            case 'Rectangle':
                ctx.fillRect(shapeStartPoint.x, shapeStartPoint.y, width, height);
                ctx.strokeRect(shapeStartPoint.x, shapeStartPoint.y, width, height);
                break;
            case 'Triangle':
                ctx.beginPath();
                ctx.moveTo(shapeStartPoint.x, shapeStartPoint.y);
                ctx.lineTo(shapeStartPoint.x + width, shapeStartPoint.y + height);
                ctx.lineTo(shapeStartPoint.x - width, shapeStartPoint.y + height);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'Line':
                ctx.beginPath();
                ctx.moveTo(shapeStartPoint.x, shapeStartPoint.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                break;
        }

        ctx.restore();
    };

    const handleTextInputBlur = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && textInputRef.current) {
                const text = textInputRef.current.value;
                const id = Date.now().toString();
                setTextElements(prev => [...prev, {
                    id,
                    text,
                    x: textInputPosition.x,
                    y: textInputPosition.y,
                    fontSize: textSize,
                    fontFamily,
                    color: textColor
                }]);
                textInputRef.current.style.display = 'none';
                textInputRef.current.value = '';
                setIsTextSelected(false);
            }
        }
    };

    const handleTextDragStop = (id: string, e: any, data: any) => {
        setTextElements(prev => prev.map(el =>
            el.id === id ? { ...el, x: data.x, y: data.y } : el
        ));
    };

    const renderTextElements = () => {
        return textElements.map(el => (
            <Draggable
                key={el.id}
                position={{ x: el.x, y: el.y }}
                onStop={(e, data) => handleTextDragStop(el.id, e, data)}
                nodeRef={nodeRef}
            >
                <div
                    style={{
                        position: 'absolute',
                        fontSize: `${el.fontSize}px`,
                        fontFamily: el.fontFamily,
                        color: el.color,
                        cursor: 'grab',
                        userSelect: 'none'
                    }}
                    ref={nodeRef}
                >
                    {el.text}
                </div>
            </Draggable>
        ));
    };


    const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextInputBlur();
        }
    };

    const runRoute = async () => {
        setIsCalculating(true);
        const canvas = canvasRef.current;

        if (canvas) {
            try {
                const response = await axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_API_URL}/calculate`,
                    data: {
                        image: canvas.toDataURL('image/png'),
                        dict_of_vars: dictOfVars
                    }
                });

                const resp = await response.data;
                console.log('Response', resp);
                resp.data.forEach((data: Response) => {
                    if (data.assign === true) {
                        setDictOfVars(prevDict => ({
                            ...prevDict,
                            [data.expr]: data.result
                        }));
                    }
                });
                const ctx = canvas.getContext('2d');
                const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
                let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (imageData.data[i + 3] > 0) {
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                        }
                    }
                }

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                setLatexPosition({ x: centerX, y: centerY });
                resp.data.forEach((data: Response) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: data.result
                        });
                    }, 1000);
                });
            } catch (error) {
                console.error('Error during calculation:', error);
                setError('An error occurred during calculation');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An error occurred during calculation",
                    duration: 4000,
                });
                setTimeout(() => setError(null), 4000)
            } finally {
                setIsCalculating(false);
            }
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                style={{ backgroundColor: 'black' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            {renderTextElements()}
            <textarea
                ref={textInputRef}
                className="absolute hidden p-0 border-none outline-none bg-transparent text-white resize-none overflow-hidden"
                style={{
                    fontSize: `${textSize}px`,
                    fontFamily: fontFamily,
                    color: textColor,
                    minWidth: '50px',
                    minHeight: `${textSize}px`,
                }}
                onBlur={handleTextInputBlur}
                onKeyDown={handleTextInputKeyDown}
            />
            <div className="absolute top-4 left-0 w-full flex justify-center pointer-events-none">
                <div className="pointer-events-auto">
                    <Header
                        onRun={runRoute}
                        setColor={setColor}
                        setStrokeSize={setStrokeSize}
                        setEraserSize={setEraserSize}
                        setIsErasing={setIsErasing}
                        setSelectedShape={setSelectedShape}
                        setShapeOutlineColor={setShapeOutlineColor}
                        setShapeFillColor={setShapeFillColor}
                        isCalculating={isCalculating}
                        setIsTextSelected={setIsTextSelected}
                        setTextSize={setTextSize}
                        setTextColor={setTextColor}
                        setFontFamily={setFontFamily}
                    />
                </div>
            </div>
            <div className="absolute bottom-4 left-4 flex space-x-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={undo}
                                className="flex items-center justify-center bg-gray-300 hover:bg-zinc-50 text-black font-bold py-2 px-2 rounded"
                                disabled={currentStateIndex <= 0}
                            >
                                <Undo />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Undo</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={redo}
                                className="flex items-center justify-center bg-gray-300 hover:bg-zinc-50 text-black font-bold py-2 px-2 rounded"
                                disabled={currentStateIndex >= canvasStates.length - 1}
                            >
                                <Redo />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Redo</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
                    nodeRef={nodeRef}
                >
                    <div className="absolute bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-3 shadow-lg" ref={nodeRef}>
                        <div className="text-white latex-content">{latex}</div>
                    </div>
                </Draggable>
            ))}
            {error && (
                <div className="absolute bottom-4 right-4 bg-zinc-50 text-md rounded-lg shadow-lg">
                    <Alert variant="destructive">
                        <AlertCircle className="h-5 w-5" />
                        <AlertDescription className='text-lg'>
                            {error}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

        </div>
    );
}