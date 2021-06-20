import Header from './components/Header.js'
import Tasks from './components/Tasks.js'
import Task from './components/Task.js'

import AddTask from './components/AddTask.js'
import OptionsMenu from './components/OptionsMenu.js'
import SearchBar from './components/SearchBar.js'

import {useState, useEffect} from 'react'

import {Button} from 'reactstrap'

function App() {
    
  const [tasks, setTasks] = useState([])

  //URL CODE
  const {search} = window.location;
  const query = new URLSearchParams(search).get('s');

  const filterPosts = (posts, query) => {
    if (!posts) {
      return posts;
    }

    if (!query) {
        return posts;
    }

    return posts.filter((post) => {
        const postText = post.text.toLowerCase();
        return postText.includes(query);
    });
  };

  const [searchQuery, setSearchQuery] = useState(query || '');
  const filteredTasks = filterPosts(tasks, searchQuery);

  const taskDemo = {id: 9, text: 'Whatsup', date: {year: '2019', month: '7', day: '3'}, reminder: false};

  const [showAddTask, setShowAddTask] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  //const [showQueryBar, setShowQueryBar] = useState(false)

  const [postReq, setPostReq] = useState(null)

  const [deleteReq, setDeleteReq] = useState(null)
  
  const [reorderFlag, setReorderFlag] = useState(null)

  const [savedOptions, setSavedOptions] = useState(null)

  const [optionFlag, setOptionFlag] = useState(false)

  //2 options
  //1) Initialize savedOptions with null and then render tasks based on default settings
  //2) Initialize savedOptions with the default settings and then render tasks based on savedOptions initial value
  //I chose option 1

  const addTask = (task) => {
    console.log("addTask");
    //const id = Math.floor(Math.random()*10000 + 1);
    //generate id from 1 to 10000 inclusive
    //const newTask = {id, ...task};

    const newTask = task;

    console.log(newTask);
    
    setPostReq(newTask);

    //setTasks([...tasks, newTask]);
  }

  const deleteTask = (id) => {
    console.log("deleteTask", id);
    setDeleteReq(id);
    //setTasks(tasks.filter((task) => task.id !== id));
  }

  const updateTasks = () => {
    //Send GET request to '/api/courses'
    //Set tasks equal to the response from the GET request
    
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/courses', requestOptions)
      .then(response => response.json()).then(data => {console.log("data=", data); setTasks(data.tasks)});
  }

  const toggleReminder = (id) => {
    console.log("id=", id);
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: !task.reminder} : (task)));

  }

  //On page reload, set tasks (frontend React) equal to courses (backend Node)
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/courses', requestOptions)
      .then(response => response.json()).then(data => {console.log("data=", data); setTasks(data.tasks); setSavedOptions(data.savedOptions);});
    }, [])

  //Post task to courses (Node), then update tasks (React) through setTasks
  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    if (!postReq) return;

    console.log("useEffect for postReq called, postReq=", postReq);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({task: postReq, options: savedOptions})
    };

    fetch('/api/courses', requestOptions)
        .then(response => { if (response.status===400) {throw Error('Invalid input syntax'); }return response.json();})
        .then(data => {console.log("data=", data); setTasks(data)})
        .catch((err) => { if (err.message === 'Invalid input syntax') { console.log("catch error Invalid input syntax"); return;} });

  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [postReq]);

  //Delete task with given id deleteReq to courses (Node), then update tasks (React) through setTasks
  useEffect(() => {
    if (!deleteReq) return;

    console.log("DELETE REQUEST");

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: deleteReq})
    };
    fetch(`/api/courses/${deleteReq}`, requestOptions)
        .then(response => response.json()).then(data => {console.log("data=", data); setTasks(data.tasks);});

    //setTasks(tasks.filter((task) => task.id !== deleteReq))
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [deleteReq]);

  useEffect(() => {

    if (reorderFlag === null) return;

    if (tasks === null || savedOptions === null) return;

    console.log("REORDER REQUEST in useEffect()");

    let requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({tasks: tasks})
    };

  fetch(`/api/courses/change-all`, requestOptions)
  .then(response => response.json()).then(data => console.log("data"))
  .catch(err => console.log("REORDER in useEffect fetch error=", err));

  requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({savedOptions: savedOptions})
  };

  fetch(`/api/options`, requestOptions)
  .then(response => response.json()).then(data => console.log("data"))
  .catch(err => console.log("REORDER in useEffect fetch error=", err));

    /*
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({sId: reorderFlag.sId, dId: reorderFlag.dId})
    };
    fetch(`/api/courses/drag-reorder`, requestOptions)
        .then(response => response.json()).then(data => {console.log("data=", data); setTasks(data)});
    */

    //setTasks(tasks.filter((task) => task.id !== deleteReq))
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [reorderFlag]);

  useEffect(() => {

    if (optionFlag === null) return;

    if (tasks === null || savedOptions === null) return;

    console.log("OPTION UPDATE REQUEST in useEffect()");

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({savedOptions: savedOptions})
    };

  fetch(`/api/options`, requestOptions)
  .then(response => response.json()).then(data => {setTasks(data)})
  .catch(err => console.log("OPTION UPDATE in useEffect fetch error=", err));

    /*
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({sId: reorderFlag.sId, dId: reorderFlag.dId})
    };
    fetch(`/api/courses/drag-reorder`, requestOptions)
        .then(response => response.json()).then(data => {console.log("data=", data); setTasks(data)});
    */

    //setTasks(tasks.filter((task) => task.id !== deleteReq))
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [optionFlag]);

  const reorderTasks = (sId, dId) => {
    console.log("reorderTasks function");

    const taskListCopy = Array.from(tasks);
    const [reorderedItem] = taskListCopy.splice(sId, 1);
    taskListCopy.splice(dId, 0, reorderedItem);

    setTasks(taskListCopy);
    setSavedOptions({...savedOptions, order: 'none', reverse: false})

    setReorderFlag(!reorderFlag);
    
  }

  const updateOrder = (orderOptions) => {
    //orderOptions contains props order and reverse

    console.log("updateOrder() RUN");

    const orderSame = orderOptions.order === savedOptions.order;
    const reverseSame = orderOptions.reverse === savedOptions.reverse;
    
    console.log("orderSame=" + orderSame + " reverseSame=" + reverseSame);
    if (!orderSame || !reverseSame) {
      //Update rendering
      if (orderSame && !reverseSame) {
        //Only need to reverse task order O(n) runtime
        setTasks(tasks.reverse());
        setReorderFlag(!reorderFlag);
        setSavedOptions({...savedOptions, reverse: orderOptions.reverse})
        return;
      }

      //From this point on, orderSame must be false and reverseSame can be 0 or 1
      //!orderSame || !reverseSame && (!orderSame || reverseSame)
      //o=1, r=0 > 1 & 0
      //o=1, r=1 > 0 & 1

      //o=0, r=0 > 1 & 1
      //o=0, r=1 > 1 & 1
      
      if (orderOptions.order === 'none') {
        
        //if reverse quantity was different, still don't do anything

        setSavedOptions({...savedOptions, order: 'none', reverse: 'false'});
        return;
      }

      if (orderOptions.order === 'date') {
        console.log("tasks=");
        for (let i=0; i<tasks.length; i++) {
          console.log(tasks[i]);
        }
        console.log("tasks print done");

        setTasks(tasks.sort((task1, task2) => {
          if (task1.date.year === task2.date.year) {
            if (task1.date.month === task2.date.month) {
                return ((task1.date.day > task2.date.day) ? (1) : (-1));
            }
            return ((task1.date.month > task2.date.month) ? (1) : (-1));
          }
          return ((task1.date.year > task2.date.year) ? (1) : (-1));
        }));
      } else {
      setTasks(tasks.sort((task1, task2) => { if (task1[orderOptions.order] < task2[orderOptions.order]) { return -1;} return 1;}))
      //tasks.sort((task1, task2) => { if (task1.text < task2.text) { return -1;} return 1;})
      
      }

      console.log(tasks[1]);
      //Should be Doctor

      if (!reverseSame) {
        console.log("tasks reverse");
        if (orderOptions.reverse) {
          setTasks(tasks.reverse());
        }
      }
      setReorderFlag(!reorderFlag);
      setSavedOptions({...savedOptions, order: orderOptions.order, reverse: orderOptions.reverse})
      return;
    }
  }

  const updateOptions = (options) => {
    //Assume all options types are independent of each other
    //Then only reorder/modify the tasks based on the options types that were updated
    //No need to go through all the options types available and then reorder/modify the tasks

    console.log("updateOptions new options=", options);
    console.log("old savedOptions=", savedOptions);
    //update rendering based on order (order type and reverse)
    //updateOrder({order: options.order, reverse: options.reverse});
    
    setSavedOptions(options);
    setOptionFlag(!optionFlag);

    console.log("updateOptions after updateOrder tasks[1]=", tasks[1])
    
  }

  return (
    <div className="container">
      <form action="../../post" method="post" 
              className="form">
          <button type="submit">Connected?</button>
      </form>

      <h1>Hello World</h1>
      <Header onAdd={() => {setShowOptionsMenu(false); setShowAddTask(!showAddTask);}} showAdd={showAddTask}
      onOptions={() => {setShowAddTask(false); setShowOptionsMenu(!showOptionsMenu);}} showOptions={showOptionsMenu}
      onSearch={() => {setShowSearchBar(!showSearchBar)}} showSearch={showSearchBar}/>
      {showAddTask &&
      <AddTask onAdd={addTask} />
      }
      {showOptionsMenu &&
      <OptionsMenu onOptions={updateOptions} savedOptions={savedOptions}/>
      }
      {showSearchBar &&
      <SearchBar searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}/>
      }

      {tasks.length > 0 ? (
      <Tasks tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleReminder} onReorder={reorderTasks}/>
      ): ('No tasks to show.') }

        <Button color="danger" onClick={() => {console.log('ttesting')}}>Launch demo modal!</Button>
      
      <Task task={taskDemo} />
    </div>
  );
}

export default App;
