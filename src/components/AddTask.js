import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState('')
  const [day, setDay] = useState('')
  const [reminder, setReminder] = useState(false)

  const [selectedDate, setSelectedDate] = useState(null)

  const [priority, setPriority] = useState(10)

  const onSubmit = (e) => {
    e.preventDefault()

    if (!text) {
      alert('Please add a task')
      return
    }

    console.log("SELECTEDDATE=" + selectedDate);
    console.log("SELECTEDDATE .toString() =" + selectedDate.toString());

    onAdd({ text: text, date: {year: (1900+selectedDate.getYear()), month: (1+selectedDate.getMonth()), day: selectedDate.getDate()}, reminder: reminder, priority: parseInt(priority)})

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