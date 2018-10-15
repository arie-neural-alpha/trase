module Api
  module V3
    module Dashboards
      class NodeSerializer < ActiveModel::Serializer
        attributes :id, :name
        attribute :node_type do
          object['node_type']
        end
      end
    end
  end
end