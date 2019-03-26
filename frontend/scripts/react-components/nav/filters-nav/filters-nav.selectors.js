import { createSelector } from 'reselect';
import intersection from 'lodash/intersection';
import sortBy from 'lodash/sortBy';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';
import {
  LOGISTICS_MAP_YEARS,
  LOGISTICS_MAP_HUBS,
  LOGISTICS_MAP_INSPECTION_LEVELS
} from 'constants';
import difference from 'lodash/difference';
import capitalize from 'lodash/capitalize';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';

const insertIf = (condition, item) => (condition ? [item] : []);

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getSelectedYears = state => state.app.selectedYears;
const getToolSelectedResizeBy = state => (state.tool ? state.tool.selectedResizeBy : {});
const getToolRecolorBy = state => (state.tool ? state.tool.selectedRecolorBy : {});
const getToolSelectedBiome = state => state.tool && state.tool.selectedBiomeFilter;
const getContextFilterBy = state => state.app.selectedContext && state.app.selectedContext.filterBy;
const getAppTooltips = state => state.app.tooltips;
const getToolDetailedView = state => state.tool && state.tool.detailedView;
const getToolResizeBys = state => state.app.selectedContext && state.app.selectedContext.resizeBy;

export const getToolYearsProps = createSelector(
  [getSelectedYears, getToolSelectedResizeBy, getToolRecolorBy, getSelectedContext],
  (selectedYears, selectedResizeBy, selectedRecolorBy, selectedContext) => {
    const availableContextYears = selectedContext && selectedContext.years;
    const availableResizeByYears =
      selectedResizeBy.years && selectedResizeBy.years.length > 0
        ? selectedResizeBy.years
        : availableContextYears;
    const availableRecolorByYears =
      selectedRecolorBy.years && selectedRecolorBy.years.length > 0
        ? selectedRecolorBy.years
        : availableContextYears;

    const years = intersection(
      availableContextYears,
      availableResizeByYears,
      availableRecolorByYears
    );

    return { years, selectedYears };
  }
);

export const getToolAdminLevelProps = createSelector(
  [getToolSelectedBiome, getContextFilterBy],
  (selectedFilter, filterBy) => {
    const [adminLevel] = filterBy || [];
    if (!adminLevel) return null;
    return {
      label: adminLevel.name,
      id: 'toolAdminLevel',
      clip: false,
      options: [
        { value: 'none', label: 'All' },
        ...adminLevel.nodes
          .filter(node => node.name !== (selectedFilter && selectedFilter.name))
          .map(node => ({ ...node, value: node.name, label: capitalize(node.name) }))
      ],
      value:
        typeof selectedFilter !== 'undefined' && selectedFilter.value !== 'none'
          ? { ...selectedFilter, label: capitalize(selectedFilter.name) }
          : { label: 'All', value: 'All' }
    };
  }
);

export const getToolResizeByProps = createSelector(
  [getAppTooltips, getToolResizeBys, getSelectedYears, getToolSelectedResizeBy],
  (tooltips, resizeBys, selectedYears, selectedResizeBy) => {
    const items = sortBy(resizeBys, ['groupNumber', 'position']).map((resizeBy, index, list) => {
      const isEnabled =
        !resizeBy.isDisabled &&
        (resizeBy.years.length === 0 || difference(selectedYears, resizeBy.years).length === 0);

      const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== resizeBy.groupNumber;
      return {
        hasSeparator,
        value: resizeBy.name,
        label: resizeBy.label,
        isDisabled: !isEnabled,
        tooltip: resizeBy.description
      };
    });
    return {
      options: items,
      label: 'Resize by',
      id: 'toolResizeBy',
      showSelected: true,
      size: 'rg',
      clip: false,
      weight: 'regular',
      value: { value: selectedResizeBy.name, label: selectedResizeBy.label || '' },
      tooltip: tooltips && tooltips.sankey.nav.resizeBy.main,
      titleTooltip: tooltips && tooltips.sankey.nav.resizeBy[selectedResizeBy.name]
    };
  }
);

