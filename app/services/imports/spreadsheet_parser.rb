require "csv"
require "roo"

module Imports
  # Reads a .csv or .xlsx file (by path) and yields one symbol-keyed hash per
  # data row, using the header row as keys. Blank trailing rows are skipped.
  class SpreadsheetParser
    class UnsupportedFormat < StandardError; end

    def initialize(path)
      @path = path.to_s
    end

    def each_row
      case File.extname(@path).downcase
      when ".csv"
        each_csv_row { |row| yield row }
      when ".xlsx"
        each_xlsx_row { |row| yield row }
      else
        raise UnsupportedFormat, "Unsupported file type: #{File.extname(@path)}"
      end
    end

    private
      def each_csv_row
        CSV.foreach(@path, headers: true, header_converters: :symbol) do |row|
          hash = row.to_h
          yield hash unless hash.values.all?(&:blank?)
        end
      end

      def each_xlsx_row
        spreadsheet = Roo::Spreadsheet.open(@path)
        headers = spreadsheet.row(1).map { |header| header.to_s.strip.downcase.to_sym }

        (2..spreadsheet.last_row).each do |i|
          hash = headers.zip(spreadsheet.row(i)).to_h
          yield hash unless hash.values.all?(&:blank?)
        end
      end
  end
end
