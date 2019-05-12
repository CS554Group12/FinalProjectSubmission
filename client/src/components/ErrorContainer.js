import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowList from './ShowList';
import PokeShow from './Show';
import Pokemon from './Pokemon';
import Berry from './Berry';
import BerryList from './BerryList';
import MachineList from './MachineList';
import Machine from './Machine';

class ErrorContainer extends Component {
   render() {
      return (
         <div>
				<h1>Error 404: Page Not Found</h1>
         </div>
      );
   }
}

export default ErrorContainer;