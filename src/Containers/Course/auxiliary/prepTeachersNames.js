function prepTeachersNames(teachers){
    let newTeachers = [];
    if(teachers){
        newTeachers = teachers.map(item => {
            return <a target="_blank" href={item.vk_link}>{item.name}</a>
        })
    }
    let res;
    if(newTeachers.length === 1){
        res = <div>Преподаватель: {newTeachers}</div>
    } else if(newTeachers.length > 1) {
        res = <div>Преподаватели: {newTeachers}</div>
    }

    return res;
}

export default prepTeachersNames;