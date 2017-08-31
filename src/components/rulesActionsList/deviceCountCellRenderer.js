// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ApiService from "../../common/apiService";
import {connect} from "react-redux";
import Spinner from "../spinner/spinner";

class DeviceCountCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: props.data.DeviceCount === undefined,
            count: props.data.DeviceCount || 0,
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };
    }

    componentDidMount() {
        if(this.props.data.DeviceCount === undefined){
            let matchedGroup = this.props.deviceGroups.filter(group => group.id === this.state.cell.row.GroupId);
            if (!matchedGroup.length) {
                this.setState({loading: false, count: 0});
                this.props.node.setData(Object.assign({}, this.props.data, {DeviceCount: 0}));
                return;
            }
            ApiService.getDevicesForGroup(matchedGroup[0].conditions)
                .then(response => {
                    if (response.items !== undefined) {
                        this.setState({loading: false, count: response.items.length});
                        this.props.node.setData(Object.assign({}, this.props.data, {Devices: response.items,  DeviceCount: response.items.length}));
                    }
                })
                .catch(err => {
                    this.props.node.setData(Object.assign({}, this.props.data, {DeviceCount: 0}));
                    this.setState({loading: false, count: 0})
                })
        }
    }

    render() {
        return (
            this.state.loading
                ? <div className="loading-spinner-cell">
                    <Spinner size='medium'/>
                </div>
                : <div> {this.state.count} </div>
        )
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(DeviceCountCellRenderer);
