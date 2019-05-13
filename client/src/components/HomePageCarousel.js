import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
// import { Route, Switch } from 'react-router-dom';
// import ShowList from './ShowList';
// import PokeShow from './Show';
// import Pokemon from './Pokemon';
// import Berry from './Berry';
// import BerryList from './BerryList';
// import MachineList from './MachineList';
// import Machine from './Machine';
// import jumanji from '../img/jumanji.png';
// import toy_story from '../img/toy_story.png';
// import golden_eye from '../img/golden_eye.png';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

class ControlledCarousel extends Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleSelect = this.handleSelect.bind(this);
  
      this.state = {
        index: 0,
        direction: null,
      };
    }
  
    handleSelect(selectedIndex, e) {
      this.setState({
        index: selectedIndex,
        direction: e.direction,
      });
    }
  
    render() {

      const {auth} = this.props;
        if (!auth.uid)
          return <Redirect to='/signin'/>

        const { index, direction } = this.state;
        return (
        <Carousel
          activeIndex={index}
          direction={direction}
          onSelect={this.handleSelect}
          wrap = {true}
         >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={require('../img/jumanji.png')}
              alt="Jumanji (1995)"
            />
            <Carousel.Caption>
               <h3>Jumanji (1995)</h3>
               <p>PG 1995 ‧ Fantasy/Thriller ‧ 1h 44m</p>
               <p>Adventure ‧ Fantasy ‧ Family</p>
             </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={require('../img/toy_story.png')}
              alt="Toy Story (1995)"
            />
            <Carousel.Caption>
              <h3>Toy Story (1995)</h3>
              <p>G 1995 ‧ Fantasy/Adventure ‧ 1h 21m</p>
              <p>Animation ‧ Comedy ‧ Family</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={require('../img/golden_eye.png')}
              alt="GoldenEye (1995)"
            />
            <Carousel.Caption>
              <h3>GoldenEye (1995)</h3>
              <p>PG-13 1995 ‧ Thriller/Action ‧ 2h 10m</p>
              <p>Action ‧ Adventure ‧ Thriller</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      );
    }
  }

const mapStateToProps = (state) => {
    return {auth: state.firebase.auth}
};

export default connect(mapStateToProps)(ControlledCarousel); 
