const { da } = require('date-fns/locale')
const path = require('path')
const data = {
    employees : require(path.join(__dirname,'..', 'model', 'employees.json')),
    setEmployees : function (data)  {
        this.employees = data
    }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const creatNewEmployee = (req, res) => {
        const newEmployee = {
            id : data.employees[data.employees.length-1].id + 1 || 1,
            firstname : req.body.firstname,
            lastname : req.body.lastname
        }

        if (!newEmployee.firstname || !newEmployee.lastname){
            return res.status(400).json({'message' : 'firstname and lastname are required!'})
        }

        data.setEmployees([...data.employees, newEmployee])
        res.status(201).json(data.employees) // 201 means created
}

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => 
        emp.id ===  parseInt(req.body.id)
    )
    if (!employee) {
        return res.status(400).json({"message" : `Employee id ${req.body.id} not found`})
    }
    if (req.body.firstname) {
        employee.firstname = req.body.firstname
    }
    if (req.body.lastname) {
        employee.lastname = req.body.lastname
    }
    const filteredArr = data.employees.filter((emp) => emp.id !== parseInt(req.body.id))
    const unsortedArr = [...filteredArr, employee]
    data.setEmployees(unsortedArr.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    res.status(200).json(data.employees) // 200 means ok

}

const deleteEmployee = (req, res) => {
        const employee = data.employees.find((emp) => emp.id === req.body.id)
        if (! employee){
            return res.status(400).json({"message" : `employee with id: ${req.body.id} not found`})
        }
        const filteredArr = data.employees.filter((emp) => emp.id !== parseInt(req.body.id))
        data.setEmployees([...filteredArr])
        res.status(200).json(data.employees)
}

const getEmployee = (req, res) => {
        const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id))
        if(!employee){
            return res.status(400).json({"message" : `employee with id: ${req.params.id} not found`})
        }
        res.status(200).json(employee)
}

module.exports = {
    getAllEmployees,
    creatNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}


