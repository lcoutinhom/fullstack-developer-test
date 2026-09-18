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
      import = Import.find(params.expect(:id))
      render inertia: "Admin/Imports/Show", props: { id: import.id, **import.progress }
    end
  end
end
