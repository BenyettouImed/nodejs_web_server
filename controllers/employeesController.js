const data = {}
data.employees = require(path.join(__dirname,'..', 'model', 'employees.json'))

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const creatNewEmployee = (req, res) => {
        res.json({
            "firstname" : req.body.firstname,
            "lastname" : req.body.lastname,
        })
}

const updateEmployee = (req, res) => {
        res.json({
            "firstname" : req.body.firstname,
            "lastname" : req.body.lastname
        })
}

const deleteEmployee = (req, res) => {
        res.json({"id" : req.body.id})
}

const getEmployee = (req, res) => {
        res.json({"id" : req.params.id, "firstname" : data.employees[req.params.id-1].firstname})
}

module.exports = {
    getAllEmployees,
    creatNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}


