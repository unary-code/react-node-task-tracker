const express = require('express')
const Joi = require('joi')

const app = express()

app.use(express.json())

require('dotenv').config()

/*
let courses = [
    {id: 1, text: 'course1'},
    {id: 3, text: 'course3'},
    {id: 2, text: 'course2'},
]
*/

let courses = [
    {
      id: 1,
      text: 'Doctors appointment',
      date: {year: '2019', month: '1', day:'11'},
      reminder: true,
      priority: 7,
      renderId: 1,
      prereq: null,
      done: false,
    },
    {
      id: 3,
      text: 'Car appointment',
      date: {year: '2019', month: '2', day:'13'},
      reminder: false,
      priority: 3,
      renderId: 2,
      prereq: [1,3],
      done: false,
    },
    {
      id: 4,
      text: 'Job appointment',
      date: {year: '2019', month: '3', day:'9'},
      reminder: true,
      priority: 10,
      renderId: 3,
      prereq: null,
      done: false,
    },
    {
      id: 5,
      text: 'Paperwork appointment',
      date: {year: '2019', month: '2', day:'15'},
      reminder: false,
      priority: 8,
      renderId: 4,
      prereq: null,
      done: true,
    },
  ]

  let savedOptions = {order: 'none', reverse: false}

  let totalCourses = courses.length;
/*
app.get('/', (req, res) => {
    res.send('Hello whatsup???')
});
*/

app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/");
});

app.get('/api/courses', (req, res) => {
    res.send({tasks: courses, savedOptions: savedOptions})
});

app.get('/api/courses/:id', (req, res) => {
    //Do not res.send a object which can be null. Instead use if statement to see if object is null,
    //and if object is null then res.status([error code]).send("error message")
    //and if object is not null then res.send(object)
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course with given id= " + req.params.id + " was not found.");
    res.send(course)
});

function compareProps(x, y) {
    if (typeof(x) !== typeof(y)) {
        //should return or throw Error: x and y are of different types
        //unless you can input another parameter to tell the function how to compare two variables of different types
        return 0;
    }

    if (typeof(x) === 'number') {
        return (x>y)?(1):(-1);
    }

    if (typeof(x) === 'string') {
        return x.localeCompare(y);
    }

    if (validateDate(x) && validateDate(y)) {
        if (x.year === y.year) {
            if (x.month === y.month) {
                return ((x.day > y.day) ? (1) : (-1));
            }
            return ((x.month > y.month) ? (1) : (-1));
          }
          return ((x.year > y.year) ? (1) : (-1));
    }

    //should return or throw Error: either x or y are of a type not supported (the implementation for comparing is not implemented)
    //either not both because the 1st if statement is not perfect. if x and y are two JS complex objects (not number, string, or boolean) but of different complex types,
    //typeof(x) === Object === typeof(y) so you will get past the 1st if statement even though x and y are of differnet types.
    return 0;
}

const findIndLinear = (courseVal, propName, reverse) => {
    //O(n) Linear search
    //courses array has to be sorted

    let ind = -1;
    let found = false;

    if (reverse) {
        if (courseVal >= courses[0][propName]) {
            ind = 0;
            found = true;
        }
    } else {
        if (courseVal <= courses[0][propName]) {
            ind = 0;
            found = true;
        }
    }

    if (!found) {
        for (let i=0; i<courses.length-1; i++) {
            const comparePropsArray = [compareProps(courseVal, courses[i][propName]), compareProps(courseVal, courses[i+1][propName])]
            if (reverse) {
                if (courses[i+1][propName] <= courseVal && courseVal <= courses[i][propName]) {
                    ind=i+1;
                    found=true;
                    break;
                }
            } else {
                if (courses[i][propName] <= courseVal && courseVal <= courses[i+1][propName]) {
                    ind=i+1;
                    found=true;
                    break;
                }
            }
        }
    }

    if (!found) {
        if (reverse) {
            if (courseVal <= courses[courses.length-1][propName]) {
                ind = courses.length;
                found = true;
            }
        } else {
            if (courseVal >= courses[courses.length-1][propName]) {
                ind = courses.length;
                found = true;
            }
        }
    }

    return ind;
}

