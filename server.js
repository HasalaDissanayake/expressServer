const express = require("express");
const Joi = require('joi');

const app = express();

// middleware to request processing
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {

  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put('/api/course/:id', (req, res)=> {
  //to find the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course with the given ID was not found");

  const { error } = validateCourse(req.body); //result.error

  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
  
});


app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  console.log(course);
  if (!course) return res.status(404).send("The course with the given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);

});

// validation logic
function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string()
    .min(3)
    .required()
  })

  return schema.validate({name: course.name});
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

