import React, {Component, useEffect, useState} from "react"
import css from "./Course.module.css"
import {server} from "../../axios/server";
import {connect} from "react-redux";
import {
    fetchCourseById, fetchCourseMeeting, fetchCourseMeetings,
    fetchCourseTasksById, gradeMeeting, resetAuthError,
    resetCourse,
    resetCoursesError,
    setMeeting, shouldGradeMeeting, signupForMeeting, stopMeeting
} from "../../store/actions/courses";
import Loader from "../../Components/UI/Loader/Loader";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomeworkPlank from "./homeworkPlank/HomeworkPlank";
import {resetError, setError} from "../../store/actions/error";
import Button from "../../Components/UI/Button/Button";
import {setHomeworkCourseId, setHomeworkUserStatus} from "../../store/actions/homework";
import MeetingPlank from "./meetingPlank/MeetingPlank";
import Grade from "../../Components/Grade/Grade";
import CourseBackground from "./CourseBackground/CourseBackground";
import markCss from "../../markdown/Markdown.module.css";
import {markdown} from "markdown";
import prepTeachersNames from "./auxiliary/prepTeachersNames";
import LessonPlank from "./lessonPlank/LessonPlank";
import Plank from "./Plank/Plank";
import StartMeetingPlank from "./StartMeetingPlank/StartMeetingPlank";
import Popup from "../../Components/UI/Popup/Popup";
import {setAuthRedirectTo} from "../../store/actions/auth";
import {resetMeeting} from "../../store/actions/meeting";


