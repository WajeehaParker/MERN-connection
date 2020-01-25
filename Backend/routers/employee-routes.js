const router = require('express').Router();
const connection = require('./../db');

router.get('/', (req,res) => {
    connection.query('CALL employees_data()', (err, result) => {
        if (err) throw err;
        else return res.json(result[0])
    });
});

router.get('/:id', function (req, res) {
    let id = req.params.id;        
    connection.query("call employee_data(?)",id, (err, result) => {
        if (err) throw err;
        else return res.json(result[0])
    });
   
});

//  Create New Customer  
router.post('/', (req, res) => {
    let customer = req.body;    
    connection.query("Insert into employee set ?; ", customer, (err, result) => {
        if (err) throw err;
        else return res.send({ error: false, data: result, message: 'New employee has been created successfully.' });
    });
   
});

// Update an existing customer
router.put('/:id', (request, response) => {
    const id = request.params.id;
    connection.query('UPDATE employee SET ? WHERE id = ?', [request.body, id], (error, result) => {
        if (error) throw error;
        response.send('employee updated successfully.');
    });
});

// Delete a  Customer
router.delete('/:id', (request, response) => {
    const id = request.params.id;
    connection.query('DELETE FROM employee WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('employee deleted.');
    });
});

module.exports = router;