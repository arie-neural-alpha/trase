class CreateQualCommodityProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :qual_commodity_properties do |t|
      t.text :tooltip_text, null: false
      t.references :commodity, foreign_key: true, null: false
      t.references :qual, foreign_key: true, null: false

      t.timestamps
    end
  end
end
