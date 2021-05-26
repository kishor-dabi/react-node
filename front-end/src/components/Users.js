import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as actions from "../store/actions/dashboard";
import * as Useractions from "../store/actions/users";
import Hoc from "../hoc/hoc";
import Button from "@material-ui/core/Button"
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';

class Users extends React.PureComponent {


    componenWillMount() {

    }

    componentDidMount() {
        // if (this.props.token !== undefined && this.props.token !== null) {
        // this.props.getDrList(this.props.token);
        this.props.getUsers();
        // }
    }

    componentWillReceiveProps(newProps) {

    }

    renderItem(item) {
        return ''
    }



    render() {
        const { loginUser } = this.props

        let showItemRecords = ""
        if (this.props.user_list) {

            showItemRecords = this.props.user_list.map((list, i) => {
                const labelId = `checkbox-list-label-${i}`;



                return (



                    <ListItem key={i} role={undefined} dense button >

                        <ListItemText id={labelId} primary={`${list.full_name}`} />
                        {/*                   <ListItemSecondaryAction>
                    
                  </ListItemSecondaryAction> */}
                    </ListItem>



                )
            })
        } else {
            showItemRecords = <li className="list-group-item">No Data...</li>
        }
        this.props.user_list.map((user, i) => {
            let obj = user;
            obj.id = user.user_id;
            return obj;
        })


        const columns = [
            { field: 'user_id', headerName: 'ID', width: 100, },
            { field: 'full_name', headerName: 'Full name', width: 220 },
            { field: 'email', headerName: 'Email', width: 200 },
            { field: 'phone_number', headerName: 'Phone Number', width: 150 },

            {
                field: 'age',
                headerName: 'Age',
                type: 'number',
                width: 150,
            },

        ];


        return (
            <Hoc>
                {this.props.loading ? (
                    'loading.....'
                ) : (
                    <div>
                        <h3 style={{ margin: "16px 0" }}>User List</h3>



                        <List className="list">
                            {showItemRecords}
                        </List>



                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid rows={this.props.user_list} id="user_id" columns={columns} pageSize={5} />
                        </div>

                    </div>
                )}


            </Hoc>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        user_list: state.users.users,
        loading: state.dashboard.loading,
        loginUser: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {

        getUsers: () => dispatch(Useractions.getUsersList())
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Users));
