import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlockSwitch from 'react-components/shared/block-switch.component';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import DestinationsPanel from 'react-components/dashboard-element/dashboard-panel/destinations-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import DashboardModalFooter from 'react-components/dashboard-element/dashboard-modal-footer.component';

class DashboardPanel extends Component {
  containerRef = React.createRef();

  getSnapshotBeforeUpdate() {
    const container = this.containerRef.current;
    if (container && container.scrollTop > 0) {
      return container.scrollHeight - container.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const container = this.containerRef.current;
    if (snapshot && container) {
      container.scrollTop = container.scrollHeight - snapshot;
    }
  }

  render() {
    const {
      tabs,
      panels,
      editMode,
      getMoreItems,
      dirtyBlocks,
      activePanelId,
      setActivePanel,
      sourcesPanel,
      getSearchResults,
      destinationsPanel,
      companiesPanel,
      clearActiveId,
      setActiveId,
      sources,
      destinations,
      countries,
      companies,
      commodities,
      onContinue,
      commoditiesPanel,
      dynamicSentenceParts,
      loading
    } = this.props;
    return (
      <div className="c-dashboard-panel">
        <div ref={this.containerRef} className="dashboard-panel-content">
          <h2 className="dashboard-panel-title title -center -light">
            {editMode ? 'Edit options' : 'Choose the options you want to add to the dashboard'}
          </h2>
          <BlockSwitch
            className="dashboard-panel-block-switch"
            blocks={panels}
            selectBlock={setActivePanel}
            activeBlockId={activePanelId}
            dirtyBlocks={dirtyBlocks}
          />
          {activePanelId === 'sources' && (
            <SourcesPanel
              page={sourcesPanel.page}
              getMoreItems={getMoreItems}
              getSearchResults={getSearchResults}
              loadingMoreItems={sourcesPanel.loadingItems}
              loading={loading}
              clearItems={() => clearActiveId(activePanelId)}
              activeCountryItemId={sourcesPanel.activeCountryItemId}
              activeSourceTabId={sourcesPanel.activeSourceTabId}
              activeSourceItemId={sourcesPanel.activeSourceItemId}
              searchSources={sourcesPanel.searchResults}
              tabs={tabs}
              sources={sources[sourcesPanel.activeSourceTabId]}
              countries={countries}
              onSelectCountry={item =>
                setActiveId({
                  type: 'item',
                  active: item && item.id,
                  section: 'country',
                  panel: activePanelId
                })
              }
              onSelectSourceTab={item =>
                setActiveId({
                  type: 'tab',
                  active: item.id,
                  section: 'source',
                  panel: activePanelId
                })
              }
              onSelectSourceValue={item =>
                setActiveId({
                  type: 'item',
                  active: item && item.id,
                  section: 'source',
                  panel: activePanelId
                })
              }
            />
          )}
          {activePanelId === 'destinations' && (
            <DestinationsPanel
              page={destinationsPanel.page}
              getMoreItems={getMoreItems}
              getSearchResults={getSearchResults}
              searchDestinations={destinationsPanel.searchResults}
              destinations={destinations}
              onSelectDestinationValue={item =>
                setActiveId({
                  active: item && item.id,
                  type: 'item',
                  section: 'destination',
                  panel: activePanelId
                })
              }
              loadingMoreItems={destinationsPanel.loadingItems}
              loading={loading}
              activeDestinationId={destinationsPanel.activeDestinationItemId}
            />
          )}
          {activePanelId === 'companies' && (
            <CompaniesPanel
              tabs={tabs}
              page={companiesPanel.page}
              getMoreItems={getMoreItems}
              searchCompanies={companiesPanel.searchResults}
              getSearchResults={getSearchResults}
              loadingMoreItems={companiesPanel.loadingItems}
              loading={loading}
              companies={companies[companiesPanel.activeNodeTypeTabId]}
              onSelectNodeTypeTab={item =>
                setActiveId({
                  type: 'tab',
                  active: item && item.id,
                  section: 'nodeType',
                  panel: activePanelId
                })
              }
              onSelectCompany={item =>
                setActiveId({
                  type: 'item',
                  active: item && item.id,
                  section: 'company',
                  panel: activePanelId
                })
              }
              activeNodeTypeTabId={companiesPanel.activeNodeTypeTabId}
              activeCompanyId={companiesPanel.activeCompanyItemId}
            />
          )}
          {activePanelId === 'commodities' && (
            <CommoditiesPanel
              getSearchResults={getSearchResults}
              page={commoditiesPanel.page}
              getMoreItems={getMoreItems}
              searchCommodities={commoditiesPanel.searchResults}
              loadingMoreItems={commoditiesPanel.loadingItems}
              loading={loading}
              commodities={commodities}
              onSelectCommodity={item =>
                setActiveId({
                  type: 'item',
                  active: item && item.id,
                  section: 'commodity',
                  panel: activePanelId
                })
              }
              activeCommodityId={commoditiesPanel.activeCommodityItemId}
            />
          )}
        </div>
        {dynamicSentenceParts && (
          <DashboardModalFooter
            editMode={editMode}
            isPanelFooter
            onContinue={onContinue}
            clearItem={clearActiveId}
            dynamicSentenceParts={dynamicSentenceParts}
          />
        )}
      </div>
    );
  }
}

DashboardPanel.propTypes = {
  countries: PropTypes.array,
  companies: PropTypes.object,
  getMoreItems: PropTypes.func,
  commodities: PropTypes.array,
  dirtyBlocks: PropTypes.object,
  activePanelId: PropTypes.string,
  sources: PropTypes.object,
  tabs: PropTypes.array,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  commoditiesPanel: PropTypes.object,
  panels: PropTypes.array.isRequired,
  destinations: PropTypes.array.isRequired,
  onContinue: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  dynamicSentenceParts: PropTypes.array,
  setActiveId: PropTypes.func.isRequired,
  clearActiveId: PropTypes.func.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  sourcesPanel: PropTypes.object.isRequired,
  destinationsPanel: PropTypes.object.isRequired,
  companiesPanel: PropTypes.object.isRequired
};

export default DashboardPanel;
