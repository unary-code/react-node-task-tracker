import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState('')
  const [day, setDay] = useState('')
  const [reminder, setReminder] = useState(false)

  const [selectedDate, setSelectedDate] = useState(null)

  const [priority, setPriority] = useState(10)

  const [prereqText, setPrereqText] = useState('')

  const processPrereqText = () => {
    //prereqText (string) to prereq (array of numbers)

    let prereq = null;

    if (prereqText === null || !prereqText) {
      prereq = null;
      return prereq;
    }

    //currently, harsh implementation that only allows 1 comma (no spaces or other characters) between entries
    //doesn't allow mistakes
    //doesn't allow extra parantheses at either end of prereqText
    //to fix this, can use regex in the future to allow for more flexibility

    prereq = prereqText.split(",");
    
    //assume all elements of prereq can be parsed into ints
    prereq = prereq.map((ele) => { return parseInt(ele)});

    console.log("prereq array=");
    for (let i=0; i<prereq.length; i++) {
      console.log(prereq[i]+" "+(typeof(prereq[i])))
    }

    return prereq;
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!text) {
      alert('Please add a task')
      return
    }

    console.log("SELECTEDDATE=" + selectedDate);
    console.log("SELECTEDDATE .toString() =" + selectedDate.toString());

    const prereq = processPrereqText();

    onAdd(
      { text: text, date: {year: (1900+selectedDate.getYear()), month: (1+selectedDate.getMonth()), day: selectedDate.getDate()}, reminder: reminder, priority: parseInt(priority), prereq: prereq}
    )

    setText('')
    //setDay('')
    setSelectedDate(null)
    setReminder(false)
  }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Task</label>
        <input
          type='text'
          placeholder='Add Task'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label>Day & Time</label>
        <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />
        {/* 
        <input
          type='text'
          placeholder='Add Day & Time'
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
        */}
      </div>
      <div className='form-control'>
        <label>Priority</label>
        <select name="priority" onChange={(e) => setPriority(e.target.value)}>
            {
              [1,2,3,4,5,6,7,8,9,10].map((cur) => {
                return <option value={cur} key={cur}>{cur}</option>
              })
            }
        </select>
      </div>
      <div className='form-control'>
        <label>Prerequisites</label>
        <input
          type='text'
          placeholder='Prereqs'
          value={prereqText}
          onChange={(e) => setPrereqText(e.target.value)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Set Reminder</label>
        <input
          type='checkbox'
          checked={reminder}
          value={reminder}
          onChange={(e) => setReminder(e.currentTarget.checked)}
        />
      </div>

      <input type='submit' value='Save Task' className='btn btn-block' />
    </form>
  )
}

export default AddTask