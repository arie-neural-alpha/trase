import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';
import MapLegend from 'react-components/tool/map-legend/map-legend.component';
import { getCurrentHighlightedChoroplethBucket } from 'react-components/tool/tool.selectors';
import { toggleMapLayerMenu } from 'actions/app.actions';

const mapStateToProps = state => ({
  choroplethLegend: state.toolLayers.choroplethLegend,
  selectedMapDimensionsWarnings: state.toolLayers.selectedMapDimensionsWarnings,
  selectedMapContextualLayersData: state.toolLayers.selectedMapContextualLayersData,
  currentHighlightedChoroplethBucket: getCurrentHighlightedChoroplethBucket(state.toolLinks)
});

const mapDispatchToProps = {
  onToggleMapLayerMenu: toggleMapLayerMenu
};

const methodProps = [
  {
    name: 'updateChoroplethLegend',
    compared: ['choroplethLegend'],
    returned: ['choroplethLegend', 'selectedMapContextualLayersData']
  },
  {
    name: 'updateContextLegend',
    compared: ['selectedMapContextualLayersData'],
    returned: ['choroplethLegend', 'selectedMapContextualLayersData']
  },
  {
    name: 'highlightChoroplethBucket',
    compared: ['currentHighlightedChoroplethBucket'],
    returned: ['currentHighlightedChoroplethBucket']
  },
  {
    name: 'selectMapDimensions',
    compared: ['selectedMapDimensionsWarnings'],
    returned: ['selectedMapDimensionsWarnings']
  },
  {
    name: 'highlightChoroplethBucket',
    compared: ['currentHighlightedChoroplethBucket'],
    returned: ['currentHighlightedChoroplethBucket']
  }
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(MapLegend, methodProps, Object.keys(mapDispatchToProps)));
