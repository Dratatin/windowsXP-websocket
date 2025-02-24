import './button.css'

type ButtonProps = {
    disabled?: boolean,
    content?: string,
    className?: string,
    form?: string,
}


const Button = ({ disabled=false, content="Placeholder", className='', form }: ButtonProps) => {
    return (
        <button type='submit' disabled={disabled} className={`button font-body cursor-pointer disabled:cursor-not-allowed ${className}`} form={form}>{content}</button>
    )
}

export default Button