import { useState } from 'react'

const OptionsMenu = ({ onOptions }) => {
  const [order, setOrder] = useState('')
  const [reverse, setReverse] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()

    onOptions({order, reverse})

    //Don't clear the options made in the options menu

    }

  return (
    <form className='options-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Order By</label>
        <select name="order" onChange={(e) => setOrder(e.target.value)}>
            <option value="date">Start Date</option>
            <option value="text">Text (Alphabetical)</option>
            <option value="priority">Priority</option>
            <option value="none">None (Adding new tasks that break order will not automatically trigger a reorder)</option>
        </select>
      </div>
      <div className='form-control form-control-check'>
        <label>Reverse Order</label>
        <input
          type='checkbox'
          checked={reverse}
          value={reverse}
          onChange={(e) => setReverse(e.currentTarget.checked)}
        />
      </div>

      <input type='submit' value='Update Options' className='btn btn-block' />
    </form>
  )
}

export default OptionsMenu
