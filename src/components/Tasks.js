import Task from './Task'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

const Tasks = ({ tasks, onDelete, onToggle, onReorder, onEdit}) => {
    /*
    const [taskList, setTaskList] = useState(tasks)
    */
    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const sId = result.source.index;
        const eId = result.destination.index;

        onReorder(sId, eId);
        
        /*
        console.log("handleOnDragEnd", result);
        const taskListCopy = Array.from(taskList);
        const [reorderedItem] = taskListCopy.splice(result.source.index, 1);
        taskListCopy.splice(result.destination.index, 0, reorderedItem);
        */
        //setTaskList(taskListCopy);

    }

  return (
    <>
    <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todoList">
        { (provided) => (<ul className="ulist" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={""+task.id} index={index}>
                    {(provided) => 
                    (
                    <Task innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} task={task} onDelete={onDelete} onToggle={onToggle} onEdit={onEdit}>
                        TestingItem {task.id}
                        </Task>
                    )
                    }
                </Draggable>
            ))}

            {provided.placeholder}
            </ul>
            )

        }
        </Droppable>
      </DragDropContext>
    </>
  )
}

export default Tasks