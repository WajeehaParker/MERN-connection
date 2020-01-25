import React, { Component } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [], id: '', username: '', name: '', gender: 'Male', department: 'IT', password:'', verifypassword:'', newpassword:'',
            data: true, edit: false, add: false, changePassword: false, verifyPasswordmodelforEdit: false, verifyPasswordmodelforDelete: false,
            usernameerr: '', nameerr: '', passworderr: '', newpassworderr: '', verifypassworderr: '',
            index:'', pass:''
        };
    }

    refresh = () => {
        this.setState({
            username: '', name: '', gender: 'Male', department: 'IT', password: '', verifypassword: '', newpassword: '',
            data: true, edit: false, add: false, changePassword: false, verifyPasswordmodelforEdit: false, verifyPasswordmodelforDelete: false,
            usernameerr: '', nameerr: '', passworderr: '', newpassworderr: '', verifypassworderr: ''
        });
    }

    componentDidMount() {
        this.getEmployees();
    }

    getEmployees = _ => {
        fetch('http://localhost:4000/')
        .then(res => {
            return res.json()
        })
        .then(emp => {
            this.setState({ employees: emp })
        })
        .catch(err => console.error(err));
    };

    addEmployee = emp => {
        fetch('http://localhost:4000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emp)
        })
        .then(res => {
            this.getEmployees();
            return res.json();
        })
        .catch(err => console.error(err));
    };

    editEmployee = (emp, id) => {
        fetch('http://localhost:4000/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emp)
        })
        .then(res => {
            this.getEmployees();
            return res.json();
        })
        .catch(err => console.error(err));
    };

    deleteEmployee = id => {
        fetch('http://localhost:4000/' + id, { method: 'DELETE' })
            .then(res => {
                this.getEmployees();
                return res.json();
            })
            .catch(err => console.error(err));
    };

    add = states => {
        let row = this.state.employees;
        if (states.username === '' || states.name === '' || states.password === '' || states.verifypassword === '') {
            states.username === '' ? this.setState({ usernameerr: 'Required' }) : this.setState({ usernameerr: '' });
            states.name === '' ? this.setState({ nameerr: 'Required' }) : this.setState({ nameerr: '' });
            states.password === '' ? this.setState({ passworderr: 'Required' }) : this.setState({ passworderr: '' });
            states.verifypassword === '' ? this.setState({ verifypassworderr: 'Required' }) : this.setState({ verifypassworderr:'' });
        }
        else if (this.findName(states.username, 0))
            this.setState({ usernameerr: 'duplicate', nameerr: '', passworderr: '', verifypassworderr:'' });
        else if (states.password != states.verifypassword)
            this.setState({ verifypassworderr: 'password does not match', usernameerr: '', nameerr: '', passworderr: '' })
        else if (!this.validatePassword(states.password))
            this.setState({ verifypassworderr: 'Password must contain a letter, number and special character', usernameerr: '', nameerr: '', passworderr: '' });
        else{
            var custom_employee = {
                "username": states.username,
                "name": states.name,
                "gender": states.gender,
                "department": states.department,
                "password": states.password
            }
            this.addEmployee(custom_employee);
            this.refresh();
        }
    };

    edit = states => {
        if (states.username === '' || states.name === '') {
            states.username === '' ? this.setState({ usernameerr: 'Required' }) : this.setState({ usernameerr: '' });
            states.name === '' ? this.setState({ nameerr: 'Required' }) : this.setState({ nameerr: '' });
        }
        else if (this.findName(states.username, states.id))
            this.setState({ usernameerr: 'duplicate', nameerr: '' });
        else {
            var custom_employee = {
                "username": states.username,
                "name": states.name,
                "gender": states.gender,
                "department": states.department,
                "password": this.state.password
            }
            this.editEmployee(custom_employee, states.id);
            this.refresh();
        }
    };

    delete = (index, rows, item) => {
        rows.splice(index, 1);
        this.deleteEmployee(item)
    };

    change = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    findName = (name, id) => {
        name = name.trim().toLowerCase();
        for (let i = 0; i < this.state.employees.length; i++) {
            let username = this.state.employees[i].username.trim().toLowerCase();
            if (id === 0 && username === name) return true;
            else if (id != 0 && username === name && this.state.employees[i].id != id) return true;
        }
        return false;
    }

    findPassword(id) {
        return this.state.employees.find(s => s.id === id).password;
    }

    validatePassword = (pass) => {
        return /[a-zA-Z]/.test(pass) && /[0-9]/.test(pass) && /[^a-zA-Z0-9]/.test(pass) && /.{8,}/.test(pass);
    }

    newPassword = _ => {
        if (this.state.pass === '' || this.state.newpassword === '' || this.state.verifypassword === '') {
            this.state.pass === '' ? this.setState({ passworderr: 'Required' }) : this.setState({ passworderr: '' });
            this.state.newpassword === '' ? this.setState({ newpassworderr: 'Required' }) : this.setState({ newpassworderr: '' });
            this.state.verifypassword === '' ? this.setState({ verifypassworderr: 'Required' }) : this.setState({ verifypassworderr: '' });
        }
        else if (this.findPassword(this.state.id) != this.state.pass)
            this.setState({ passworderr: 'Incorrect Password', newpassworderr: '', verifypassworderr:'' });
        else if (this.state.newpassword != this.state.verifypassword)
            this.setState({ passworderr: '', newpassworderr: '', verifypassworderr: 'Passwords does not match' });
        else if (!this.validatePassword(this.state.newpassword))
            this.setState({ verifypassworderr: 'Password must be 8 letters and contain a letter, number and special character', passworderr: '', newpassworderr:'' });
        else {
            this.setState({ password: this.state.newpassword, changePassword: false, pass: '', newpassword: '', verifypassword: '', verifypassworderr:'' });
        }
    }

    verifyPasswordforEdit = _ => {
        if (this.state.password === '') this.setState({ passworderr: 'Required' });
        else if (this.findPassword(this.state.id) != this.state.password) this.setState({ passworderr: 'Incorrect Password' });
        else this.setState({ passworderr: '', verifyPasswordmodelforEdit: false, edit: true });
    }

    verifyPasswordforDelete = _ => {
        if (this.state.pass === '') this.setState({ passworderr: 'Required' });
        else if (this.findPassword(this.state.id) != this.state.pass) this.setState({ passworderr: 'Incorrect Password' });
        else {
            this.delete(this.state.index, this.state.employees, this.state.id);
            this.refresh();
        }
    }

    inputFields = () => {
        return (
            <div>
                <label>Username</label>
                <td><input type="text" name="username" value={this.state.username} onChange={e => this.change(e)} required /></td>
                < span class="badge badge-warning">{this.state.usernameerr}</span><br />
                <label>Name</label>
                <td><input type="text" name="name" value={this.state.name} onChange={e => this.change(e)} required /></td>
                < span class="badge badge-warning">{this.state.nameerr}</span><br />
                <label>Gender</label>
                <td><select style={{ width: "180px", height: "30px" }} name="gender" value={this.state.gender} onChange={e => this.change(e)} required>
                    <option>Male</option>
                    <option>Female</option>
                </select></td>
                <label>Department</label>
                <td><select style={{ width: "180px", height: "30px" }} name="department" value={this.state.department} onChange={e => this.change(e)} required>
                    <option>IT</option>
                    <option>Accounts</option>
                </select></td> <br />
            </div>
        );
    }

    render() {
        console.log(this.state.employees);
        return (
            <div class="container">
                {this.state.data && <div>
                    <h2>Employees:</h2><br />
                    <Button id="addBtn" onClick={() => { this.setState({ edit: false, add: true, data: false }); }}>Add</Button><br /><br />

                    {
                        //display employees table
                        //onClick = {() => {
                        //                    if (window.confirm('Are you sure you wish to delete this item?'))
                        //this.delete(i, this.state.employees, item)
                        //}}
                    }
                    < Table class="table table-stripped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Department</th>
                                <th style={{ width: "100px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.employees.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.username}</td>
                                    <td>{item.name}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.department}</td>
                                    <td><a href="#" onClick={() => {
                                        this.setState({
                                            id: item.id,
                                            username: item.username,
                                            name: item.name,
                                            gender: item.gender,
                                            department: item.department,
                                            edit: false, add: false, data: false, verifyPasswordmodelforEdit: true, verifyPasswordmodelforDelete:false
                                        });
                                    }}>Edit</a>&nbsp;&nbsp;&nbsp;
                                        <a href="#" onClick={() => {
                                            this.setState({
                                                id: item.id,
                                                password: item.password,
                                                index:i,
                                                edit: false, add: false, data: false, verifyPasswordmodelforDelete: true, verifyPasswordmodelforEdit:false
                                            });
                                        }}>Delete</a>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                </div>}


                {
                    //add
                }
                {this.state.add && < div >
                    <h2>Add Employee</h2>
                    <form>
                        {this.inputFields()}
                        <label>Password</label>
                        <td><input type="password" name="password" value={this.state.password} onChange={e => this.change(e)} required /></td>
                        < span class="badge badge-warning">{this.state.passworderr}</span><br/>
                        <label>Verify Password</label>
                        <td><input type="password" name="verifypassword" value={this.state.verifypassword} onChange={e => this.change(e)} required /></td>
                        < span class="badge badge-warning">{this.state.verifypassworderr}</span><br />
                        <Button onClick={() => this.refresh()}>Back</Button> &nbsp;&nbsp;
                        <Button onClick={() => this.add(this.state)}>Add</Button>
                    </form>
                </div>}

                {
                    // onClick={e => { e.preventDefault(); this.add(this.state) }
                    //edit
                }
                {this.state.edit && < div >
                    <h2>Edit Employee</h2>
                    <form>
                        {this.inputFields()}
                        <Button onClick={() => this.setState({ changePassword: true })}>Change Password</Button> <br /><br />
                        <Button onClick={() => this.refresh()}>Back</Button> &nbsp;&nbsp;
                        <Button onClick={() => this.edit(this.state)}>Update</Button>
                    </form>
                </div>}

                {
                    //new password modal
                }
                <Modal size="sm" show={this.state.changePassword} onHide={() => this.setState({ changePassword:false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Current Password</label>
                        <td><input type="password" name="pass" value={this.state.pass} onChange={e => this.change(e)} /></td>
                        < span class="badge badge-warning">{this.state.passworderr}</span><br />
                        <label>New Password</label>
                        <td><input type="password" name="newpassword" value={this.state.newpassword} onChange={e => this.change(e)} /></td>
                        < span class="badge badge-warning">{this.state.newpassworderr}</span><br />
                        <label>Verify Password</label>
                        <td><input type="password" name="verifypassword" value={this.state.verifypassword} onChange={e => this.change(e)} /></td>
                        < span class="badge badge-warning">{this.state.verifypassworderr}</span><br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() =>
                            this.setState({
                                changePassword: false,
                                pass: '',
                                newpassword: '',
                                verifypassword: '',
                                passworderr: '',
                                newpassworderr: '',
                                verifypassworderr:''
                            })}>Close</Button>
                        <Button variant="primary" onClick={() => this.newPassword()}>OK</Button>
                    </Modal.Footer>
                </Modal>

                {
                    //verify password modal for edit
                }
                <Modal size="sm" show={this.state.verifyPasswordmodelforEdit} onHide={() => this.refresh()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Verify Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Enter Password</label>
                        <td><input type="password" name="password" value={this.state.password} onChange={e => this.change(e)} /></td>
                        <span class="badge badge-warning">{this.state.passworderr}</span><br />
                     </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.refresh()}>Close</Button>
                        <Button variant="primary" onClick={() => this.verifyPasswordforEdit()}>OK</Button>
                    </Modal.Footer>
                </Modal>

                {
                    //verify password modal for delete
                }
                <Modal size="sm" show={this.state.verifyPasswordmodelforDelete} onHide={() => this.refresh()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Verify Password to delete item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Enter Password</label>
                        <td><input type="password" name="pass" value={this.state.pass} onChange={e => this.change(e)} /></td>
                        <span class="badge badge-warning">{this.state.passworderr}</span><br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.refresh()}>Close</Button>
                        <Button variant="primary" onClick={() => this.verifyPasswordforDelete()}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Employees;
