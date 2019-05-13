import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import ShowList from './ShowList';
import PokeShow from './Show';
import Pokemon from './Pokemon';
import Berry from './Berry';
import BerryList from './BerryList';
import MachineList from './MachineList';
import Machine from './Machine';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

class DescriptionContainer extends Component {
    render() {
        const {auth} = this.props;
        if (!auth.uid)
            return <Redirect to='/signin'/>

        return (<div>
            <div>
                <h1>Pokemons</h1>
                <br/>
                <br/>
                <h4>Pokémon, also known as Pocket Monsters in Japan, is a media franchise managed by The Pokémon Company, a Japanese consortium between Nintendo, Game Freak, and Creatures. The franchise copyright is shared by all three companies, but Nintendo is the sole owner of the trademark.The franchise was created by Satoshi Tajiri in 1995,and is centered on fictional creatures called "Pokémon", which humans, known as Pokémon Trainers, catch and train to battle each other for sport. The English slogan for the franchise is "Gotta Catch 'Em All".Works within the franchise are set in the Pokémon universe.</h4>
            </div>
            <br/>
            <br/>

            <div>
                <h1>Berries</h1>
                <br/>
                <br/>
                <h4>A berry is a small, pulpy, and often edible fruit. Typically, berries are juicy, rounded, brightly colored, sweet or sour, and do not have a stone or pit, although many pips or seeds may be present. Common examples are strawberries, raspberries, blueberries, blackberries, red currants, white currants and blackcurrants.In Britain, soft fruit is a horticultural term for such fruits.</h4>
            </div>
            <br/>
            <br/>

            <div>
                <h1>Machines</h1>
                <br/>
                <br/>
                <h4>A machine (or mechanical device) is a mechanical structure that uses power to apply forces and control movement to perform an intended action. Machines can be driven by animals and people, by natural forces such as wind and water, and by chemical, thermal, or electrical power, and include a system of mechanisms that shape the actuator input to achieve a specific application of output forces and movement. They can also include computers and sensors that monitor performance and plan movement, often called mechanical systems.</h4>
            </div>
        </div>);
    }
}

const mapStateToProps = (state) => {
    return {auth: state.firebase.auth}
};

export default connect(mapStateToProps)(DescriptionContainer);
