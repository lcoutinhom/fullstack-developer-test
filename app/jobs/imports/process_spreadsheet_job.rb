module Imports
  class ProcessSpreadsheetJob < ApplicationJob
    queue_as :default

    def perform(import)
      import.update!(status: :processing)

      begin
        rows = read_rows(import)
      rescue StandardError => e
        import.update!(status: :failed, error_log: [ { "error" => e.message } ])
        broadcast_progress(import)
        return
      end

      import.update!(total_rows: rows.size)
      broadcast_progress(import)

      error_log = []
      rows.each do |row|
        user = User.new(
          full_name: row[:full_name],
          email: row[:email],
          password: SecureRandom.base58(24),
          role: :user
        )

        if user.save
          import.increment(:succeeded_rows)
        else
          import.increment(:failed_rows)
          error_log << row.stringify_keys.merge("errors" => user.errors.full_messages)
        end

        import.increment(:processed_rows)
        import.save!
        broadcast_progress(import) if broadcast?(import)
      end

      import.update!(status: :completed, error_log: error_log)
      broadcast_progress(import)
    end

    private
      def read_rows(import)
        rows = []
        import.file.blob.open do |tempfile|
          Imports::SpreadsheetParser.new(tempfile.path).each_row { |row| rows << row }
        end
        rows
      end

      # Caps live-progress updates at roughly 20 broadcasts per import,
      # regardless of file size, plus the last row so the UI always reaches 100%.
      def broadcast?(import)
        interval = [ import.total_rows / 20, 1 ].max
        (import.processed_rows % interval).zero? || import.processed_rows == import.total_rows
      end

      def broadcast_progress(import)
        ImportChannel.broadcast_to(import, {
          status: import.status,
          total_rows: import.total_rows,
          processed_rows: import.processed_rows,
          succeeded_rows: import.succeeded_rows,
          failed_rows: import.failed_rows,
          error_log: import.error_log
        })
      end
  end
end
