module Admin
  class DashboardsController < BaseController
    def show
      render inertia: "Admin/Dashboard", props: DashboardBroadcaster.counts
    end
  end
end
