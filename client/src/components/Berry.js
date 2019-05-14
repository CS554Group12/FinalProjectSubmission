import React, { Component } from 'react';
import axios from 'axios';
import noImage from '../img/download.jpeg';

import '../App.css';

import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";

class Berry extends Component {
   constructor(props) {
      super(props);
      this.state = {
         data: undefined,
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
            `http://localhost:3001/video/${this.props.match.params.id}`
         );
         console.log(response);
         this.setState({
            data: response.data,
            loading: false
         });
      } catch (e) {
         console.log(`error ${e}`);
      }
   }
   render() {
      let body = null;
      const regex = /(<([^>]+)>)/gi;
      
      if (this.state.loading) {
         body = (
            <div>
               <h1>Please Wait...</h1>
               <br />
               Loading...
            </div>
         );
      } else if (this.state.error) {
         body = (
            <div>
               <h1>{this.state.error}</h1>
            </div>
         );
      } else {
         body = (
		      <div className="megaCard" >
               <div className="megaContainer">
               <br/>
                  <h2><b>{this.state.data && this.state.data.Key}</b></h2> 
               <br/>
               </div>
		         <Player class="video-react"
                  playsInline
                  poster={this.state.data.posterUrl}
                  src={this.state.data["url"]} type="video/mp4"
                  fluid={false}
                  width={400}
                  height={400}
                  marginLeft="200"
                  marginRight="200"
                  marginBottom="200"
                  marginTop="200"
               />
               <br />
               <br />
               <br />
               <br />
			   <div className="container">
               <h3>Genre</h3>	
	     <h5 >
                  {this.state.data.Genre}
               </h5>
			   </div>
					<br />
               <br />
               <br />
               <br />
		      </div>
         );
      };
      return body;
   }
}

export default Berry;

