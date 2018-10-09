import { createSelector } from 'reselect';
import uniq from 'lodash/uniq';

const getDashboardPanelData = state => state.dashboardElement.data;
const getSourcesPanel = state => state.dashboardElement.sourcesPanel;
const getImportingPanel = state => state.dashboardElement.importingPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;
const getIndicators = state => state.dashboardElement.data.indicators;
const getActiveIndicators = state => state.dashboardElement.activeIndicatorsList;
const getDashboardPanelMeta = state => state.dashboardElement.meta;
const getActiveDashboardPanel = state => {
  const { activePanelId, ...restState } = state.dashboardElement;
  return { id: activePanelId, ...restState[`${activePanelId}Panel`] };
};

export const getActivePanelTabs = createSelector(
  [getActiveDashboardPanel, getDashboardPanelMeta],
  (panel, meta) => {
    switch (panel.id) {
      case 'sources': {
        if (meta.countries) {
          const tabs = meta.countries
            .filter(row => row.country_id === panel.activeCountryItemId && row.node_type_id !== 13)
            .map(row => ({ name: row.node_type_name, id: row.node_type_id }));
          return uniq(tabs);
        }
        return [];
      }
      case 'companies': {
        return ['EXPORTERS', 'IMPORTERS'];
      }
      default:
        return [];
    }
  }
);

export const getDirtyBlocks = createSelector(
  [getSourcesPanel, getImportingPanel, getCompaniesPanel, getCommoditiesPanel],
  (sourcesPanel, importingPanel, companiesPanel, commoditiesPanel) => ({
    sources: sourcesPanel.activeCountryItemId !== null,
    importing: importingPanel.activeDestinationItemId !== null,
    companies: companiesPanel.activeCompanyItemId !== null,
    commodities: commoditiesPanel.activeCommodityItemId !== null
  })
);

export const getDynamicSentence = createSelector(
  [
    getSourcesPanel,
    getImportingPanel,
    getCompaniesPanel,
    getCommoditiesPanel,
    getDashboardPanelData
  ],
  (sourcesPanel, importingPanel, companiesPanel, commoditiesPanel, data) => {
    const countriesActiveId = sourcesPanel.activeCountryItemId;
    const sourcesActiveId = sourcesPanel.activeSourceItemId;
    const importingActiveId = importingPanel.activeDestinationItemId;
    const companiesActiveId = companiesPanel.activeCompanyItemId;
    const commoditiesActiveId = commoditiesPanel.activeCommodityItemId;

    if (
      ![
        !!countriesActiveId,
        !!sourcesActiveId,
        !!importingActiveId,
        !!companiesActiveId,
        !!commoditiesActiveId
      ].includes(true)
    ) {
      return null;
    }
    const countriesValue = data.countries.find(item => item.id === countriesActiveId);
    const commoditiesValue = data.commodities.find(item => item.id === commoditiesActiveId);
    const sourcesValue = data.sources.find(item => item.id === sourcesActiveId);
    const companiesValue = data.companies.find(item => item.id === companiesActiveId);
    const importingValue = data.destinations.find(item => item.id === importingActiveId);

    return [
      {
        panel: 'commodities',
        prefix: commoditiesActiveId ? 'Explore' : 'Explore commodities',
        value: commoditiesValue && commoditiesValue.name
      },
      {
        panel: 'sources',
        prefix: sourcesActiveId ? `produced in` : 'produced in the world',
        value: (sourcesValue && sourcesValue.name) || (countriesValue && countriesValue.name)
      },
      {
        panel: 'companies',
        prefix: companiesActiveId ? `exported by` : '',
        value: companiesValue && companiesValue.name
      },
      {
        panel: 'importing',
        prefix: importingActiveId ? `going to` : '',
        value: importingValue && importingValue.name
      }
    ];
  }
);

export const getActiveIndicatorsData = createSelector(
  [getIndicators, getActiveIndicators],
  (indicators, activeIndicatorsList) =>
    indicators.filter(indicator => activeIndicatorsList.includes(indicator.id))
);
