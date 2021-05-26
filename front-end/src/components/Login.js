import React from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import { Field, reduxForm } from 'redux-form'
import { Redirect } from "react-router-dom";
import { TextField } from "@material-ui/core"
// const FormItem = Form.Item;
// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class NormalLoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    // this.submitForm = this.submitForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  submitForm = (data) => {
    // console.log(data)
  }

  handleSubmit(e) {
    if (this.props.valid) {
      this.props.onAuth(e.email, e.password)
    }
    // });
  };

  componentWillReceiveProps(nextProps) {

  }


  handleChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value })
    // console.log(this.state);
  }

  renderError = ({ error, touched }) => {
    if (error && touched) {
      return (<span className=""> {error} </span>)
    }
    return ''
  }

  renderField = ({ input, label, name, type, meta }) => {

    return (<div>
      {/* <label>{label}</label> */}
      <div className='form-group'>

      <TextField error={this.renderError(meta) == '' ? false : true} id="standard-error-helper-text" fullWidth={true}
          {...input} type={type} label={label} helperText={this.renderError(meta)}
                  />
        {/* <input  className={meta.touched && meta.error ? 'is-invalid form-control' : 'form-control'} /> */}
        {/* {this.renderError(meta)} */}
      </div>
    </div>
    )
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { token, loading, handleSubmit } = this.props
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    if (!loading && token) {
      return (
        <Redirect to={`/`} />
      )

    }

    return (
      <div>
        <div className="col-sm-8 col-sm offset-2">
          {errorMessage}
          {this.props.loading ? (

            'Loading...'
          ) : (
              <div className="form-group">
                {/* <Form onSubmit={this.handleSubmit} className="login-form">
                                
                                 <label>Email</label>
                 <div className='form-group'>
                                <FormControl type="email" placeholder="Email" value={this.state.email}  onChange={this.handleChangeEmail} name="email" required className="mr-sm-2" />
                                </div>
                              
                  
                              
                                 <label>Password</label>
                 <div className='form-group'>
                                
                                  <FormControl type="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword} name="password" required className="mr-sm-2" />
                                  </div>
                            
                  
                                <Button
                                  type="submit" style={{ marginRight: "10px" }}
                                >
                                  Login
                                </Button>
                                Or
                                <NavLink style={{ marginRight: "10px" }} to="/signup/">
                                  {" "}
                                  signup
                                </NavLink>
                            </Form>*/}
                {
                  <form onSubmit={handleSubmit(this.handleSubmit)}>

                  
                  <Field
                      name="email"
                      component={this.renderField}
                      label="Email"
                      onChange={this.handleChangeEmail}
                      type="email"
                    />
                    <Field
                      name="password"
                      component={this.renderField}
                      label="Password"
                      onChange={this.handleChangePassword}
                      type="password"
                    />
                    <div>
                      <button type="submit" className="btn btn-primary">
                        Login
                        </button>

                    </div>
                  </form>}
              </div>
            )}
        </div>
      </div>
    );
  }
}

const validate = val => {
  let errors = {}
  if (!val.email) {
    errors.email = "Email is required";
  }
  if (!val.password) {
    errors.password = "Password is required";
  }

  return errors;
}
// const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password))
  };
};


let WraprLogginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(NormalLoginForm);

// module.exports = NormalLoginForm

export default reduxForm({
  form: 'LoginForm', // a unique identifier for this form,
  validate
})(WraprLogginForm)
