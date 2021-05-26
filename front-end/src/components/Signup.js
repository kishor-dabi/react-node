import React from "react";
import { Form, Icon, Button } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "../store/actions/auth";
import { Field, reduxForm } from "redux-form";
// import Snackbar from 'material-ui/Snackbar'
import { emailFieldValidation, Required, phoneNumberPattern } from "../validation"

// const FormItem = Form.Item;
// const Option = Select.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    error:"",
    showError:false
  };

  handleSubmitForm = e => {
    // e.preventDefault();
    // return
    if (this.props.valid) {

      this.props.onAuth(
        e.first_name,
        e.email,
        e.password,
        e.phone_number
      );
      //     // this.props.history.push("/");
      //   }
    }
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  renderError = ({ error, touched }) => {
    if (error && touched) {
      return (<span className="invalid-feedback"> {error} </span>)
    }
    return ''
  }

  renderField = ({ input, label, name, type, meta }) => {
    return (<div>
      <label>{label}</label>
      <div className='form-group'>
        <input {...input} type={type} className={meta.touched && meta.error ? 'is-invalid form-control' : 'form-control'} />
        {this.renderError(meta)}
      </div>
    </div>
    )
  }
  componentWillReceiveProps(nextProps) {

    // const { clearError } = this.props
    if (this.props.error ) {
      this.setState({error: this.props.error, showError: true })
      // clearError();
    //   this.props.getBrand()
    }
  }
  
  handleRequestClose = () => {
    this.setState({
       addSnackbar: false,
       sOpen: false,
       error: ""
    })
 }



  render() {
    const { handleSubmit } = this.props;

    return (
      <div>

      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <div>
       
          <Field
            name="first_name"
            component={this.renderField}
            label="First Name"
            type="name" required="true"
            />

          <Field
            name="email"
            component={this.renderField}
            label="Email" validate={[emailFieldValidation, Required]}
            type="email"
            />
          <Field
            name="password"
            component={this.renderField}
            label="Password"
            type="password"
          />
          <Field
            name="phone_number" validate={phoneNumberPattern}
            component={this.renderField}
            label="Phone"
            type="text"
            />



            </div>

            <Button
              type="primary" className="btn btn-primary"
              htmlType="submit"
              style={{ marginRight: "10px" }}
              >
              Signup
              </Button>
              Or
            <NavLink style={{ marginRight: "10px" }} to="/login/">
              login
              </NavLink>
            {/* </FormItem> */}
          </form>
          
          {
            this.props.error ? <div  style={{textAlign:'center'}} >
              {this.props.error}
            </div> : ""
          }
          
        </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error
  };
};


const validate = val => {
  let errors = {}
  if (!val.email) {
    errors.email = "Email is required";
  }
  if (!val.first_name) {
    errors.first_name = "First Name is required";
  }
  if (!val.password) {
    errors.password = "Password is required";
  }
 

  return errors;
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, email, password1, password2, is_student) =>
      dispatch(
        actions.authSignup(username, email, password1, password2, is_student)
      ),
    clearError:() =>{
      // dispatch(
      //   actions.clearError()
      // )
    }
  };
};

let form = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistrationForm);


export default reduxForm({
  form: 'SignUpForm', // a unique identifier for this form,
  validate
})(form)
