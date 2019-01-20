import React, { Component } from 'react';
import styled from 'styled-components'
import { Container, Row, Col, Spinner } from 'reactstrap';
import LazyLoad from 'react-lazyload';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const Title = styled.h2`
    text-size: 1em;
`;

const Image = styled.img`
    border-radius: 50%;
    width: 75px;
    height: 75px;
    margin 0.5em;
    transition: transform .2s; /* Animation */

    &:hover ${Image} {
        transform: scale(2); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
      }
`;



class Follow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followingUsers: [],
            followersUsers: [],
            isLoaded: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ id: nextProps.id, isLoaded: false });
        this.fetchData(nextProps.id)
    }


    componentDidMount() {

    }

    fetchData(id) {
        var options = {
            method: 'get',
            headers: {
                "Access-Control-Request-Headers": "*",
                "Access-Control-Request-Method": "*"
            },
        }

        fetch("http://localhost:5000/user/" + id + "/following", options)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        followingUsers: result.users,
                        isLoaded: true
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    this.setState({
                        isLoaded: true,
                    });
                }
            )

        fetch("http://localhost:5000/user/" + id + "/followers", options)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        followersUsers: result.users,
                        isLoaded: true
                    });
                    console.log(result.users);

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    this.setState({
                        isLoaded: true,
                    });
                    /*
                                    {followers}
                                    {following}
                    */
                }
            )

    }

    render() {

        let followers = this.state.followersUsers.map((el, i) => (
            <LazyLoad height={50}><a target="_blank" rel="noopener noreferrer" href={"https://instagram.com/" + el['username']}><Image key={i} className='images' src={el['profile_pic_url']} /></a></LazyLoad>
        ))

        let following = this.state.followingUsers.map((el, i) => (
            <LazyLoad height={50}><a target="_blank" rel="noopener noreferrer" href={"https://instagram.com/" + el['username']} > <Image key={i} className='images' src={el['profile_pic_url']} /></ a></LazyLoad>
        ))


        if (!this.state.isLoaded) {
            return <Spinner color="primary" />
        } else {
            return (
                <Row>
                    <Col>
                        <Title>Followers</Title>
                        {followers}
                    </Col>
                    <Col>

                    </Col>
                    <Col>
                        <Title>Followings</Title>
                        {following}
                    </Col>
                </Row>
            );
        }
    }
}

export default Follow;
