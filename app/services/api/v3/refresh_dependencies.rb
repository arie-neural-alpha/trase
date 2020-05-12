module Api
  module V3
    class RefreshDependencies
      include Singleton

      def initialize
        query =<<~SQL
          SELECT table_name, column_name, dependent_name, dependent_type
          FROM maintenance.refresh_dependencies
        SQL

        begin
          result = Api::V3::YellowTable.connection.execute query
        rescue
          result = []
        end

        @data =
          result.map do |r|
            class_with_dependents = class_with_dependents(r)
            next unless class_with_dependents &&
              class_with_dependents < Api::V3::YellowTable
            dependent_class = dependent_class(r)

            next unless dependent_class && (
              dependent_class.included_modules.include?(Api::V3::Readonly::MaterialisedView) ||
              dependent_class.included_modules.include?(Api::V3::Readonly::MaterialisedTable) ||
              dependent_class == Api::V3::Readonly::Attribute
            )

            {
              table_name: r['table_name'],
              column_name: r['column_name'],
              class_with_dependents: class_with_dependents,
              dependent_class: dependent_class
            }
          end.compact
      end

      def grouped_by_dependent_class(table_name = nil)
        data = @data
        if table_name
          data = data.select{ |rd| rd[:table_name] == table_name }
        end
        data.group_by { |rd| rd[:dependent_class] }
      end

      def classes_with_dependents
        @data.map { |rd| rd[:class_with_dependents] }.uniq
      end

      def dependent_classes(table_name = nil)
        data = @data
        if table_name
          data = @data.select{ |rd| rd[:table_name] == table_name }
        end
        data.map { |rd| rd[:dependent_class] }.uniq
      end

      private

      def class_with_dependents(refresh_dependents_record)
        table_name = refresh_dependents_record['table_name']
        class_namespace = Api::V3
        begin
          class_namespace.const_get(table_name.classify)
        rescue NameError
          Rails.logger.error("Unrecognised table: #{table_name}")
          nil
        end
      end

      def dependent_class(refresh_dependents_record)
        dependent_name = refresh_dependents_record['dependent_name']
        dependent_underscorised =
          case refresh_dependents_record['dependent_type']
          when 'm'
            dependent_name.sub(/_mv$/, '')
          when 'v'
            dependent_name.sub(/_v$/, '')
          end

        class_namespace =
          if dependent_underscorised =~ /^dashboards_/
            dependent_underscorised = dependent_underscorised.sub(/^dashboards_/, '')
            Api::V3::Readonly::Dashboards
          else
            Api::V3::Readonly
          end

        dependent_camelised =
          case dependent_underscorised
          when 'nodes_with_flows'
            'NodeWithFlows'
          when 'nodes_with_flows_or_geo'
            'NodeWithFlowsOrGeo'
          when 'nodes_stats'
            'NodesStats'
          else
            dependent_underscorised.classify
          end

        begin
          class_namespace.const_get(dependent_camelised)
        rescue NameError
          Rails.logger.error("Unrecognised dependent: #{dependent_name}")
          nil
        end
      end
    end
  end
end