function Course(props){
    const [state, setState] = useState({
        value: 0,
        editMeeting: false,
        meetingTitle: "",
        meetingContent: "",
        initialLoad: true,
        getGrade: false,
        sendGrade: false,
        openedLesson: "",
    });

    async function initialLoad(){
        props.resetError(); //Убираем ошибки при загрузке курса. Мы её получим, если она будет в CWRP
        props.fetchCourseById(props.match.params.id); //Запрашиваем курс;
        setState({
            ...state,
            initialLoad: false,
        })
    }

    useEffect(()=> {
        if(props.readyStage){
            initialLoad();
        }
        return ()=> {
            props.resetCourse();
            props.resetMeeting();
        }
    }, [])

    useEffect(()=> {

        if(props.authError){
            props.setAuthRedirectTo("/courses/" + props.match.params.id);
            props.resetAuthError();
            props.history.push("/signin");
        }

        if(props.error){
            props.setError(props.error);
            props.history.push("/error/")
        }
        if(props.readyStage && state.initialLoad){
            initialLoad();
        }

        if(!props.grade && props.id && !state.getGrade){
            props.shouldGradeMeeting(props.id);
            setState({
                ...state,
                getGrade: true,
            })
        }

    }, [props.error, props.readyStage, state.initialLoad, props.grade, props.id, state.getGrade, props.authError])


    const handleChange = (event, newValue) => {
        setState({value: newValue});
    };

    function handleEditMeeting(){
        setState({
            ...state,
            editMeeting: !state.editMeeting,
        })
    }

    function handleStartMeeting({title, content, CQ, CQ_title, CQ_answer, link}){
        setState({
            ...state,
            editMeeting: false,
            // meetingTitle: "",
            // meetingContent: "",
        })
        props.setMeeting(props.id, title, content, CQ, CQ_title, CQ_answer, link)
    }


    function taskRender(){
        if(props.tasks === null){
            props.fetchTasks(props.match.params.id);
            return <Loader type="page"/>
        } else if(props.tasks.length === 0) {
            return <p>Пусто</p>
        } else {
            let closedHMW = [];
            let activeHMW = [];
            let tasks = [];
            props.tasks.forEach(item => {
                if(item.status === "OPEN" && item.type !== "TASK"){
                    activeHMW.push(item)
                } else if(item.status === "CLOSE" && item.type !== "TASK"){
                    closedHMW.push(item)
                } else if(item.type === "TASK"){
                    tasks.push(item);
                }

            })
            return [...activeHMW, ...tasks, ...closedHMW].map((task, index) => {
                return <HomeworkPlank key={index}
                                      title={task.title}
                                      description={task.content}
                                      status={task.status}
                                      id={task._id}
                                      editable={props.role === "TEACHER"}
                                      type={task.type}
                                      onEdit={()=> {
                                          props.history.push("/setTask/" + props.id + "_" + task._id)
                                      }}
                />
            })
        }
    }
    function aboutRender(){
        if(!props.about){
            return <>Пусто</>
        } else{
            return <div className={`${css.aboutCourse} ${markCss["markdown-body"]}`} dangerouslySetInnerHTML={{__html: markdown.toHTML(props.about)}}/>;
        }
    }
    function meetingsRender(){
        if(props.meetings === null){
            props.fetchCourseMeetings(props.match.params.id);
            return <Loader type="page"/>
        } else {
            if(props.meetings.length === 0){
                return <p>Пусто</p>
            } else {
                return props.meetings.map((meeting, index) => {
                    return <LessonPlank key={meeting.id}
                                        title={meeting.title}
                        //editable={props.role === "TEACHER"}
                                        id={meeting.id}
                                        meeting={props.selectedMeeting}
                                        open={state.openedLesson === meeting.id}
                                        date={meeting.date}
                                        onClick={()=> {
                                            if(state.openedLesson === meeting.id){
                                                setState({
                                                    ...state,
                                                    openedLesson: "",
                                                })
                                            } else {
                                                setState({
                                                    ...state,
                                                    openedLesson: meeting.id,
                                                })
                                                props.fetchCourseMeeting(meeting.id, props.match.params.id)}
                                        }
                                        }
                    />
                })
            }

        }
    }
    function forTeacherRender(){
        return <>
            {/*<h4 className={css.teacherInfo}>Студентов на курсе: {props.studentsCount}</h4>*/}
            <h4 className={css.teacherInfo}>Непроверенных работ: {props.needToCheck}</h4>
            <Button type="primary" onClick={() => {
                props.setHomeworkCourseId(props.id);
                props.history.push("/homework");
            }}  key={Math.random()}

            >Проверить ДЗ</Button>
            <div style={{marginBottom: 20}}/>

            <Button type="primary" key={Math.random()}
                    onClick={()=> props.history.push("/setTask/" + props.id + "_new")}
            >Задать ДЗ</Button>
            <div style={{marginBottom: 20}}/>
            <Button type="primary" key={Math.random()}
                    onClick={()=> props.history.push("/stats/" + props.id)}
            >Статистика</Button>

        </>
    }




    function render(){
        function a11yProps(index) {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        }

        function TabPanel({ children, value, index, ...other }) {
            let content;
            if(value === index){
                if(value === 0){
                    content = aboutRender();
                } else if(value === 1){
                    content = taskRender();
                } else if(value === 2){
                    content = meetingsRender();
                } else if(value === 3) {
                    if(props.role === "TEACHER"){
                        content = forTeacherRender();
                    }
                }

            }

            return (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
                >
                    {value === index && (
                        <Box sx={{ p: 3 }}>
                            <Typography>{content}</Typography>
                        </Box>
                    )}
                </div>
            );
        }

        function meetingRender(){
            let content;
            const isMeeting = props.meeting && props.meeting.active;
            if(isMeeting && props.role === "TEACHER"){
                const meeting = props.meeting;
                content = (
                    <div className={css.teacherPannel}>
                        {props.loading ?
                            <Loader/> :
                            <Button type="fail" marginReset onClick={()=> props.stopMeeting(props.id)}>Остановить занятие</Button>
                        }
                        {/*<MeetingPlank*/}
                        {/*    title={meeting.title}*/}
                        {/*    content={meeting.content}*/}
                        {/*    signup={meeting.signup}*/}
                        {/*    onClick={props.signupForMeeting.bind(this, props.id)}*/}
                        {/*    loading={props.loading}*/}
                        {/*/>*/}
                        <MeetingPlank
                            title={meeting.title}
                            content={meeting.content}
                            signup={meeting.signup}
                            onClick={props.signupForMeeting.bind(this, props.id)}
                            loading={props.loading}
                            checkIn={!meeting.link}
                            controlQuestion={meeting.CQ_title}
                            controlQuestionAnswer={meeting.CQ_answer}
                            error={props.meetingErrorCode}
                            vk_link={props.teachers[0].vk_link}
                        />
                    </div>
                )
            } else if((!isMeeting) && props.role === "TEACHER"){
                if(state.editMeeting){
                    content = <StartMeetingPlank onStart={handleStartMeeting} onRefuse={handleEditMeeting}/>
                } else {
                    content = <>
                        {
                           props.loading ?
                           <Loader/> :
                               <Button type="primary" onClick={handleEditMeeting.bind(this)}>Начать занятие</Button>
                        }
                        </>
                }

            } else if(isMeeting && props.role !== "TEACHER"){
                const meeting = props.meeting;
                content = <MeetingPlank
                    title={meeting.title}
                    content={meeting.content}
                    signup={meeting.signup}
                    onClick={props.signupForMeeting.bind(this, props.id)}
                    loading={props.loading}
                    checkIn={!meeting.link}
                    controlQuestion={meeting.CQ_title}
                />

            }

            if(content) return <div className={css.meetingWrapper}>{content}</div>
            else return null
        }

        function gradeRender(){
            if(props.grade){
                if(!props.gradeLoading){
                    return <Grade anonymous
                                  title={props.grade.title}
                                  date={props.grade.date.split("T")[0]}
                                  onSend={(mark, comment)=> { props.gradeMeeting(props.id, mark, comment)}}
                    />
                } else {
                    return <Loader/>
                }
            } else {
                return null;
            }
        }

        return (
            <div>
                {
                    !props.title ? <Loader type="page"/> :
                    <>
                        <div className={css.Course}>
                            <CourseBackground title={props.title} preview={props.preview} teachers={prepTeachersNames(props.teachers)}/>
                        </div>
                        {gradeRender.call(this)}
                        {meetingRender.call(this)}
                        <div>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} style={{display: 'flex', justifyContent: "center"}}>
                                <Tabs value={state.value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="О курсе" {...a11yProps(0)} />
                                    <Tab label="Задачи" {...a11yProps(1)} />
                                    <Tab label="Занятия" {...a11yProps(2)} />
                                    {props.role === "TEACHER" ?
                                        <Tab label="Преподавателю" {...a11yProps(3)} /> :
                                        null
                                    }
                                </Tabs>
                            </Box>
                            <div className={css.tabContent}>
                                <TabPanel value={state.value} props={props} index={0}>
                                    Item One
                                </TabPanel>
                                <TabPanel value={state.value} props={props} index={1}>
                                    Item Two
                                </TabPanel>
                                <TabPanel value={state.value} props={props} index={2}>
                                    Item Two
                                </TabPanel>
                                <TabPanel value={state.value} props={props} index={3}>
                                    Item Three
                                </TabPanel>
                            </div>

                        </div>
                    </>

                }
            </div>
        )
    }
    return <>{render()}</>
}

