import React from 'react';
import PropTypes from 'prop-types';
import SummaryWidget from 'react-components/profile-node/profile-node-widgets/summary-widget.component';
import TopDestinationsWidget from 'react-components/profile-node/profile-node-widgets/top-destinations-widget.component';
import SustainabilityIndicatorsWidget from 'react-components/profile-node/profile-node-widgets/sustainability-indicators-widget.component';
import DeforestationWidget from 'react-components/profile-node/profile-node-widgets/deforestation-widget.component';
import TopConsumersWidget from 'react-components/profile-node/profile-node-widgets/top-consumers-widget.component';

class ProfileNode extends React.PureComponent {
  onYearChange = year => this.updateQuery('year', year);

  updateQuery(key, value) {
    const { nodeId, year, profileType, updateQueryParams } = this.props;
    updateQueryParams({ nodeId, year, [key]: value }, profileType);
  }

  render() {
    const { printMode, year, nodeId, contextId, profileType } = this.props;
    return (
      <div className="l-profile-actor l-profile-place">
        {printMode && (
          <div className="top-logo">
            <div className="row">
              <div className="column small-12">
                <img src="/images/logos/new-logo-trase-red.svg" alt="TRASE" />
              </div>
            </div>
          </div>
        )}
        <SummaryWidget
          year={year}
          printMode={printMode}
          contextId={contextId}
          profileType={profileType}
          nodeId={nodeId}
          onYearChange={this.onYearChange}
        />
        {profileType === 'actor' && (
          <React.Fragment>
            <section className="c-top-map page-break-inside-avoid">
              <TopDestinationsWidget
                year={year}
                nodeId={nodeId}
                contextId={contextId}
                type="countries"
              />
            </section>
            <section className="c-top-municipalities page-break-inside-avoid">
              <TopDestinationsWidget
                year={year}
                nodeId={nodeId}
                contextId={contextId}
                type="regions"
              />
            </section>
          </React.Fragment>
        )}
        {profileType === 'place' && (
          <React.Fragment>
            <SustainabilityIndicatorsWidget year={year} nodeId={nodeId} contextId={contextId} />
            <DeforestationWidget year={year} nodeId={nodeId} contextId={contextId} />
            <TopConsumersWidget year={year} nodeId={nodeId} contextId={contextId} type="actors" />
            <TopConsumersWidget
              year={year}
              nodeId={nodeId}
              contextId={contextId}
              type="countries"
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

ProfileNode.propTypes = {
  printMode: PropTypes.bool,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired,
  updateQueryParams: PropTypes.func.isRequired
};

export default ProfileNode;
