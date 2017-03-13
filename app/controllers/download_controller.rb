class DownloadController < ApplicationController
  def index
    query = FlowDownloadQueryBuilder.new(@context.id, params).query

    respond_to do |format|
      format.csv {
        csv = PgCsv.new(
          sql: query.to_sql,
          header: true,
          delimiter: ',',
          encoding: 'UTF8',
          type: :plain
        )
        send_data csv.export,
          type: 'text/csv; charset=utf-8; header=present',
          disposition: "attachment; filename=#{params[:country]}_#{params[:commodity]}.csv"
      }
      format.json {
        send_data query.to_json,
          type: 'text/json; charset=utf-8',
          disposition: "attachment; filename=#{params[:country]}_#{params[:commodity]}.json"
      }
    end
  end
end