const findIndBinary = (courseVal, propName, reverse) => {
    //O(log(n)) Linear search
    //courses array has to be sorted

    let b = 0;
    let e = courses.length-1;
    let i = (b+e)/2;

    let ind = -1;
    let found = false;

    if (reverse) {
        if (courseVal >= courses[0][propName]) {
            i = 0;
            found = true;
        }
    } else {
        if (courseVal <= courses[0][propName]) {
            i = 0;
            found = true;
        }
    }

    if (!found) {

        while (b <= e) {
            const compareProps = compareProps(courses[i][propName], courseVal)
            compareProps *= ((reverse) ? (-1) :(1))
            if (compareProps < 0) {
                //if reverse is false this means that [i] < courseVal
                b = mid+1;
            } else if (compareProps > 0) {
                //if reverse is false this means that [i] < courseVal
                e = mid-1;
            } else {
                //[i] === courseVal
                //found match, can either insert new task at ind = i, ind = i-1, or ind = i+1
                break;
            }

            i = Math.floor((b+e)/2);
        }

        if (b > e) {
            //i should be 0, courses.length, or any index in between because courseVal was not contained in initial courses array          
        } else {
            found = true;
        }
    }

    if (!found) {
        if (reverse) {
            if (courseVal <= courses[courses.length-1][propName]) {
                i = courses.length;
                found = true;
            }
        } else {
            if (courseVal >= courses[courses.length-1][propName]) {
                i = courses.length;
                found = true;
            }
        }
    }

    ind = i;
    return ind;
}

app.post('/api/courses', (req, res) => {
    /*
    const schema = Joi.object({
        name: Joi.string().required()
    });

    const {errValid, resValid} = schema.validate({test: 'testvar'});

    console.log("req.body errValid=");
    console.log(errValid);
    console.log(resValid);
    */

    //task is the inputted task element
    const task = req.body.task;
    const {error} = validateTask(task);

    if (error) {
    console.log("error=", error);
    return res.status(400).send(error.details[0].message);
    }

    const options = req.body.options;

    const curId = generateId();

    const curRenderId = totalCourses+1;
    //course is task with id
    const course = {...task, id: curId, renderId: curRenderId}

    const courseVal = course[options.order]

    /*
    const course = {
        id: courses.length+1,
        text: req.body.text
    };
    */

    console.log("options.order=" + options.order + " options.reverse=" + options.reverse);

    if (options.order === 'none') {
        courses.push(course);
    } else {
        //O(n)
        //Traverse through courses list from start to end and insert course at index j
        //where x = courses[j].prop
        //where courses[i].prop < x < courses[i+1].prop (if options.reverse is false)
        //or vice versa (courses[i+1].prop < x < courses[i].prop) (if options.reverse is true)
        
        const ind = findIndLinear(courseVal, options.order, options.reverse);

        /*
        let ind = -1;
        let found = false;

        if (options.reverse) {
            if (courseVal >= courses[0][options.order]) {
                ind = 0;
                found = true;
            }
        } else {
            if (courseVal <= courses[0][options.order]) {
                ind = 0;
                found = true;
            }
        }

        if (!found) {
            for (let i=0; i<courses.length-1; i++) {
                const comparePropsArray = [compareProps(courseVal, courses[i][options.order]), compareProps(courseVal, courses[i+1][options.order])]
                if (options.reverse) {
                    if (courses[i+1][options.order] <= courseVal && courseVal <= courses[i][options.order]) {
                        ind=i+1;
                        break;
                    }
                } else {
                    if (courses[i][options.order] <= courseVal && courseVal <= courses[i+1][options.order]) {
                        ind=i+1;
                        break;
                    }
                }
            }
        }

        if (!found) {
            if (options.reverse) {
                if (courseVal <= courses[courses.length-1][options.order]) {
                    ind = courses.length;
                    found = true;
                }
            } else {
                if (courseVal >= courses[courses.length-1][options.order]) {
                    ind = courses.length;
                    found = true;
                }
            }
        }
        */

        console.log("ind=" + ind);
        //found should be true
        courses.splice(ind, 0, course);
        totalCourses++;
    }


    //console.log("courses=", courses);

    return res.send(courses);
});

