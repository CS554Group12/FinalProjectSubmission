import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import ShowList from './ShowList';
import PokeShow from './Show';
import Berry from './Berry';
import BerryList from './BerryList';
import MachineList from './MachineList';
import Machine from './Machine';
import HomePageCarousel from './HomePageCarousel';
//import Pokemon from './Pokemon';
//import DescriptionContainer from './DescriptionContainer';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

class ShowsContainer extends Component {
    render() {
        const {auth} = this.props;
        if (!auth.uid)
            return <Redirect to='/signin'/>

        return (<div>
            <Switch>
                <Route path="/videos/page/" exact component={ShowList}/>
                <Route path="/videos/:id" exact component={PokeShow}/>
                <Route path="/favorite/page/" exact component={BerryList}/>
                <Route path="/favorite/:id" exact component={Berry}/>
                <Route path="/recommended/page/" exact component={MachineList}/>
                <Route path="/recommended/:id" exact component={Machine}/>
                <Route path="/" component={HomePageCarousel}/>
            </Switch>
        </div>);
    }
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {auth: state.firebase.auth, profile: state.firebase.profile}
};

export default connect(mapStateToProps)(ShowsContainer);
