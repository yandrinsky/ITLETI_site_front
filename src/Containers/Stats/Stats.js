import React, {useEffect, useState} from 'react';
import Table from "../../Components/UI/Table/Table";
import {fetchCourseStats, resetCourseStats} from "../../store/actions/courses";
import Loader from "../../Components/UI/Loader/Loader";
import {connect} from "react-redux";
import css from "./Stats.module.css"
import {Link} from "react-router-dom";
const Stats = (props) => {
    let [state, setState] = useState({
        loading: true,
        meetingsHeaders: [],
        meetingsData: [],
        tasksHeaders: [],
        tasksData: [],
        mainHeaders: [],
        mainData: [],
    });
    useEffect(()=> {
        props.fetchCourseStats(props.match.params.id);
        return () => {
            props.resetCourseStats();
        }
    }, [])
    useEffect(()=> {
        if(props.error){
            props.history.push("/error/")
        }

        if(props.stats){
            // setState({...state, loading: false});

            let mainHeaders = ['Рейтинг', 'Кол-во занятий', "Кол-во задач", "Кол-во работ", "Кол-во студентов"]
            let mainData = [[props.stats.totalAvrGrade ? String(props.stats.totalAvrGrade).slice(0, 4) : "Рейтинга нет", props.stats.totalMeetings, props.stats.totalTasks,
                props.stats.totalHomeworks, props.stats.students]]

            let meetingsHeaders = ["Название", "Дата", "Присутсвие", "Средняя оценка", "Подробная оценка"]
            let meetingsData = props.stats.meetings.map(item => {
                return [<Link to={"/meeting/" + item.id}>{item.title}</Link>, item.date.split("T")[0], item.attendance, item.avr ? String(item.avr).slice(0, 4) : "Оценки нет",
                    <>
                        {item.avr ?
                            <>
                                <p className={css.mark}>5: {item.marks["5"]}</p>
                                <p className={css.mark}>4: {item.marks["4"]}</p>
                                <p className={css.mark}>3: {item.marks["3"]}</p>
                                <p className={css.mark}>2: {item.marks["2"]}</p>
                                <p className={css.mark}>1: {item.marks["1"]}</p>
                            </> : <p>Оценки нет</p>
                        }
                    </>
                    ]
            })

            let tasksHeaders = ["Название", "Количество работ", "Принято", "Отправлено на доработку", "Непроверенных", "Сдано с первого раза"]
            let tasksData = props.stats.tasks.map(item => {
                return [item.title, item.total, item.passedCount, item.failedCount, item.uncheckedCount, item.firstTimePassed]
            })

            setState({...state, loading: false, meetingsHeaders, meetingsData, tasksHeaders, tasksData, mainData, mainHeaders})
        }

    }, [props.stats, props.error])
    return (
        <>
            {state.loading ? <Loader type="page"/> :
            <div className={css.Stats}>
                <h1 className={css.mainTitle}>Статистика по курсу {props.stats.title}</h1>
                <h3 className={css.title}>Общая информация</h3>
                <Table headers={state.mainHeaders}
                       data={state.mainData}
                />
                <h3 className={css.title}>Занятия</h3>
                <Table headers={state.meetingsHeaders}
                       data={state.meetingsData}
                />

                <h3 className={css.title}>Задачи</h3>
                <Table headers={state.tasksHeaders}
                       data={state.tasksData}
                />

            </div>
            }
        </>


    );
};
function mapDispatchToProps(dispatch){
    return {
        fetchCourseStats: (id) => {dispatch(fetchCourseStats(id))},
        resetCourseStats: () => {dispatch(resetCourseStats())},
    }
}
function mapStateToProps(state){
    return {
        stats: state.courses.courseStats,
        error: state.error.error,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stats);