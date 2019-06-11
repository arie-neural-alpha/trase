# == Schema Information
#
# Table name: ind_commodity_properties
#
#  id                                                                                                                                                                                                                          :bigint(8)        not null, primary key
#  tooltip_text(Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.) :text             not null
#  commodity_id(Reference to commodity)                                                                                                                                                                                        :bigint(8)        not null
#  ind_id(Reference to ind)                                                                                                                                                                                                    :bigint(8)        not null
#
# Indexes
#
#  ind_commodity_properties_commodity_id_idx  (commodity_id)
#  ind_commodity_properties_ind_id_idx        (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class IndCommodityProperty < YellowTable
      belongs_to :commodity
      belongs_to :ind

      validates :commodity, presence: true
      validates :ind, presence: true, uniqueness: {scope: :commodity}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind},
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CommodityAttributeProperty.refresh
      end
    end
  end
end