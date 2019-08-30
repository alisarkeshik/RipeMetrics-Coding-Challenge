import React, { Component } from "react";
import Individualcard from "../components/individualCard";
import axios from "axios";
import { Table } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import AddStudent from "./AddStudent";
import data from "./students.json";

const styles = {
    oweHeader: {
        backgroundColor: "#4C7300"
    },
    oweHeader2: {
        backgroundColor: "#4C7300"
    }
};

class YourStudents extends Component {
    state = {
        data: [],
        name: [],
        science: [],
        math: [],
        english: [],
        history: []
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
    

    handleClick = (username, name, math, history, science, english) => {
        console.log("click handling! ", name, math, history, science, english);

        const eventToUpdate = {
            userId: username,
            name: name,
            science: science,
            math: math,
            english: english,
            history: history,

        };

      

        console.log(eventToUpdate);
        axios           
        .post("/user/pay", eventToUpdate)
            .then(response => {
                console.log("there goes payment!");
                this.notify(history + "has been paname.");
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
                            <p className="lead pl-3 text-white align-mnamedle pt-3">
                                Your Students
                            </p>
                            <table className="table table-hover">
                                <thead>
                                    <tr className="text-white">
                                        <th scope="col">Name</th>
                                        <th scope="col">Math</th>
                                        <th scope="col">History</th>
                                        <th scope="col">Science</th>
                                        <th scope="col">English</th>
                                        <th scope="col">GPA</th>
                                    </tr>
                                </thead>
                                <tbody> {
                                    this.state.data.map(element => (
                                                <Individualcard>
                                                key={element.id}
                                                id={element.id}
                                                name={element.name}
                                                grades={element.grades}
                                                </Individualcard>
                                    ))
                                }
                            
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-md-11 mx-auto">
                        {this.setTotals()}

                        <TotalBalanceCard
                            userOwes={totalOwed.toFixed(2)}
                            userIsOwed={totalPaname.toFixed(2)}
                            balance={(totalPaname - totalOwed).toFixed(2)}
                        />
                        {console.log(totalOwed)}
                    </div>
                </div> */}
            </div>
        );
    }
}

export default withRouter(YourStudents);
