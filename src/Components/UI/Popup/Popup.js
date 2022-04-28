import React, {useEffect, useRef, useState} from 'react';
import css from './Popup.module.css'
import Button from "../Button/Button";
import CancelIcon from '@material-ui/icons/Cancel';
import Loader from "../Loader/Loader";

const Popup = ({onAccept, onDeny, actionTitle, type, open, children}) => {
    //type - primary, warning
    const [cls, setCls] = useState([css.Popup])

    let darkRef = useRef();
    let popupRef = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        if(type) {
            setCls([...cls, css[type]])
        }
    }, [])

    useEffect(()=> {
        setLoading(false);
        if(darkRef.current){
            popupRef.current.style.top = (window.pageYOffset + window.innerHeight / 2 - popupRef.current.offsetHeight / 2) + "px"
            darkRef.current.style.height = window.pageYOffset + window.innerHeight + "px";
        }
    }, [open])

    function onAcceptHandle(){
        setLoading(true);
        onAccept();
    }

    return (
        <>

            <div className={css.Popup_wrapper}>
                {open ? <>
                    <style>{`body {
                        overflow: hidden;
                    }`}</style>
                    <div className={css.dark} ref={darkRef}/>
                    <div className={cls.join(" ")} ref={popupRef}>
                        <CancelIcon onClick={onDeny} className={css.Popup_close}/>
                        {children}
                        {
                            loading ? <Loader/> :
                                <Button type={type === "warning" ? "fail" : "primary"} onClick={onAcceptHandle}>{actionTitle || "OK"}</Button>
                        }
                    </div>
                </> : null}
            </div>
        </>

    );
};

export default Popup;