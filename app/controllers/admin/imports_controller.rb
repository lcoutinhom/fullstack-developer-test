module Admin
  class ImportsController < BaseController
    def new
      render inertia: "Admin/Imports/New"
    end

    def create
      import = Import.new(admin: Current.user, file: params[:file])

      if import.save
        Imports::ProcessSpreadsheetJob.perform_later(import)
        redirect_to admin_import_path(import)
      else
        redirect_to new_admin_import_path, inertia: { errors: import.errors }
      end
    end

    def show
      import = Import.find(params[:id])
      render inertia: "Admin/Imports/Show", props: import_props(import)
    end

    private
      def import_props(import)
        {
          id: import.id,
          status: import.status,
          total_rows: import.total_rows,
          processed_rows: import.processed_rows,
          succeeded_rows: import.succeeded_rows,
          failed_rows: import.failed_rows,
          error_log: import.error_log
        }
      end
  end
end
