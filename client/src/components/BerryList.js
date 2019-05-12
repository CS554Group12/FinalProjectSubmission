import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class BerryList extends Component {
   constructor(props) {
      	super(props);
		this.searchShows = this.searchShows.bind(this);
      	this.state = {
			data: undefined,
			loading: false,
			searchTerm: undefined,
			searchData: undefined,
			currentLink: 'https://pokeapi.co/api/v2/berry',
			nextLink: undefined,
			prevLink: undefined,
			offset : 0,
			limit: 0
      };
	}
	
	async getShows() {
		try {
			console.log(this.props.match.params.page);
			if(!this.props.match.params.page)
			{
				this.offset = 0;
				const response = await axios.get(`http://localhost:3001/favorites/`);
				await this.setState({ data: response.data});
			}
			else
			{
				this.offset = this.props.match.params.page * 20;
				this.limit = 20;
				const response = await axios.get(`http://localhost:3001/favorites/`);
				await this.setState({ data: response.data});
			}
		} catch (e) {
			console.log(e);
		}
	}

	async componentDidMount() {
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
	  	let prevOffset = (this.offset - 20) / 20;
	  
	  	let next= null;
	  	let prev = null;
	  
	  	let cnt = 0;
     
	 	console.log(this.state.data);
	
      	li = 
			this.state.data && 
			this.state.data.map((shows, cnt) => (
					
			<div>
			<div className="card" >
				<Link to={`/favorite/${this.state.data && this.state.data[cnt].id}/`}>
					<li >
					<br/>
						<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3w6QYtXhSCXyAeOIxEzzhJVaOUmRAQSbK1TTw_EtJ4unPuda_TA" alt="Avatar" width="500px"/>
					<div class="container">
					<br/>
						<h4><b>{shows.Key}</b></h4> 
					</div>
					</li>
				</Link>
			</div>
			<br/>
			<br/>
			</div>
		));
 
		body =  (
			<div >
				<h1>Favorites</h1>
			<br />
			<br />
				<ul className="list-unstyled">{li}</ul>
			</div>
		);
			
     	return  body;
   }
}

export default BerryList;
