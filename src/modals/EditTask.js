import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {useState, useEffect} from 'react'

const EditTask = ({modal, taskObj}) => {
    const [show, setShow] = useState(modal);

    const toggle = () => {
        console.log("TOGGLE SHOW, SHOW IS NOW = ", !show);
        setShow(!show);
    }
    
    useEffect(() => {
        console.log("EDITTASK SHOW VARIABLE USEEFFECT", show);    
    })

    return (
        <React.Fragment>
            
            <h3>TESTING EDITTASK show={show?'TRUE':'FALSE'}</h3>
            
        <Modal isOpen={show} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          {(taskObj.text===null ? ('No text') : (taskObj.text))}
          {'||| ' + (taskObj.day===null ? ('No day') : (taskObj.day))}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Update</Button>{' '}
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
      </React.Fragment>
    )
}

export default EditTask

/*
import React, { useState , useEffect} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const EditTaskPopup = ({modal, toggle, updateTask, taskObj}) => {
    const [taskName, setTaskName] = useState('');
    const [day, setDay] = useState('');

    console.log("EditTaskPopup RUN");
    
    const handleChange = (e) => {
        
        const {name, value} = e.target

        if(name === "taskName"){
            setTaskName(value)
        }else{
            setDay(value)
        }


    }

    useEffect(() => {
        setTaskName(taskObj.text)
        setDay(taskObj.day)
    },[])

    const handleUpdate = (e) => {
        e.preventDefault();
        let tempObj = {}
        tempObj['text'] = taskName
        tempObj['day'] = day
        updateTask(tempObj)
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Task</ModalHeader>
            <ModalBody>
            
                    <div className = "form-group">
                        <label>Task Name</label>
                        <input type="text" className = "form-control" value = {taskName} onChange = {handleChange} name = "taskName"/>
                    </div>
                    <div className = "form-group">
                        <label>Description</label>
                        <textarea rows = "5" className = "form-control" value = {day} onChange = {handleChange} name = "day"></textarea>
                    </div>
                
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
      </Modal>
    );
};

export default EditTaskPopup;
*/