import React, { Component } from 'react';
import ldflex from '@solid/query-ldflex';
import { VCARD } from '@solid/lit-vocab-common';
// In-house Components
// Utils
import { SolidError } from '@utils';
// Styled Components
import { ProfileCard, ProfileViewerWrapper } from './profile-viewer.style';

type ProfileViewerProps = {
  webId: String,
  direction: String,
  onClick: Boolean,
  onError: (error: Error) => void,
  children: any,
  viewMoreText: String
};

export default class ProfileViewer extends Component<ProfileViewerProps> {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      webId: props.webId,
      name: '',
      image: '',
      company: '',
      title: '',
      onClick: props.onClick || false,
      direction: props.direction || 'down',
      viewMoreText: props.viewMoreText || 'View More'
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

    try {
      // const name = await ldflex[webId].vcard_fn;
      // const image = await ldflex[webId].vcard_hasPhoto;
      // const company = await ldflex[webId]['vcard_organization-name'];
      // const title = await ldflex[webId].vcard_role;

      console.log(`PMCB55: ABOUT TO GET PROFILE PROPERTIES...`);
      const name = await ldflex[webId][VCARD.fn];
      const image = await ldflex[webId][VCARD.hasPhoto];
      const company = await ldflex[webId][VCARD.organization_name];
      const title = await ldflex[webId][VCARD.role];
      console.log(`PMCB55: GOT [${name}], [${image}], [${company}], [${title}]`);

      this.setState({
        name: (name && name.value) || '',
        image: (image && image.value) || '',
        company: (company && company.value) || '',
        title: (title && title.value) || '',
        direction: direction.toLowerCase()
      });
    } catch (error) {
      const { onError } = this.props;
      if (onError) {
        onError(new SolidError(error, 'An error has occurred'));
      } else {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  };

  setVisibility = vis => {
    const { onClick } = this.state;
    if (!onClick) {
      this.setState({ visible: vis });
    }
  };

  toggleVisibility = () => {
    const { onClick } = this.state;
    if (onClick) {
      this.setState(state => ({ ...state, visible: !state.visible }));
    }
  };

  render() {
    const { children, webId } = this.props;
    const { visible, name, image, company, title, direction, viewMoreText } = this.state;
    return (
      <ProfileViewerWrapper
        onMouseEnter={() => this.setVisibility(true)}
        onMouseLeave={() => this.setVisibility(false)}
        onClick={this.toggleVisibility}
        className="solid-profile-viewer"
      >
        {children}
        {visible && (
          <ProfileCard direction={direction} className="solid-profile-card">
            <img src={image} alt="Profile" className="solid-profile-card-image" />
            {name && <div className="solid-profile-card-name">{name}</div>}
            {company && <div className="solid-profile-card-company">{company}</div>}
            {title && <div className="solid-profile-card-role">{title}</div>}
            <div className="solid-profile-card-view-more">
              <a href={webId} target="_blank" rel="noopener noreferrer">
                {viewMoreText}
              </a>
            </div>
          </ProfileCard>
        )}
      </ProfileViewerWrapper>
    );
  }
}
