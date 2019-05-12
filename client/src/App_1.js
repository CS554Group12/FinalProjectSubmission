import React, { Component } from 'react';
import logo from './img/netflix.png';
import './App.css';
import axios from 'axios';
import ShowsContainer from './components/ShowsContainer';
import ErrorContainer from './components/ErrorContainer';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
	
	   constructor(props) {
      super(props);
      this.state = {
         data: undefined,
		 data1: undefined,
         loading: false
      };
   }
   
      componentWillMount() {
      this.getShow();
   }

   
   async getShow() {
      this.setState({
         loading: true
      });
      try {
         const response = await axios.get(
             `http://localhost:3001/loggedUser/`
         );
		
		
         console.log(response.data);
         this.setState({
            
			data: response.data,
            loading: false
         });
      } catch (e) {
         console.log(`error ${e}`);
      }
   }
   
   
   
   render() {
      return (
         <Router>
            <div className="App">
               <header className="App-header">
			   
			   <br/>
			   <br/>
                  <h1 className="App-title"> </h1>
                  <Link className="showlink" to="/videos/page/">
                     All Videos
                  </Link>
				  
				  <Link className="showlink" to="/favorite/page/">
                     Favorites
                  </Link>
				  
				  <Link className="showlink" to="/recommended/page/">
                     Recommended Videos
                  </Link>
				  <br/>
				  <br/>
				  
               </header>
               <br/>
				
               <br />
               <div className="App-body">
                 
				  
                  <Route path="/" component={ShowsContainer} />

				  
				  
               </div>
            </div>
         </Router>
      );
   }
}

export default App;
