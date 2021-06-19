import React from 'react'
import { FaTimes, FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import EditTask from '../modals/EditTask'

const Task = (props) => {

    //const task = props.task;

    const [task, setTask] = useState(props.task);
    //task not tasks

    const onDelete = props.onDelete;
    const onToggle = props.onToggle;

    const toggle = false;

    const ms = (task.id===3);
    const [modal, setModal] = useState(false)

    const [test, setTest] = useState(false);

    useEffect(() => {
        setModal(true);
    }, []);

    console.log(task.id + " " + task.text + " " + task.date + " " + modal);

    function updateTask(obj) {
        //Return here if obj doesn't contain all the properties and value types needed for it to be a Task type object
        
        setTask(obj);
    }

    function updateModal() {
        console.log("updateModal CALLED before modal = " + modal)
        setModal(true)
        console.log("updateModal after modal = " + modal)

        setTest(true);
        console.log("Test var after updateModal = " + test);
    }

    return (
        <div {...props} ref={props.innerRef} className={`task ${task.reminder ? 'reminder' : ''}`} onDoubleClick={() => onToggle(task.id)} style={{display: "flex", justifyContent: "space-between"}}>
            <div>
            <h3>{task.text}</h3>
            <p>{task.date.month + "/" + task.date.day + "/" + task.date.year} </p>
            <p>Priority: {task.priority}</p>
            </div>

            <div style={{display: 'flex', alignContent: 'space-between'}}>
            <ul className="icon-list" style={{display: 'block'}}>
                {/* the style on the ul to justifyContent towardss the flex-end is not necessary here */}
                <FaEdit onClick={() => updateModal()} />
                <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(task.id)}/>
            </ul>
            <p style={{marginLeft: 'auto'}} style={{display: 'block'}}>{task.renderId}</p>
            </div>

            {/*
            <EditTask modal={modal} toggle={toggle} updateTask={updateTask} taskObj={task} />
            */}

            <EditTask modal={modal} taskObj={task}/>
        </div>
    )
}

export default Task
