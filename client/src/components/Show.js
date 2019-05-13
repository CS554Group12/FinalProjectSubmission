import React, {Component} from 'react';
import axios from 'axios';
import noImage from '../img/download.jpeg';
import videoFile from './SampleVideo_1280x720_1mb.mp4';
import '../App.css';
import {Player} from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

class Show extends Component {
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
        this.setState({loading: true});
        try {
            const response = await axios.get(`http://localhost:3001/video/${this.props.match.params.id}`);

            const response1 = await axios.get(`http://localhost:3001/video/${this.props.match.params.id}`);

            console.log(response1);
            this.setState({data1: response1.data, loading: false});
        } catch (e) {
            console.log(`error ${e}`);
        }
    }
    render() {
        const {auth} = this.props;
        if (!auth.uid)
            return <Redirect to='/signin'/>

        let body = null;
        const regex = /(<([^>]+)>)/gi;

        if (this.state.loading) {
            body = (<div>
                <h1>Please Wait...</h1>
                <br/>
            </div>);
        } else if (this.state.error) {
            body = (<div>
                <h1>{this.state.error}</h1>
            </div>);
        } else {
            body = (<div className="megaCard">

                <div class="megaContainer">
                    <br/>
                    <h2>
                        <b>{this.state.data1.Key}</b>
                    </h2>
                    <br/>
                </div>

                <Player class="video-react" playsInline="playsInline" poster={this.state.data1.posterUrl} src={this.state.data1["url"]} type="video/mp4" fluid={false} width={400} height={400} marginLeft="200" marginRight="200" marginBottom="200" marginTop="200"/>
                <br/>
                <br/>
                <br/>
                <br/>

                <h3>Genre</h3>
                <h5 >
                    {this.state.data1.Genre}
                </h5>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>);
        }
        return body;
    }
}

const mapStateToProps = (state) => {
    return {auth: state.firebase.auth}
};

export default connect(mapStateToProps)(Show);
