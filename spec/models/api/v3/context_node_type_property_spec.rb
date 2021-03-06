require 'rails_helper'

RSpec.describe Api::V3::ContextNodeTypeProperty, type: :model do
  include_context 'api v3 brazil context node types'

  describe :validate do
    let(:property_without_context_node_type) {
      FactoryBot.build(
        :api_v3_context_node_type_property, context_node_type: nil
      )
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_biome_context_node
      )
    }
    let(:property_without_prefix) {
      FactoryBot.build(
        :api_v3_context_node_type_property, role: :exporter, prefix: nil
      )
    }
    let(:context_node_type_from_another_context) {
      cnt = FactoryBot.create(:api_v3_context_node_type)
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        is_geo_column: true
      )
      cnt
    }

    let(:property_with_invalid_geometry_context_node_type_1) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_logistics_hub_context_node,
        geometry_context_node_type: context_node_type_from_another_context
      )
    }
    let(:property_with_invalid_geometry_context_node_type_2) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_biome_context_node,
        geometry_context_node_type: api_v3_exporter1_context_node
      )
    }
    it 'fails when context node type missing' do
      expect(property_without_context_node_type).to have(2).
        errors_on(:context_node_type)
    end
    it 'fails when context node type taken' do
      expect(duplicate).to have(1).errors_on(:context_node_type)
    end
    it 'fails when prefix missing' do
      expect(property_without_prefix).to have(1).
        errors_on(:prefix)
    end
    it 'fails when geometry_context_node_type from different context' do
      expect(property_with_invalid_geometry_context_node_type_1).to have(1).
        errors_on(:geometry_context_node_type_id)
    end
    it 'fails when geometry_context_node_type not geo column' do
      expect(property_with_invalid_geometry_context_node_type_2).to have(1).
        errors_on(:geometry_context_node_type_id)
    end
  end

  describe :refresh_dependents do
    before(:each) {
      Api::V3::ContextNodeTypeProperty.set_callback(:commit, :after, :refresh_dependents)
    }
    after(:each) {
      Api::V3::ContextNodeTypeProperty.skip_callback(:commit, :after, :refresh_dependents)
    }

    context 'when created with source role' do
      it 'dashboards_sources_mv is refreshed' do
        allow(Api::V3::Readonly::Dashboards::Source).to receive(:refresh_later)
        expect(Api::V3::Readonly::Dashboards::Source).to receive(:refresh_later)
        expect(Api::V3::Readonly::Dashboards::Company).not_to receive(:refresh_later)
        FactoryBot.create(
          :api_v3_context_node_type_property,
          role: Api::V3::ContextNodeTypeProperty::SOURCE_ROLE
        )
      end
    end

    context 'when updated from source role to exporter' do
      it 'dashboards_sources_mv and dashboards_companies_mv are refreshed' do
        allow(Api::V3::Readonly::Dashboards::Source).to receive(:refresh_later)
        allow(Api::V3::Readonly::Dashboards::Company).to receive(:refresh_later)
        allow(Api::V3::Readonly::Dashboards::Exporter).to receive(:refresh_later)
        property = FactoryBot.create(
          :api_v3_context_node_type_property,
          role: Api::V3::ContextNodeTypeProperty::SOURCE_ROLE
        )
        expect(Api::V3::Readonly::Dashboards::Source).to receive(:refresh_later)
        expect(Api::V3::Readonly::Dashboards::Company).to receive(:refresh_later)
        expect(Api::V3::Readonly::Dashboards::Exporter).to receive(:refresh_later)
        property.update(role: Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE)
      end
    end
  end
end
