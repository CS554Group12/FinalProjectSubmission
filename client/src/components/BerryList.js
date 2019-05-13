import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

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
            offset: 0,
            limit: 0
        };
    }

    async getShows() {
        try {
            console.log(this.props.match.params.page);
            if (!this.props.match.params.page) {
                this.offset = 0;
                const response = await axios.get(`http://localhost:3001/favorites/`);
                await this.setState({data: response.data});
            } else {
                this.offset = this.props.match.params.page * 20;
                this.limit = 20;
                const response = await axios.get(`http://localhost:3001/favorites/`);
                await this.setState({data: response.data});
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
            axios.delete(`http://localhost:3001/favorites/` + value).then(response => {
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

    onSubmit(e) {
        e.preventDefault();
    }

    searchShows() {
        try {

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

        let next = null;
        let prev = null;

        let cnt = 0;

        console.log(this.state.data);

        li = this.state.data && this.state.data.map((shows, cnt) => (<div>
            <div className="card">
                <div className="favorites-btn">
                    <label for={shows.id} className="favorites-btn">
                        <input type="checkbox" id={shows.id} name={shows.Key} value={shows.id} onClick={this.handleClick} defaultChecked="defaultChecked"/>
                        <i className="glyphicon glyphicon-star-empty"></i>
                        <i className="glyphicon glyphicon-star"></i>
                        <span className="add-to-favorites">Favorites</span>
                    </label>
                </div>
                <Link to={`/favorite/${this.state.data && this.state.data[cnt].id}/`}>
                    <li >
                        <br/>
                        <img src={shows.posterUrl} alt="Avatar" width="500px"/>
                        <div class="container">
                            <br/>
                            <h4>
                                <b>{shows.Key}</b>
                            </h4>
                        </div>
                    </li>
                </Link>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>));

        body = (<div >
            <h1>Favorites</h1>
            <br/>
            <br/>
            <ul className="list-unstyled">{li}</ul>
        </div>);

        return body;
    }
}


const mapStateToProps = (state) => {
    return {auth: state.firebase.auth}
};

export default connect(mapStateToProps)(BerryList);
