import { useEffect, useRef, useState } from 'react';
import './tab.css'

type TabProps = {
    title?: string;
    className?: string;
}

const Tab = ({title='title', className='', children}: React.PropsWithChildren<TabProps>) => {
    const tabRef = useRef(null);
    const tabHeadRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [elemPos, setElemPos] = useState<Pick<React.CSSProperties, "top" | "left" | "position">>({
        top: 0,
        left: 0,
        position: 'static'
    });

    const dragElement = (dragBlock: HTMLElement, dragContainer: HTMLElement) => {
        let deltaX = 0, deltaY = 0, prevMouseX = 0, prevMouseY = 0;
    
        const dragMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
    
            document.addEventListener("mouseup", closeDragElement);
            document.addEventListener("mousemove", elementDrag);
    
            setDragging(true);
        };
    
        const elementDrag = (e: MouseEvent) => {
            e.preventDefault();
    
            deltaX = prevMouseX - e.clientX;
            deltaY = prevMouseY - e.clientY;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
    
            let posTop = dragContainer.offsetTop - deltaY;
            let posLeft = dragContainer.offsetLeft - deltaX;
    
            if (posTop > (window.innerHeight - dragContainer.offsetHeight)) {
                posTop = (window.innerHeight - dragContainer.offsetHeight);
            }
    
            if (posLeft > (window.innerWidth - dragContainer.offsetWidth)) {
                posLeft = (window.innerWidth - dragContainer.offsetWidth);
            }
    
            setElemPos({
                top: posTop > 0 ? posTop : 0,
                left: posLeft > 0 ? posLeft : 0,
                position: 'fixed'
            });
        };
    
        const closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
    
            setDragging(false);
        };
    
        dragBlock.addEventListener("mousedown", dragMouseDown);
    };
    


    useEffect(() => {
        if (tabRef.current && tabHeadRef.current) {
            dragElement(tabHeadRef.current, tabRef.current);
        }
    }, [tabRef])
    
    return (
        <div className={`tab flex flex-col ${className}`} ref={tabRef} style={{
            top: elemPos.top,
            left: elemPos.left,
            position: elemPos.position,
        }}>
            <div className={`tabhead ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`} ref={tabHeadRef}>
                <h2 className='tabhead-title'>{title}</h2>
            </div>
            <div className='tabcontent'>
                {children}
            </div>
        </div>
    )
}

export default Tab