export const getToolViewModeProps = createSelector(
  [getAppTooltips, getToolDetailedView],
  (tooltips, isDetailedView) => {
    const options = [{ label: 'Summary', value: false }, { label: 'All Flows', value: true }];
    return {
      options,
      label: 'Change view',
      id: 'toolViewMode',
      size: 'rg',
      clip: false,
      weight: 'regular',
      tooltip: tooltips && tooltips.sankey.nav.view.main,
      value: options.find(item => item.value === isDetailedView)
    };
  }
);

const getLogisticsMapYearsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Year',
    id: 'logisticsMapYear',
    options: activeParams.commodity === 'soy' ? LOGISTICS_MAP_YEARS : [],
    isDisabled: activeParams.commodity !== 'soy',
    value:
      activeParams.commodity === 'soy'
        ? LOGISTICS_MAP_YEARS.find(year => year.value === parseInt(activeParams.year, 10))
        : {},
    selectedValueOverride: activeParams.commodity !== 'soy' ? '2012 – 2017' : undefined
  })
);

const getLogisticsMapHubsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Logistics Hub',
    id: 'logisticsMapHub',
    options: LOGISTICS_MAP_HUBS,
    value: LOGISTICS_MAP_HUBS.find(commodity => commodity.value === activeParams.commodity)
  })
);

const getLogisticsMapInspectionLevelProps = createSelector(
  [getActiveParams],
  activeParams => {
    if (activeParams.commodity === 'soy') {
      return null;
    }

    const all = { label: 'All', value: null };

    return {
      label: 'Inspection Level',
      id: 'logisticsMapInspectionLevel',
      options: [all, ...LOGISTICS_MAP_INSPECTION_LEVELS],
      value:
        LOGISTICS_MAP_INSPECTION_LEVELS.find(level => level.value === activeParams.inspection) ||
        all
    };
  }
);

export const getNavFilters = createSelector(
  [
    getCurrentPage,
    getSelectedContext,
    getToolAdminLevelProps,
    getToolResizeByProps,
    getToolViewModeProps,
    getLogisticsMapYearsProps,
    getLogisticsMapHubsProps,
    getLogisticsMapInspectionLevelProps
  ],
  (
    page,
    selectedContext,
    toolAdminLevel,
    toolResizeBy,
    toolViewMode,
    logisticsMapsYears,
    logisticsMapsHubs,
    logisticsMapInspectionLevel
  ) => {
    const { FILTER_TYPES } = FiltersNav;
    switch (page) {
      case 'tool':
        return {
          showSearch: true,
          showToolLinks: true,
          left: [
            {
              type: FILTER_TYPES.contextSelector,
              props: { selectedContext, id: 'contextSelector' }
            },
            ...insertIf(toolAdminLevel, {
              type: FILTER_TYPES.dropdown,
              props: toolAdminLevel
            }),
            {
              type: FILTER_TYPES.yearSelector,
              props: { id: 'yearsSelector' }
            }
          ],
          right: [
            { type: FILTER_TYPES.dropdown, props: toolResizeBy },
            { type: FILTER_TYPES.recolorBySelector, props: { id: 'toolRecolorBy' } },
            { type: FILTER_TYPES.dropdown, props: toolViewMode }
          ]
        };
      case 'logisticsMap':
        return {
          showLogisticsMapDownload: true,
          left: [
            { type: FILTER_TYPES.dropdown, props: logisticsMapsHubs },
            { type: FILTER_TYPES.dropdown, props: logisticsMapsYears },
            ...insertIf(logisticsMapInspectionLevel, {
              type: FILTER_TYPES.dropdown,
              props: logisticsMapInspectionLevel
            })
          ]
        };
      default:
        return {};
    }
  }
);
