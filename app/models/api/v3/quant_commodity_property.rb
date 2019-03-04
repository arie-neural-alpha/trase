# == Schema Information
#
# Table name: quant_commodity_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  commodity_id :bigint(8)
#  quant_id     :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_quant_commodity_properties_on_commodity_id  (commodity_id)
#  index_quant_commodity_properties_on_quant_id      (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id)
#  fk_rails_...  (quant_id => quants.id)
#

module Api
  module V3
    class QuantCommodityProperty < ApplicationRecord
      belongs_to :commodity
      belongs_to :quant
    end
  end
end
