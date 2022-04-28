import React, {useState} from 'react';
import Plank from "../Plank/Plank";
import {withRouter} from "react-router-dom";
import css from "./LessonPlank.module.css"
import Loader from "../../../Components/UI/Loader/Loader";
import Comment from "../../../Components/Comment/Comment";

const LessonPlank = ({title, _id, editable, meeting, onClick, open, date}) => {
    //const [open, setOpen] = useState(false);
    const onEdit = () => {}
    const cls = [css.Lesson];
    if(!open){
        cls.push(css.TextCenter)
    }

    function renderLesson(){
        if(open){
            if(meeting){
                let ratingClass;
                if(meeting.grade > 4) {
                    ratingClass = css.green;
                } else if(meeting.grade >= 3) {
                    ratingClass = css.orange;
                } else {
                    ratingClass = css.red;
                }

                return (
                    <div className={css.lessonContainer}>
                        <p className={[css.title, css.text_center].join(" ")}>{title}</p>
                        <p>Рейтинг: <span className={ratingClass}>{meeting.grade}</span></p>
                        <p>Присутствие: {meeting.attendance}</p>
                        <hr/>
                        <p>{meeting.content}</p>
                        <div>
                            {meeting.comments?.map(item => {
                                return <Comment role="STUDENT" disabled={true} content={item.content}/>
                            })}
                        </div>
                    </div>

                )
            } else {
                return <Loader />
            }
        }

    }



    return <Plank title={!open ? title: ""}
                  onClick={onClick}
                  editable={editable} onEdit={onEdit}
                  className={cls.join(" ")}
                  date={date}
    >
        {renderLesson()}
    </Plank>
};

export default withRouter(LessonPlank);