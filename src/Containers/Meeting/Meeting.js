import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {fetchMeetingAttendance, fetchMeetingInfo, resetMeeting} from "../../store/actions/meeting";
import css from "../Stats/Stats.module.css";
import {setError} from "../../store/actions/error";
import Table from "../../Components/UI/Table/Table";
import Loader from "../../Components/UI/Loader/Loader";
import Comment from "../../Components/Comment/Comment";

const Meeting = (props) => {

    let [state, setState] = useState({
        loading: true,
        infoHeaders: [],
        infoData: [],
        attendanceHeaders: [],
        attendanceData: [],
        initialLoad: true,
    });

    useEffect(()=> {
        return () => {
            props.resetMeeting();
        }
    }, [])

    useEffect(()=> {
        if(props.readyStage){
            props.fetchMeetingInfo(props.match.params.id);
            props.fetchMeetingAttendance(props.match.params.id);
        }
        return () => {
            props.resetMeeting();
        }
    }, [props.readyStage])


    useEffect(()=> {
        if(props.error){
            props.setError();
            props.history.push("/error/")
        }

        if(props.info && props.attendance){
            // setState({...state, loading: false});

            let infoHeaders = ["Название", "Дата", "Присутсвие", "Средняя оценка", "Подробная оценка"]

            let infoData = [[props.info.title, props.info.date.split("T")[0], props.info.attendance, props.info.grade ? String(props.info.grade).slice(0, 4) : "Оценки нет",
                    <>
                        {props.info.grade ?
                            <>
                                <p className={css.mark}>5: {props.info.marks["5"]}</p>
                                <p className={css.mark}>4: {props.info.marks["4"]}</p>
                                <p className={css.mark}>3: {props.info.marks["3"]}</p>
                                <p className={css.mark}>2: {props.info.marks["2"]}</p>
                                <p className={css.mark}>1: {props.info.marks["1"]}</p>
                            </> : <p>Оценки нет</p>
                        }
                    </>
            ]]
            let attendanceHeaders = ["№", "Имя", "Группа"]
            let attendanceData = props.attendance.map((item, index) => {
                return [index + 1, <a href={`https://vk.com/id${item.vk_id}`} target="_blank">{item.name + " " + item.surname}</a>, item.group]
            })
            setState({...state, loading: false, infoHeaders, infoData, attendanceHeaders, attendanceData})
        }


    }, [props.info, props.attendance, props.error])

    return (
        <div style={{padding: "10px 30px"}}>
            {state.loading ? <Loader type="page"/> : null}
            {!state.loading ? <>
                <h1>Статистика по занятию {props.info.title}</h1>
                <h3 className={css.title}>Занятия</h3>
                <Table headers={state.infoHeaders}
                       data={state.infoData}
                />
                <h3 className={css.title}>Комментарии</h3>
                {props.info.comments ? props.info.comments.map(item => {
                    return <Comment content={item.content} disabled role={"STUDENT"}/>
                }) : <p>Комментариев нет</p>}
                <h3 className={css.title}>Присутствие</h3>
                <Table headers={state.attendanceHeaders}
                       data={state.attendanceData}
                />
            </> : null
            }
        </div>
    );
};
function mapDispatchToProps(dispatch){
    return {
        fetchMeetingInfo: (id) => {dispatch(fetchMeetingInfo(id))},
        fetchMeetingAttendance: (id) => {dispatch(fetchMeetingAttendance(id))},
        resetMeeting: () => {dispatch(resetMeeting())},
        setError: () => {dispatch(setError("Ошибка загрузки занятия"))}
    }
}
function mapStateToProps(state){
    return {
        attendance: state.meeting.attendance,
        info: state.meeting.info,
        error: state.meeting.error,
        readyStage: state.auth.readyStage,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
