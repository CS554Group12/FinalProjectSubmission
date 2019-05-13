import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import '../App.css';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

class ShowList extends Component {
    constructor(props) {
        super(props);
        this.searchShows = this.searchShows.bind(this);
        this.state = {
            data: undefined,
            isfavorite: undefined,
            loading: false,
            searchTerm: undefined,
            searchData: undefined,
            currentLink: '',
            nextLink: undefined,
            prevLink: undefined,
            offset: 0,
            limit: 0
        };
        this.selected = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async getShows() {
        try {
            console.log(this.props.match.params.page);
            this.offset = 0;
            const response = await axios.get(`http://localhost:3001/video`);
            const favorites = await axios.get(`http://localhost:3001/favorites`);
            // console.log(favorites.data);
            await this.setState({data: response.data, isfavorite: favorites.data});
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidMount() {
        await this.getShows();
    }

    handleChange = (e) => {
        let value = e.target.value;
        this.setState({
            currentLink: value
        }, () => {
            this.getShows();
        });
    }

    handleClick = (e) => {
        let value = e.target.value;
        let isChecked = e.target.checked;
        // console.log(value);
        // console.log(isChecked);

        if (isChecked === true) {
            axios.post(`http://localhost:3001/favorites/` + value).then(response => {
                console.log(response.data);
            });
        }

        if (isChecked === false) {
            axios.delete(`http://localhost:3001/favorites/` + value).then(response => {
                console.log(response.data);
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
    }

    searchShows() {
        try {
            //const response = await axios.get('https://pokeapi.co/api/v2/pokemon' + this.state.searchTerm);
            const response = axios.get(this.state.nextLink);
            this.setState({searchData: response.data, searchTerm: true});
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {auth} = this.props;
        if (!auth.uid)
            return <Redirect to='/signin'/>
        let body = null;
        let nextPage = null;
        let previousPage = null;
        let li = null;
        let nextOffset = (this.offset + 20) / 20;
        let prevOffset = (this.offset - 20) / 20;
        let isfavorite;
        if (this.offset === 0) {
            prevOffset = 0;
        }

        let next = null;
        let prev = null;
        let cnt = 0;

        if (this.state.data && this.state.isfavorite) {
            let favoritesList = this.state.isfavorite.map(videos => {
                return videos.id;
            });
            // console.log(favoritesList);
            li = this.state.data && this.state.data.map((shows, cnt) => {
                for (var i = 0; i < favoritesList.length; i++) {
                    if (favoritesList[i] === shows.id) {
                        return (<div>
                            <li key={shows.id}>
                                <div className="card">
                                    <div className="favorites-btn">
                                        <label for={shows.id} className="favorites-btn">
                                            <input type="checkbox" id={shows.id} name={shows.Key} value={shows.id} onClick={this.handleClick} defaultChecked="defaultChecked"/>
                                            <i className="glyphicon glyphicon-star-empty"></i>
                                            <i className="glyphicon glyphicon-star"></i>
                                            <span className="add-to-favorites">Favorites</span>
                                        </label>
                                    </div>

                                    <Link to={`/videos/${shows.id}/`}>
                                        <br/>
                                        <img src={shows.posterUrl} alt="Avatar" width="500px"/>
                                        <div className="container">
                                            <br/>
                                            <h4>{shows.Key}</h4>
                                        </div>
                                    </Link>

                                </div>

                            </li>
                            <br/>

                        </div>);
                    }
                }

                return (<li key={shows.id}>
                    <div className="card">
                        <div className="favorites-btn">
                            <label for={shows.id} className="favorites-btn">
                                <input type="checkbox" id={shows.id} name={shows.Key} value={shows.id} onClick={this.handleClick}/>
                                <i className="glyphicon glyphicon-star-empty"></i>
                                <i className="glyphicon glyphicon-star"></i>
                                <span className="add-to-favorites">Favorites</span>
                            </label>
                        </div>

                        <Link to={`/videos/${shows.id}/`}>
                            <br/>
                            <img src={shows.posterUrl} alt="Avatar" width="500px"/>
                            <div className="container">
                                <br/>
                                <h4>{shows.Key}</h4>
                            </div>
                        </Link>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </li>);
            });

            body = (<div>
                <h1>Videos</h1>
                <br/>
                <br/>
                <ul className="list-unstyled">{li}</ul>
            </div>);
        }
        return body;
    }
}

const mapStateToProps = (state) => {
    return {auth: state.firebase.auth}
};

export default connect(mapStateToProps)(ShowList);
