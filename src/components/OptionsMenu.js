import { useState } from 'react'
import React from 'react'

const OptionsMenu = ({ onOptions, savedOptions }) => {
  const [order, setOrder] = useState(savedOptions.order)
  const [reverse, setReverse] = useState(savedOptions.reverse)

  const orderForm = [{val: 'date', descr: 'Start Date'},
  {val: 'text', descr: 'Text (Alphabetical)'},
  {val: 'priority', descr: 'Priority'},
  {val: 'none', descr: 'None (Adding new tasks that break order will not automatically trigger a reorder)'}
  ]

  const onSubmit = (e) => {
    e.preventDefault()

    onOptions({order, reverse})

    //Don't clear the options made in the options menu

    }

  return (
    <form className='options-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Order By</label>
        <select name="order" onChange={(e) => setOrder(e.target.value)} defaultValue={savedOptions.order}>
            {
              orderForm.map((ele, ind) => {
                const optionEle = React.createElement('option', {value: ele.val, key: ind}, ele.descr);
                
                //const selectedAttr = 'selected'
                //return <option key={ind} value={ele.val} {...selectedAttr}>{ele.descr}</option>
                return optionEle;
              })
            }
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
