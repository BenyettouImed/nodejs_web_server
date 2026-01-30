const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "no employees found" });
  res.json(employees);
};

const creatNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname)
    return res
      .status(400)
      .json({ message: "firstname and lastname are required" });

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result); // 201 means created
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "id is required" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee id ${req.body.id} not found` });
  }
  if (req.body?.firstname) {
    employee.firstname = req.body.firstname;
  }
  if (req.body?.lastname) {
    employee.lastname = req.body.lastname;
  }
  const result = await employee.save();
  res.json(result); // 200 means ok
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "id is required" });
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `employee with id: ${req.body.id} not found` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "id is required" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `employee with id: ${req.params.id} not found` });
  }
  res.status(200).json(employee);
};

module.exports = {
  getAllEmployees,
  creatNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
