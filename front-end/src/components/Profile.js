import React from "react";
import { connect } from "react-redux";
import Hoc from "../hoc/hoc";

class Profile extends React.PureComponent {
  

  render() {
    
    return (
      <Hoc>
        {this.props.loading ? (
          ""
        ) : (
          <Hoc>
            <h1>Hi {this.props.username}</h1>
            <div className="card container" style={{width: "18rem"}}>
              <img className="card-img-top" src="..." alt="Img" height="200px"/>
              <div className="card-body">
                <h5 className="card-title">Name :  { this.props.loginUser ? this.props.loginUser.full_name : "" }</h5>
                <p className="card-text">Email : { this.props.loginUser ? this.props.loginUser.email : "" }</p>
                <p className="card-text">Contact : { this.props.loginUser ? this.props.loginUser.phone_number : "" }</p>
              </div>

              </div>
          </Hoc>
        )}
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    loginUser: state.auth.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
