import React, {Component} from "react";
import {ListGroupItem} from "react-bootstrap";
import Moment from "moment";
import Filesize from "filesize";
import {Link} from "react-router";
import ActionIcon from "./ActionIcon";


export default class BoxProviderList extends Component {
  groupProvidersByType = () => {
    const { providers } = this.props;
    if (!providers) return {};

    return providers.reduce((acc, provider) => {
      if (!acc[provider.provider]) {
        acc[provider.provider] = [];
      }
      acc[provider.provider].push(provider);
      return acc;
    }, {});
  };

  renderDeleteIcon = (provider) => {
    if (!this.props.canDelete) {
      return null;
    }
    return <ActionIcon
        icon="trash"
        title="Delete provider"
        onClick={this.props.onDelete.bind(null, provider.provider)}
    />;
  };

  renderEditIcon = (provider) => {
    if (!this.props.canEdit) {
      return null;
    }
    return <ActionIcon
        icon="edit"
        title="Edit provider"
        onClick={this.props.onEdit.bind(null, provider.provider)}
    />;
  };

  renderSize = (provider) => {
    if (!provider.download_url) {
      return null;
    }
    return (
        <p>Size: {Filesize(provider.file_size)}</p>
    );
  };

  renderProvidersList = () => {
  const groupedProviders = this.groupProvidersByType();

  if (!this.props.providers) return null;
  if (!this.props.providers.length) return <p className="text-center">No providers</p>;

  return Object.entries(groupedProviders).map(([providerName, archProviders]) => (
    <ListGroupItem key={`${providerName}-${archProviders}`}>
      <h4 className="list-group-item-heading">
        {providerName}
        <div className="pull-right">
          {this.renderEditIcon(archProviders[0])}
          {this.renderDeleteIcon(archProviders[0])}
        </div>
      </h4>
      
      <div className="architectures-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {archProviders.map(provider => (
          <div key={provider.architecture} className="arch-item">
            <a 
              href={provider.download_url} 
              className="btn btn-default btn-sm download-btn" 
              style={{
                display: 'inline-block', 
                width: '100px', 
                height: '40px', 
                textAlign: 'center', 
                lineHeight: '0px',
                padding: '19px 0px 0px 0px',
                fontSize: '15px',
                fontWeight: 'bold',
                borderBottom: '2px solid #ccc',
                borderRadius: "5px",
              }}
            >
              {provider.architecture}
            </a>
            <span className="file-size" style={{ 
                marginLeft: '15px',
              }}>
              Size: 
              {Filesize(provider.file_size)}
            </span>
          </div>
        ))}
      </div>
    </ListGroupItem>
  ));
  };

  renderNewButton = () => {
    if (!this.props.canCreate) {
      return null;
    }
    return (
        <Link
            to={`/boxes/${this.props.boxTag}/versions/${this.props.version}/providers/new/`}
            className='btn btn-success box-provider-new-button'
        >
          New provider
        </Link>
    );
  };

  render() {
    return (
      <div>
        {this.renderNewButton()}
        {this.renderProvidersList()}
      </div>
    );
  }
}
