import React, {useEffect, useRef, useState} from 'react';
import css from "./Textarea.module.css";

const Textarea = ({autoHeight, disabled, className, children, onChange, placeholder, value}) => {
    const textAreaRef = useRef(null);

    function auto_grow(element) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight)+"px";
    }
    const [cls, setCls] = useState([className, css.Textarea])
    useEffect(()=> {
        if(autoHeight){
            auto_grow(textAreaRef.current)
            setCls([...cls, css.autoHeight])
        }
        textAreaRef.current.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                // set textarea value to: text before caret + tab + text after caret
                onChange(this.value.substring(0, start) + "    " + this.value.substring(end));
                // put caret at right position again
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
    }, []);

    useEffect(()=> {
        if(autoHeight){
            auto_grow(textAreaRef.current)
            setCls([...cls, css.autoHeight])
        }
    }, [value, children]);



    return (
        <div>
            <textarea className={cls.join(" ")} ref={textAreaRef} disabled={!!disabled}
                      onChange={(e)=> onChange(e.target.value) || function (){}}
                      placeholder={placeholder}
                      value={value}
            >
                {children}
            </textarea>
        </div>
    );
};

export default Textarea;