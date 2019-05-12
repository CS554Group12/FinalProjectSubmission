import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class ShowList extends Component {
   constructor(props) {
      super(props);
	  
	  this.searchShows = this.searchShows.bind(this);
	  
      this.state = {
         data: undefined,
         loading: false,
         searchTerm: undefined,
         searchData: undefined,
         currentLink: 'https://pokeapi.co/api/v2/pokemon',
         nextLink: undefined,
         prevLink: undefined,
         offset : 0,
         limit: 0
      };
   }

   async getShows() {
      try {
         console.log(this.props.match.params.id);
            if(!this.props.match.params.id)
            {
               this.offset = 0;
               const response = await axios.get(this.state.currentLink);
               await this.setState({ data: response.data, nextLink: response.data.next, prevLink: response.data.previous});
            }
            else
            {
               this.offset = this.props.match.params.id * 20;
               this.limit = 20;
               const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.limit}`);
               await this.setState({ data: response.data, nextLink: response.data.next, prevLink: response.data.previous});
            }
         } catch (e) {
            console.log(e);
      }
   }

   async componentDidMount() {
      await this.getShows();
   }
   
   async componentWillUpdate() {
      await this.getShows();
   }

   handleChange = (e) => {
      let value = e.target.value;
      this.setState({ currentLink: value }, () => {
         this.getShows();
      });
   }
      
   onSubmit(e) {
         e.preventDefault();
   }

   searchShows(){
      try {
         //const response = await axios.get('https://pokeapi.co/api/v2/pokemon' + this.state.searchTerm);
      const response =  axios.get(this.state.nextLink);
         this.setState({searchData: response.data, searchTerm: true});

      } catch (e) {
         console.log(e);
      }
   }
   render() {
      let body = null;
      let nextPage = null;
      let previousPage = null;
      let li = null;
      let nextOffset = (this.offset + 20) / 20;
   
      let cnt = 0;
      if (this.state.searchTerm) {
         
         //console.log(this.props.match.params.page);
         li =
            this.state.data &&
            this.state.data.results.map((shows, cnt) => (
               <li>
                  <Link to={``}>{shows.name}</Link>
               </li>
            ));
      } else {
         li = 
            this.state.data && 
            this.state.data.results.map((shows, cnt) => (
               <li >
               
                  <Link to={`/shows/${cnt}/`}>{shows.name}</Link>
               </li>
            ));
         }
      body =  (
         <div>
            <ul className="list-unstyled">{li}</ul>
            <div>
               <Link to={`/pokemon/page/${nextOffset}`}>Next     </Link>
               <h1>{this.state.nextLink}</h1>
            </div>
         </div>
      );

      return  body;
   }
}

export default ShowList;
