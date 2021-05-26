import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "../store/actions/auth";
import { Field, reduxForm } from "redux-form";
// import Snackbar from 'material-ui/Snackbar'
import { emailFieldValidation, Required, phoneNumberPattern } from "../validation"
import { Button, Snackbar, TextField } from "@material-ui/core";

// const FormItem = Form.Item;
// const Option = Select.Option;

class NewAdminForm extends React.Component {
    state = {
        confirmDirty: false,
        error: "",
        showError: false
    };

    handleSubmitForm = e => {
        // console.log(e);
       
        if (this.props.valid) {

            this.props.onAuth(
                e.first_name,
                e.email,
                e.password,
                e.phone_number,
                2
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
        // console.log(error, touched)
        if (error && touched) {
            return (<span className=""> {error} </span>)
        }
        return ''
    }

    renderField = ({ input, label, name, type, meta }) => {
        return (<div>
            <div className='form-group'>
            
                <TextField error={this.renderError(meta) == '' ? false : true} id="standard-error-helper-text" fullWidth={true}
                    {...input} type={type} label={label} helperText={this.renderError(meta)}
                />
            </div>
        </div>
        )
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps, this.props.error);

        if (this.props.error) {
            this.setState({ error: this.props.error, showError: true })
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

            <div className="row justify-content-center ">
                <div className="col-md-6">

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
                            variant="contained" color="primary" 
                            type="submit"
                            style={{ marginRight: "10px" }}
                        >
                            SUbmit
                        </Button>
     
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
                    {
                        this.props.error ? <div style={{ textAlign: 'center' }} >
                            {this.props.error}
                        </div> : ""
                    }

                </div>

            </div>

        );
    }
}

const WrappedNewAdminForm = Form.create()(NewAdminForm);

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
        onAuth: (username, email, password1, password2, is_admin) =>
            dispatch(
                actions.authSignup(username, email, password1, password2, is_admin)
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
)(WrappedNewAdminForm);


export default reduxForm({
    form: 'NewAdminForm', // a unique identifier for this form,
    validate
})(form)
