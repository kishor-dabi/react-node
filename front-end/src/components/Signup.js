import React from "react";
import { Form, Icon } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "../store/actions/auth";
import { Field, reduxForm } from "redux-form";
import { emailFieldValidation, Required, phoneNumberPattern } from "../validation"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress, Snackbar } from "@material-ui/core";
// const FormItem = Form.Item;
// const Option = Select.Option;

class RegistrationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      error: "",
      showError: false,
      isOpenDialog: false,
      otp: "",
      email: ""
    };

    this.handleOtpSubmit = this.handleOtpSubmit.bind(this);
    this.onChangeOTP = this.onChangeOTP.bind(this);

  }

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
      this.setState({
        email: e.email
      })
      //     // this.props.history.push("/");
      //   }
    }
  };

  handleOtpSubmit = e => {
    // e.preventDefault();

    console.log(this.state.otp);
    // return
    if (this.state.otp && this.state.otp.length == 6) {
      let data = {
        email: this.state.email,
        otp: this.state.otp
      }
      this.props.onOTPSubmit(
        data
      );
    }
  }

  onChangeOTP(e) {
    e.preventDefault();
    this.setState({ otp: e.target.value })
  }

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

  renderField = ({ input, label, name, type, meta, value }) => {
    return (<div>
      <label>{label}</label>
      <div className='form-group'>
        <input {...input} type={type} className={meta.touched && meta.error ? 'is-invalid form-control' : 'form-control'} value={value} />
        {this.renderError(meta)}
      </div>
    </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, this.props.isVerificationSuccess, nextProps.isVerificationSuccess, nextProps);
    // const { clearError } = this.props
    if (nextProps.successMessage) {
      this.setState({ error: this.props.successMessage, isOpenDialog: true })
      // clearError();
      //   this.props.getBrand()
      // console.log(this.state.isOpenDialog);

    }
    if (nextProps.isVerificationSuccess) {
      setTimeout(() => {
        this.props.history.push("/login");
      }, 2000);
    }

  }

  handleRequestClose = () => {
    this.setState({
      isOpenDialog: false
    })
  }



  render() {
    const { handleSubmit } = this.props;

    return (
      <div>

        {
          this.props.loading ? <CircularProgress /> : ""
        }

        <form onSubmit={handleSubmit(this.handleSubmitForm)}>
          <div>

            <Field
              name="first_name"
              component={this.renderField}
              label="Full Name"
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
            className="btn btn-primary"
            type="submit"
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
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.props.error ? true : false}
          autoHideDuration={4000}
          message={this.props.error}

        />

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.props.successMessage ? true : false}
          autoHideDuration={4000}
          message={this.props.successMessage}

        />
        {
          this.props.successMessage ? <div style={{ textAlign: 'center' }} >
            {this.props.successMessage}
          </div> : ""
        }

        <Dialog
          open={this.state.isOpenDialog}
          onClose={this.handleRequestClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Enter OTP </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Field
                name="otp"
                component={this.renderField}
                onChange={this.onChangeOTP}
                label="OTP"
                type="text" required="true"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">
              Cancel
          </Button>
            <Button onClick={this.handleOtpSubmit} color="primary" autoFocus>
              Submit
          </Button>
          </DialogActions>
        </Dialog>


      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isSignupSuccess: state.auth.isSignupSuccess,
    successMessage: state.auth.successMessage,
    isVerificationSuccess: state.auth.isVerificationSuccess
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
    onAuth: (username, email, password1, password2, val) =>
      dispatch(
        actions.authSignup(username, email, password1, password2, val)
      ),
    onOTPSubmit: (data) =>
      dispatch(
        actions.signupOPTVerify(data)
      ),
    clearError: () => {
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
