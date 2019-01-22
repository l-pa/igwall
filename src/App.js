import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import styled from 'styled-components'
import Profile from './Profile'
import Follow from './Follow'
import Map from './Map'
import './App.css'

const Container = styled.body`
  text-align: center;
`;

const Title = styled.h1`
margin-top:1em;
  font-size: 3em;
`;

const Input = styled.input.attrs({
  type: 'text',
  size: props => (props.small ? 5 : undefined),
})`
  border-radius: 3px;
  border: 1px solid palevioletred;
  margin: 0 0 1em;
  padding: ${props => props.padding};

  ::placeholder {
    color: palevioletred;
  }
`

class App extends Component {
  constructor(props) {
    super(props);
    this.doSearch = this.doSearch.bind(this)
    this.timeout = 0;
    this.state = {
      id: '',
    };
  }


  doSearch(evt) {
    var searchText = evt.target.value; // this is the search text
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ id: searchText });
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <Container>
          <Title>Instagram mapboard</Title>
          <Input placeholder="ID" onChange={evt => this.doSearch(evt)} />
          <Profile id={this.state.id}></Profile>
        </Container>
        <Map id={this.state.id}></Map>
      </div>
    );
  }
}

export default App;
