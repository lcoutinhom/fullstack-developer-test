# Benchmarks Imports::SpreadsheetParser — the hot loop when importing a large
# spreadsheet — with and without Ruby 4's ZJIT, to see whether it's worth
# enabling for this workload. Compare:
#
#   bin/rails runner script/benchmark_zjit.rb
#   RUBYOPT="--zjit" bin/rails runner script/benchmark_zjit.rb

require "tmpdir"
require "csv"

ROWS = 50_000

Dir.mktmpdir do |dir|
  path = File.join(dir, "benchmark.csv")
  CSV.open(path, "w") do |csv|
    csv << %w[full_name email]
    ROWS.times { |i| csv << [ "Person #{i}", "person#{i}@example.com" ] }
  end

  zjit_enabled = defined?(RubyVM::ZJIT) && RubyVM::ZJIT.enabled?
  puts "ZJIT enabled: #{zjit_enabled}"

  count = 0
  started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  Imports::SpreadsheetParser.new(path).each_row { count += 1 }
  time = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at
  raise "expected #{ROWS} rows, got #{count}" unless count == ROWS

  puts "Parsed #{ROWS} rows in #{time.round(3)}s (#{(ROWS / time).round(0)} rows/s)"
end
