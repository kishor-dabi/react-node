import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as actions from "../store/actions/dashboard";
import * as Authactions from "../store/actions/auth";
import Hoc from "../hoc/hoc";
import Button from "@material-ui/core/Button"
import Paper from '@material-ui/core/Paper';

class Dashboard extends React.PureComponent {


  componenWillMount() {

  }

  componentDidMount() {
    // if (this.props.token !== undefined && this.props.token !== null) {
    // this.props.getDrList(this.props.token);
    this.props.getUserProfile();
    // }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        this.props.getDrList(newProps.token);
        this.props.getUserProfile();
      }
    }
  }

  renderItem(item) {
    return ''
  }



  render() {
    const { loginUser } = this.props
    


    return (
      <Hoc>
        {this.props.loading ? (
          'loading.....'
        ) : (
             <div className="card container" style={{width: "18rem"}}>
              <img className="card-img-top" src="..." alt="Img" height="200px"/>
              <div className="card-body">
                <h5 className="card-title">Hello  { loginUser.full_name }</h5>
                <p className="card-text">Welcome to dashboard</p>
                <Link to="/profile" className="btn btn-primary">Go somewhere</Link>
              </div>

              </div>
          )
          
          }


      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    data_list: state.dashboard.all_list,
    loading: state.dashboard.loading,
    loginUser: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    
    getUserProfile :() => dispatch(Authactions.getUserProfile())
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));
