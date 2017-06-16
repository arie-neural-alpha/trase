class PlaceFactsheetController < ApplicationController
  def place_data
    context_id = params[:context_id]

    context = if context_id.present?
      Context.find(context_id)
    else
      Context.find_by(is_default: true)
    end

    year = params[:year] || context.default_year

    node_id = params[:node_id]

    raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?

    node = Node.place_nodes.find(node_id)

    @result = PlaceAttributes.new(context, year, node).result

    render json: @result
  end
end