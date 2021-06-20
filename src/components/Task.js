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

    //Assume task.date is valid (that it has month, day, and year properties which should be all of type number)
    //Maybe could import joi and validateDate from api.js to make sure this assumption is true
    //However, the only current way to input guarantees that task has date property and either date is a null object, or date is a object with all 3 day, month, year properties
    return (
        <div {...props} ref={props.innerRef} className={`task ${task.reminder ? 'reminder' : ''} ${task.done ? 'done' : ''}`} onDoubleClick={() => onToggle(task.id)}>
            <div>
            <h3>{task.text || "No text set"}</h3>
            <p>{task.date ? (task.date.month + "/" + task.date.day + "/" + task.date.year) : ("No date set")} </p>
            <p>Priority: {task.priority || "No priority set"}</p>
            </div>

            <div>
            <ul className="icon-list" style={{display: 'block'}}>
                {/* the style on the ul to justifyContent towardss the flex-end is not necessary here */}
                <FaEdit onClick={() => updateModal()} />
                <FaTimes style={{color: 'red', cursor: 'pointer'}} onClick={() => onDelete(task.id)}/>
            </ul>
            <p style={{marginLeft: 'auto'}} style={{display: 'block'}}>ID: {task.renderId}</p>
            <p>Prereqs: {task.prereq ? (task.prereq.map((ele) => {return ele+","})) : ('No prerequisites')}</p>
            </div>

            {/*
            <EditTask modal={modal} toggle={toggle} updateTask={updateTask} taskObj={task} />
            */}

            <EditTask modal={modal} taskObj={task}/>
        </div>
    )
}

export default Task