app.put('/api/courses/update:id', (req, res) => {
    //Find the course with given id (id given in the url put request)
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course) return res.status(404).send("Course with given id was not found.");

    //Verify that the new course object (req.body) is validly formatted
    const {error} = validateTask(req.body);
    if (error) {
    console.log("error=", error);
    return res.status(400).send(error.details[0].message);
    }
    
    //Update the course
    //course = {id: course.id, req.body}

    //Order matters below. Use the props of initial course, then add props of req.body and for any props
    //that req.body has that were already initialized in the first Object.assign, set those props to the value found in req.body, not course
    //then finally, because it's possible (for some reason) that someone would put id in req.body that doesn't match the URL put request id,
    //set the id to the URL put request id (since after all, that id is the one we used to retrieve course)

    //2 ways we could change implementation
    //1) Don't transfer to newCourse the props set in course that weren't defined in the req.body
    //2) If req.body provides an id (for some reason) that doesn't match with the URL put request, throw an error

    let newCourse = {id: id};
    Object.assign(newCourse, course);
    Object.assign(newCourse, req.body);
    //let newCourse = (({id, ...others}) => ({...others}))(req.body);
    newCourse.id = id;

    console.log(newCourse);
    
    courses = courses.map( (cur) => {
        if (cur.id === id) {
            return newCourse
        } else {
            return cur
        }
        }
    );

    res.send(newCourse);
});

app.delete('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course) return res.status(404).send("Course with given id was not found.");

    console.log("delete request to course with id=", id);
    console.log("courses before delete request=", courses);
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    /*
    courses.sort((task1, task2) => {
        const text1 = task1.text;
        const text2 = task2.text;
        const compareRes = text1.localeCompare(text2);
        return compareRes;
    });
    */

    console.log("courses after delete request=", courses);

    res.send({tasks: courses});
});

app.put('/api/courses/change-all', (req, res) => {
    console.log("update-all req.body=", req.body);
    courses = req.body.tasks;

    res.send(courses);
});

app.put('/api/courses/drag-reorder', (req, res) => {
    //Chose to encode the 2 task IDs through the req.body, not URL req.params
    //Because if I encode the IDs through req.params, maybe someone can go to the URL
    //And end up swapping the 2 tasks

    //Run validateReorder to validate if req.body contains int sId and int dId that fall within inclusive range [0, courses.length-1]
    //And an optional suggestion: sId should not equal dId

    const [sId, dId] = [req.body.sId, req.body.dId];
    console.log("sId=" + sId + " dId=" + dId);
    const taskListCopy = Array.from(courses);
    const [reorderedItem] = taskListCopy.splice(sId, 1);
    taskListCopy.splice(dId, 0, reorderedItem);
    console.log("taskListCopy=" + taskListCopy[0].text);

    courses = taskListCopy;

    return res.send(courses);
});

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
        courses = courses.reverse();
        savedOptions = {...savedOptions, reverse: orderOptions.reverse}
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

        savedOptions = {...savedOptions, order: 'none', reverse: false}
        return;
      }

      courses = courses.sort((task1, task2) => {
          return compareProps(task1[orderOptions.order], task2[orderOptions.order]);
      })
      
      /*
      if (orderOptions.order === 'date') {
        console.log("tasks=");
        for (let i=0; i<courses.length; i++) {
          console.log(courses[i]);
        }
        console.log("tasks print done");

        courses = (courses.sort((task1, task2) => {
          if (task1.date.year === task2.date.year) {
            if (task1.date.month === task2.date.month) {
                return ((task1.date.day > task2.date.day) ? (1) : (-1));
            }
            return ((task1.date.month > task2.date.month) ? (1) : (-1));
          }
          return ((task1.date.year > task2.date.year) ? (1) : (-1));
        }));
      } else {
      
        courses = (courses.sort((task1, task2) => { if (task1[orderOptions.order] < task2[orderOptions.order]) { return -1;} return 1;}))
      //tasks.sort((task1, task2) => { if (task1.text < task2.text) { return -1;} return 1;})
      
      }
      */

        console.log("tasks reverse");
        if (orderOptions.reverse) {
          courses = (courses.reverse());
        }
      
      savedOptions = ({...savedOptions, order: orderOptions.order, reverse: orderOptions.reverse})
      return;
    }
  }

app.put('/api/options', (req, res) => {
    //since the URL is /api/options, req.body is options and doesn't contain tasks

    const options = req.body.savedOptions;
    console.log("options=", options);
    updateOrder(options);

    //savedOptions = {...savedOptions, options};

    return res.send(courses);
});

const generateId = () => {
    const id = Math.floor(Math.random()*10000 + 1);
    return id;
}

const validateDate = date => {
    const schema = Joi.object({
        year: Joi.number().required(),
        month: Joi.number().required(),
        day: Joi.number().required(),
    }).unknown();

    return schema.validate(date);
}

const validateTask = task => {
    const schema = Joi.object({
        text: Joi.string().min(3).required(),
        date: {
            year: Joi.number(),
            month: Joi.number(),
            day: Joi.number(),
        },
        reminder: Joi.boolean(),
        priority: Joi.number()
    }).unknown();

    return schema.validate(task);
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})

