const Input = ({config}) => {
    
    return (
        <>
            <label htmlFor={config.id} className="form-label">
                {config.placeholder}
            </label>
            <input 
                type={config.type}
                className={(config.type == "password" ? "bg-dark " : "") + "form-control "+config.className }
                id={config.id}
                placeholder={config.placeholder}
                onChange={config.change}
            />
            
        </>
    )
}

export default Input