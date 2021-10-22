import React, {Component} from "react"
import css from "./Course.module.css"
import {server} from "../../axios/server";
import {connect} from "react-redux";
import {
    fetchCourseById,
    fetchCourseTasksById, gradeMeeting,
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
class Course extends Component{


    async initialLoad(){
        this.props.resetError(); //Убираем ошибки при загрузке курса. Мы её получим, если она будет в CWRP
        this.props.fetchCourseById(this.props.match.params.id); //Запрашиваем курс;
        this.setState({
            ...this.state,
            initialLoad: false,
        })
    }

    componentDidMount() {
        if(this.props.readyStage){
            this.initialLoad();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.error){
            this.props.setError(nextProps.error);
            this.props.history.push("/error/")
        }
        if(nextProps.readyStage && this.state.initialLoad){
            this.initialLoad();
        }

        if(!this.props.grade && this.props.id && !this.state.getGrade){
            this.props.shouldGradeMeeting(this.props.id);
            this.setState({
                ...this.state,
                getGrade: true,
            })
        }
    }

    componentWillUnmount() {
        this.props.resetCourse();
    }

    state = {
        value: 0,
        editMeeting: false,
        meetingTitle: "",
        meetingContent: "",
        initialLoad: true,
        getGrade: false,
        sendGrade: false,
    }


    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    };

    handleEditMeeting(){
        this.setState({
            ...this.state,
            editMeeting: !this.state.editMeeting,
        })
    }

    handleMeetingTitle(e){
        this.setState({
            ...this.state,
            meetingTitle: e.target.value,
        })
    }

    handleMeetingContent(e){
        this.setState({
            ...this.state,
            meetingContent: e.target.value,
        })
    }

    handleStartMeeting(){
        this.setState({
            ...this.state,
            editMeeting: false,
            meetingTitle: "",
            meetingContent: "",
        })
        this.props.setMeeting(this.props.id, this.state.meetingTitle, this.state.meetingContent)
    }


    render(){
        let upperThis = this;
        function a11yProps(index) {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        }

        function TabPanel(props) {
            const { children, value, index, ...other } = props;

            let content;
            if(value === index){
                if(props.value === 0){
                    if(upperThis.props.articles.length === 0) content = <>Пусто</>
                }

                if(props.value === 1){
                    if(upperThis.props.tasks === null){
                        content = <Loader type="page"/>
                        upperThis.props.fetchTasks(upperThis.props.match.params.id);
                    } else {
                        content = upperThis.props.tasks.map((task, index) => {
                            return <HomeworkPlank key={index}
                                                  title={task.title}
                                                  description={task.content}
                                                  status={task.status}
                                                  id={task._id}
                            />
                        })

                        if(props.props.role === "TEACHER"){
                            const checkHomeworksBtn = (<>
                                <Button type="primary" onClick={() => {
                                    props.props.setHomeworkCourseId(props.props.id);
                                    props.props.history.push("/homework");
                                }}  key={Math.random()}

                                >Проверить ДЗ</Button>
                                <div style={{marginBottom: 20}}/>

                            </>)
                            content.unshift(checkHomeworksBtn);
                        }
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
            const isMeeting = this.props.meeting && this.props.meeting.active;
            if(isMeeting && this.props.role === "TEACHER"){
                const meeting = this.props.meeting;
                content = (
                    <div className={css.teacherPannel}>
                        {this.props.loading ?
                            <Loader/> :
                            <Button type="fail" marginReset onClick={()=> this.props.stopMeeting(this.props.id)}>Остановить занятие</Button>
                        }
                        <MeetingPlank
                            title={meeting.title}
                            content={meeting.content}
                            signup={meeting.signup}
                            onClick={this.props.signupForMeeting.bind(this, this.props.id)}
                            loading={this.props.loading}
                        />
                    </div>
                )
            } else if((!isMeeting) && this.props.role === "TEACHER"){
                if(this.state.editMeeting){
                    content = <form className={css.editMeeting} onSubmit={(e) => e.preventDefault()}>

                        <input type="text"
                               placeholder="Новое занятие"
                               value={this.state.meetingTitle}
                                onChange={this.handleMeetingTitle.bind(this)}
                        />
                        <textarea cols="30" rows="10"
                                  defaultValue={this.state.meetingContent}
                                  onChange={this.handleMeetingContent.bind(this)}
                        />
                        <Button type="success" marginReset
                                disabled={!this.state.meetingTitle || !this.state.meetingContent}
                                onClick={() => this.handleStartMeeting()}
                        >
                            Сохранить
                        </Button>
                        {
                            this.props.loading ?
                                <Loader/> :
                                <Button type="fail" onClick={this.handleEditMeeting.bind(this)} marginReset>Отменить</Button>
                        }

                    </form>
                } else {
                    content = <>
                        {
                           this.props.loading ?
                           <Loader/> :
                               <Button type="primary" onClick={this.handleEditMeeting.bind(this)}>Начать занятие</Button>
                        }
                        </>
                }

            } else if(isMeeting && this.props.role !== "TEACHER"){
                const meeting = this.props.meeting;
                content = <MeetingPlank
                    title={meeting.title}
                    content={meeting.content}
                    signup={meeting.signup}
                    onClick={this.props.signupForMeeting.bind(this, this.props.id)}
                    loading={this.props.loading}
                />

            }

            if(content) return <div className={css.meetingWrapper}>{content}</div>
            else return null
        }

        function gradeRender(){
            if(this.props.grade){
                if(!this.props.gradeLoading){
                    return <Grade anonymous
                                  title={this.props.grade.title}
                                  date={this.props.grade.date.split("T")[0]}
                                  onSend={(mark, comment)=> { this.props.gradeMeeting(this.props.id, mark, comment)}}
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
                    !this.props.title ? <Loader type="page"/> :
                    <>
                        <div className={css.Course}>
                            <div className={css.header} style={{backgroundImage: `url("${server}${this.props.preview}")`}}>
                                <h1>{this.props.title}</h1>
                            </div>
                        </div>
                        {gradeRender.call(this)}
                        {meetingRender.call(this)}
                        <div>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} style={{display: 'flex', justifyContent: "center"}}>
                                <Tabs value={this.state.value} onChange={this.handleChange} aria-label="basic tabs example">
                                    <Tab label="Статьи" {...a11yProps(0)} />
                                    <Tab label="Задачи" {...a11yProps(1)} />
                                    <Tab label="Полезно" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <div className={css.tabContent}>
                                <TabPanel value={this.state.value} props={this.props} index={0}>
                                    Item One
                                </TabPanel>
                                <TabPanel value={this.state.value} props={this.props} index={1}>
                                    Item Two
                                </TabPanel>
                                <TabPanel value={this.state.value} props={this.props} index={3}>
                                    Item Three
                                </TabPanel>
                            </div>

                        </div>
                    </>

                }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return {
        fetchCourseById: (id)=> {dispatch(fetchCourseById(id))},
        fetchTasks: (id) => {dispatch(fetchCourseTasksById(id))},
        setError: (error) => {dispatch(setError(error))},
        resetError: () => {dispatch(resetCoursesError())},
        resetCourse: () => {dispatch(resetCourse())},
        setHomeworkCourseId: (courseId) => {dispatch(setHomeworkCourseId(courseId))},
        setHomeworkUserStatus: (status) => {dispatch(setHomeworkUserStatus(status))},
        setMeeting: (course_id, title, content) => {dispatch(setMeeting(course_id, title, content))},
        stopMeeting: (course_id) => {dispatch(stopMeeting(course_id))},
        signupForMeeting: (course_id) => {dispatch(signupForMeeting(course_id))},
        shouldGradeMeeting: (course_id) => {dispatch(shouldGradeMeeting(course_id))},
        gradeMeeting: (course_id, mark, comment) => {dispatch(gradeMeeting(course_id, mark, comment))},
    }
}

function mapStateToProps(state){
    return {
        title: state.courses.course?.title,
        description: state.courses.course?.description,
        preview: state.courses.course?.preview,
        teachers: state.courses.course?.teachers,
        articles: state.courses.course?.articles,
        tasks: state.courses.tasks,
        error: state.courses.error,
        role: state.courses.course?.role,
        id: state.courses.course?.id,
        meeting: state.courses.course?.meeting,
        loading: state.courses.loading,
        readyStage: state.auth.readyStage,
        grade: state.courses.grade,
        gradeLoading: state.courses.gradeLoading,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Course)