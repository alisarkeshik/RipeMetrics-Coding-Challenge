import React, { Component } from "react";
import Individualcard from "../components/individualCard";
import axios from "axios";
import { Table } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import AddStudent from "../components/AddStudent";

var totalOwed = 0;
var totalPaid = 0;
let totalBalance;

const styles = {
    oweHeader: {
        backgroundColor: "#4C7300"
    },
    oweHeader2: {
        backgroundColor: "#4C7300"
    }
};

class Ledger extends Component {
    state = {
        owed: [],
        paid: []
    };

    componentDidMount() {
        this.getNewEvent(this.props.username);
    }
    componentWillReceiveProps(props) {
        this.getNewEvent(props.username);
    }

    getNewEvent(username) {
        console.log(this.props.username);

        Promise.all([
            axios.get("/user/findOwedByUserId/" + username),
            axios.get("/user/findYouOwedByUserId/" + username)
        ]).then(resultArray => {
            this.setState({
                ...this.state,
                owed: resultArray[0].data,
                paid: resultArray[1].data
            });
        });
    }
    setTotals() {
        totalOwed = 0;
        totalPaid = 0;
        this.state.owed.map(user => {
            (totalOwed += user.amount);
            if (user.isPaid === true) {
                totalOwed -= user.amount

            }
            return totalOwed
        });
        this.state.paid.forEach(user => {
            totalPaid += user.amount;
            if (user.isPaid === true) {

                totalPaid -= user.amount;
            }
            return totalPaid
        });

        console.log(this.state);
    }

    handleClick = (id, payee, eventName, username, amount) => {
        console.log("click handling! ", id, payee, eventName, username);

        const eventToUpdate = {
            userId: username,
            payedtoId: payee,
            amount: amount,
            eventName: eventName,
            eventId: id
        };

        console.log(eventToUpdate);
        axios
            .post("/user/pay", eventToUpdate)
            .then(response => {
                console.log("there goes payment!");
                this.notify(eventName + "has been paid.");
                this.props.history.push("/ledger");
            })
            .catch(err => console.log(err));
    };

    notify = message => {
        toast(message);
    };

    render() {
        return (
            <div>
                <h4 className="text-info text-center">{this.props.username}'s Students:</h4>
                {console.log(this.state)}

                <AddStudent></AddStudent>

                <br />

                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <div className="card" style={styles.oweHeader}>
                            <p className="lead pl-3 text-white align-middle pt-3">
                                Your Students
                            </p>
                            <table className="table table-hover">
                                <thead>
                                    <tr className="text-white">
                                        <th scope="col">Name</th>
                                        <th scope="col">Math</th>
                                        <th scope="col">History</th>
                                        <th scope="col">English</th>
                                        <th scope="col">GPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                          <Individualcard></Individualcard>
                                        
                                
                                </tbody>
                            </table>
                        </div>

                        
                    </div>
                </div>
               
            </div>
        );
    }
}

export default withRouter(Ledger);
