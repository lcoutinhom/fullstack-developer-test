require "rails_helper"

RSpec.describe Imports::SpreadsheetParser do
  shared_examples "a spreadsheet parser" do |fixture|
    it "yields a symbol-keyed hash per data row" do
      rows = []
      described_class.new(Rails.root.join("spec/fixtures/files/#{fixture}")).each_row { |row| rows << row }

      expect(rows).to eq([
        { full_name: "Grace Hopper", email: "grace@example.com" },
        { full_name: "Ada Lovelace", email: "ada@example.com" },
        { full_name: "Missing Email", email: nil },
        { full_name: "Katherine Johnson", email: "katherine@example.com" }
      ])
    end
  end

  context "with a .csv file" do
    include_examples "a spreadsheet parser", "users.csv"
  end

  context "with an .xlsx file" do
    include_examples "a spreadsheet parser", "users.xlsx"
  end

  it "raises for an unsupported file type" do
    parser = described_class.new(Rails.root.join("spec/fixtures/files/avatar.png"))

    expect { parser.each_row { } }.to raise_error(Imports::SpreadsheetParser::UnsupportedFormat)
  end
end
