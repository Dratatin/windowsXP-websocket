import './tab.css'

type TabProps = {
    title?: string;
    className?: string;
}


const Tab = ({title='title', className='', children}: React.PropsWithChildren<TabProps>) => {
    return (
        <div className={`tab mt-auto flex flex-col ${className}`}>
            <div className='tabhead'>
                <h2 className='tabhead-title'>{title}</h2>
            </div>
            <div className='tabcontent'>
                {children}
            </div>
        </div>
    )
}

export default Tab