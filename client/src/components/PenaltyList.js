import React, {Component} from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import CardView from "./CardView";

class PenaltyList extends Component{
    render(){
        console.log("rendering penalty list for : " + this.props.penalties);

        return (
            <div className="penaltyList">
                <h2>PENALTY CARDS</h2>
                {
                    this.props.penalties.map((penaltySet) =>{
                        return penaltySet.cards.map((card) => {
                            console.log(card.name);
                            //{ return card.name};
                            return <CardView
                                        key={card.id}
                                        id={card.id}
                                        owner={this.props.owner}
                                        name={card.name}
                                        effects={card.effects}
                                    />
                        })
                    })
                }
                <Button>OK</Button>
            </div>
        );
    }


}


PenaltyList.propTypes = {
    penalties: PropTypes.array.isRequired
};


export default PenaltyList;