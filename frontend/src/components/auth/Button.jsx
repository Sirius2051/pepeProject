import React, {useState} from "react";

const Button = ({text, color}) => {
 

    
    return (
        <>
            <button className={"btn btn-"+color}>
                {text ? text : "Button"} 

                
            </button>

        </>
    )
}

export default Button