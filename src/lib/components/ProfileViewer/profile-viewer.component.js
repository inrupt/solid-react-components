import React, { Component } from 'react';
import ldflex from '@solid/query-ldflex';
// In-house Components
// Utils
import { SolidError } from '@utils';
// Entities
import { Provider } from '@entities';
// Styled Components
import { ProfileCard, ProfileViewerWrapper } from './profile-viewer.style';

export default class ProfileViewer extends Component<> {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      webId: props.webId,
      name: '',
      image: '',
      company: '',
      title: '',
      direction: props.direction || 'down'
    };
  }

  componentDidMount() {
    this.loadProfile();
  }

  loadProfile = async () => {
    const { webId } = this.state;
    let { direction } = this.state;

    if (direction.toLowerCase() !== 'up' && direction.toLowerCase() !== 'down') {
      direction = 'down';
    }

    const name = await ldflex[webId].vcard_fn;
    const image = await ldflex[webId].vcard_hasPhoto;
    const company = await ldflex[webId]['vcard_organization-name'];
    const title = await ldflex[webId].vcard_role;
    this.setState({
      name: name.value || '',
      image: image.value || '',
      company: company.value || '',
      title: title.value || '',
      direction: direction.toLowerCase()
    });
  };

  setVisibilityTrue = () => {
    this.setState({ visible: true });
  };

  setVisibilityFalse = () => {
    this.setState({ visible: false });
  };

  render() {
    const { children, webId } = this.props;
    const { visible, name, image, company, title, direction } = this.state;
    return (
      <ProfileViewerWrapper
        onMouseEnter={this.setVisibilityTrue}
        onMouseLeave={this.setVisibilityFalse}
        className="solid-profile-viewer"
      >
        <span>{children}</span>
        {visible && (
          <ProfileCard direction={direction} className="solid-profile-card">
            <img src={image} alt="Profile" className="solid-profile-card-image" />
            <div className="solid-profile-card-name">{name}</div>
            <div className="solid-profile-card-company">{company}</div>
            <div className="solid-profile-card-role">{title}</div>
            <div className="solid-profile-card-view-more">
              <a href={webId} target="_blank" rel="noopener noreferrer">
                View More
              </a>
            </div>
          </ProfileCard>
        )}
      </ProfileViewerWrapper>
    );
  }
}
