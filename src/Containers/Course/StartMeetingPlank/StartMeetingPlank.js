import React, {useState} from 'react';
import Button from "../../../Components/UI/Button/Button";
import Loader from "../../../Components/UI/Loader/Loader";
import css from "./StartMeetingPlank.module.css";
import Popup from "../../../Components/UI/Popup/Popup";

const StartMeetingPlank = ({onStart, onRefuse}) => {
    const [state, setState] = useState({
        meetingTitle: "",
        meetingContent: "",
        clicked: false,
        popup: false,
        CQ: false,
        CQ_title: "",
        CQ_answer: "",
        link: false,
    })

    function onClick(){
        setState({...state, clicked: true});
        onStart({
            title: state.meetingTitle,
            content : state.meetingContent,
            CQ: state.CQ,
            CQ_title: state.CQ_title,
            CQ_answer: state.CQ_answer,
            link: state.link,
        });
        setState({...state, popup: false});
    }

    function togglePopup(){
        setState({...state, popup: !state.popup})
    }
    function handleMeetingTitle(e){
        setState({
            ...state,
            meetingTitle: e.target.value,
        })
    }

    function handleMeetingContent(e){
        setState({
            ...state,
            meetingContent: e.target.value,
        })
    }



    return (
        <form className={css.editMeeting} onSubmit={(e) => e.preventDefault()}>
            <Popup actionTitle="Принять" open={state.popup} onDeny={togglePopup} onAccept={onClick} >
                <h1>Начало занятия</h1>
                <p>Это действие приведёт к отправке уведомлений всем участинкам курса</p>
                <p>Отменить занятие нельзя - только закончить.<em> Случайно начатое занятие повлияет на статистику курса</em></p>
            </Popup>

            <input type="text"
                   placeholder="Название занятие"
                   value={state.meetingTitle}
                   onChange={handleMeetingTitle.bind(this)}
            />
            <textarea cols="30" rows="10"
                      defaultValue={state.meetingContent}
                      placeholder="Описание занятия"
                      onChange={handleMeetingContent.bind(this)}
            />
            <label htmlFor="CQ">
                <input type="checkbox" id="CQ" defaultChecked={state.CQ} onClick={(e)=> setState({...state, CQ: !state.CQ})}/>
                Контрольный вопрос
            </label>

            {state.CQ ? <>
                <h4 style={{marginBottom: 0, marginTop: 7}}>Контрольный вопрос: </h4>
                <input type="text" value={state.CQ_title} onInput={(e) => setState({...state, CQ_title: e.target.value})}/>
                <h4 style={{marginBottom: 0, marginTop: 7}}>Ответ: </h4>
                <input type="text" style={{marginBottom: 10}} value={state.CQ_answer} onInput={(e) => setState({...state, CQ_answer: e.target.value})}/>

            </> : null}


            {/*<label htmlFor="link">*/}
            {/*    <input type="checkbox" id="link" defaultChecked={state.link} onClick={(e) => setState({...state, link: !state.link})}/>*/}
            {/*    Отмечаться по ссылке*/}
            {/*</label>*/}


            {!state.clicked ?
                <>
                    <Button type="primary" marginReset
                            disabled={!state.meetingTitle || !state.meetingContent || (state.CQ && (!state.CQ_title || !state.CQ_answer))}
                            onClick={togglePopup}
                    >
                        Сохранить
                    </Button>
                    <Button type="fail" onClick={onRefuse} marginReset>
                        Отменить
                    </Button>
                </>
                : <Loader/>
            }
        </form>
    );
};

export default StartMeetingPlank;