function mapDispatchToProps(dispatch){
    return {
        fetchCourseById: (id)=> {dispatch(fetchCourseById(id))},
        fetchCourseMeetings: (id)=> {dispatch(fetchCourseMeetings(id))},
        fetchCourseMeeting: (m_id, c_id)=> {dispatch(fetchCourseMeeting(m_id, c_id))},
        fetchTasks: (id) => {dispatch(fetchCourseTasksById(id))},
        setError: (error) => {dispatch(setError(error))},
        resetError: () => {dispatch(resetCoursesError())},
        resetCourse: () => {dispatch(resetCourse())},
        resetMeeting: () => {dispatch(resetMeeting())},
        setHomeworkCourseId: (courseId) => {dispatch(setHomeworkCourseId(courseId))},
        setHomeworkUserStatus: (status) => {dispatch(setHomeworkUserStatus(status))},
        setMeeting: (course_id, title, content, CQ, CQ_title, CQ_answer, link) => {dispatch(setMeeting(course_id, title, content, CQ, CQ_title, CQ_answer, link))},
        stopMeeting: (course_id) => {dispatch(stopMeeting(course_id))},
        signupForMeeting: (course_id, answer) => {dispatch(signupForMeeting(course_id, answer))},
        shouldGradeMeeting: (course_id) => {dispatch(shouldGradeMeeting(course_id))},
        gradeMeeting: (course_id, mark, comment) => {dispatch(gradeMeeting(course_id, mark, comment))},
        setAuthRedirectTo: (to) => {dispatch(setAuthRedirectTo(to))},
        resetAuthError: () => {dispatch(resetAuthError())}
    }
}

function mapStateToProps(state){
    return {
        title: state.courses.course?.title,
        description: state.courses.course?.description,
        preview: state.courses.course?.preview,
        teachers: state.courses.course?.teachers,
        about: state.courses.course?.about,
        tasks: state.courses.tasks,
        meetings: state.courses.meetings,
        selectedMeeting: state.courses.meeting,
        error: state.courses.error,
        role: state.courses.course?.role,
        studentsCount: state.courses.course?.studentsCount,
        needToCheck: state.courses.course?.needToCheck,
        id: state.courses.course?.id,
        meeting: state.courses.course?.meeting,
        loading: state.courses.loading,
        readyStage: state.auth.readyStage,
        grade: state.courses.grade,
        gradeLoading: state.courses.gradeLoading,
        authError: state.courses.authError,
        meetingErrorCode: state.meeting.code,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Course)