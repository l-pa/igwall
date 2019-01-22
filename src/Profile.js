import React, { Component } from 'react';
import styled from 'styled-components'
import { Spinner, Badge } from 'reactstrap';

const Username = styled.h3`
  text-size: 7em;
  padding: 0.5em;
  margin 0;
  color: palevioletred;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

const Bio = styled.p`
  text-size: 1em;
  padding: 0.5em;
  margin: 0;

  color: palevioletred;
  background: papayawhip;
  border: none;
  border-radius: 3px;

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


class Profile extends Component {
    constructor(props) {
        super(props);
        //     this.fetchData = this.fetchData.bind(this)
        this.state = {
            id: '',
            name: '',
            bio: '',
            profilePicUrl: '',
            isLoaded: true,
            private: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isLoaded: false
        });
        this.setState({ id: nextProps.id, isLoaded: false });
        this.fetchData(nextProps.id)
    }

    componentDidMount() {

    }

    fetchData(id) {
        console.log("https://igwall-backend.herokuapp.com/user/" + id);
        var options = {
            method: 'get',
            headers: {
                "Access-Control-Request-Headers": "*",
                "Access-Control-Request-Method": "*"
            },
        }


        fetch("https://igwall-backend.herokuapp.com/user/" + id, options)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        name: result.user.username,
                        bio: result.user.biography,
                        profilePicUrl: result.user.profile_pic_url,
                        isLoaded: true,
                        private: result.user.is_private
                    });
                    //console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    this.setState({
                        isLoaded: false
                    });
                }
            )
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div className="profile">
                    <Spinner type="grow" color="primary" />
                </div>
            );

        }
        else {
            if (this.state.private) {
                return (
                    <div className="profile">
                        <Username>{this.state.name}<Image src={this.state.profilePicUrl} onError={(e) => { e.target.onerror = null; e.target.src = "https://www.kuleuven.be/studentenvoorzieningen/kot-leuven/icoontjes/question-mark-on-a-circular-black-background.png/image" }}></Image><Badge color="secondary">Private</Badge></Username>
                    </div>
                );
            }
            else {
                return (
                    <div className="profile">
                        <Username>{this.state.name}<Image src={this.state.profilePicUrl} onError={(e) => { e.target.onerror = null; e.target.src = "https://www.kuleuven.be/studentenvoorzieningen/kot-leuven/icoontjes/question-mark-on-a-circular-black-background.png/image" }}></Image></Username>
                    </div>
                );
            }

        }
    }
}

export default Profile;
