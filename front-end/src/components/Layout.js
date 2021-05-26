import React from "react";
import { Layout } from "antd";
import { Link, withRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import { Navbar, NavDropdown, FormControl, Form, Nav } from 'react-bootstrap'
import { Component } from "react";
import BaseRouter from "../routes";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const { Content, Footer } = Layout;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

// 


class CustomLayout extends Component {


  constructor(props) {
    super(props)
    this.state = {
      // classes:  useStyles()
    }
  }
  render() {
    let user = this.props.user ? (this.props.user ? this.props.user : {}) : {}
    // console.log(user , "--------user, user_type", user.user_type);
    return (
      <div>

        <div className="root">
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className="menuButton" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className="title">
                <Link to="/">
                  My APP
            </Link>
              </Typography>
              {/* <Button color="inherit">Login</Button> */}
              {this.props.isAuthenticated ? (

                <div>
                  {  user && (user.user_type == 2 || user.user_type == 1) ?
                    <Link to="/users">
                      <Button key="1" className="ml-2">
                        Users
                    </Button>
                    </Link> : ""
                  }
                  {
                    user && user.user_type == 1 ?
                      <Link to="/new-admin">
                        <Button key="1" className="ml-2">
                          New Admin
                    </Button>
                      </Link> : ""
                  }


                  <Link to="/profile">
                    <Button key="1" className="ml-2">
                      Profile
                    </Button>
                  </Link>


                  <Button key="2" onClick={this.props.logout} className="ml-2">
                    Logout
                    </Button>

                </div>
              ) : (
                <div>
                  <Link to="/login">
                    <Button color="inherit" key="2" className="ml-2">
                      Login
                          </Button>
                  </Link>
                  <Link to="/signup">
                    <Button color="inherit" key="3" className="ml-2">
                      Signup
                                 </Button>
                  </Link>
                </div>

              )}
            </Toolbar>
          </AppBar>
        </div>

        <Layout className="layout">

          <Content >
            <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
              {/* {this.props.children} */}
              <BaseRouter {...this.props} />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            My App
        </Footer>
        </Layout>
        {/* <div>
          {this.props.children}
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
