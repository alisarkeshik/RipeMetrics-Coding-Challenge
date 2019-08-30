import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import axios from "axios"
import logo from "./logo.png"
import { returnStatement } from "@babel/types";
import YourStudents from "../components/YourStudents"


let totalOwed = 0;
let totalPaid = 0;

class Home extends Component {
    state = {
        paid: [],
        owed: []
    }


    componentDidMount() {

        this.getNewEvent(this.props.username);
    }
    componentWillReceiveProps(props) {

        this.getNewEvent(props.username);
    }
    getNewEvent(username) {
        // if (this.props.username && (!this.state.owed.length || !this.state.paid.length)){
        //     return;
        // }

        console.log(username)

        Promise.all([
            axios.get("/user/findOwedByUserId/" + username),
            axios.get("/user/findYouOwedByUserId/" + username)
        ])
            .then(resultArray => {
                this.setState({
                    ...this.state,
                    owed: resultArray[0].data,
                    paid: resultArray[1].data
                })
            });



    }
    setTotals() {
        totalOwed = 0;
        totalPaid = 0;
        this.state.owed.map(user => {
            totalOwed += user.amount
            if (user.isPaid === true) {
                
                totalOwed -= user.amount;
            }
            return totalOwed 
        })
        this.state.paid.forEach(user => {
            totalPaid += user.amount
            if (user.isPaid === true) {
                
                totalPaid -= user.amount;
            }
            return totalPaid
        })

        // console.log(this.state);
    }

    render() {
        // console.log(this.props)
        return (

            <div>
                {this.setTotals()}
                {this.props.loggedIn ? (
                    <YourStudents></YourStudents>
                    
                ) : (
                        <div className="row">
                            <div className="jumbotron rounded col-lg-16 mx-auto">
                                <img src={logo} height={125} width={100} />
                                <br /> <br />
                                <h1 className="display-5 text-primary text-left">Prudent Student</h1>

                                <p className="lead text-left">Keep track of your students, set goals, and create metrics for improvement.</p>
                                <hr className="my-4 text-left" />
                                {/* <p className="text-left">It uses utility classes for typography and spacing to space content out within the larger container.</p> */}
                                <p className="lead text-left">
                                    <Link className="btn btn-primary bg-primary btn-lg" to="/signup" role="button">Sign Up</Link>
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        );
    }
}

export default Home;