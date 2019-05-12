import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowList from './ShowList';
import PokeShow from './Show';
import Pokemon from './Pokemon';
import Berry from './Berry';
import BerryList from './BerryList';
import MachineList from './MachineList';
import Machine from './Machine';
import ErrorContainer from './ErrorContainer';
import DescriptionContainer from './DescriptionContainer';

class ShowsContainer extends Component {
   render() {
      return (
         <div>
            <Switch>
               <Route path="/videos/page/" exact component={ShowList} />
               <Route path="/videos/:id" exact component={PokeShow} />
               <Route path="/favorite/page/" exact component={BerryList} />
               <Route path="/favorite/:id" exact component={Berry} />
               <Route path="/recommended/page/" exact component={MachineList} />
               <Route path="/recommended/:id" exact component={Machine} />
               <Route path="/" component={DescriptionContainer} />
               <Route path="*" component={ErrorContainer} />
            </Switch>
         </div>
      );
   }
}

export default ShowsContainer;
