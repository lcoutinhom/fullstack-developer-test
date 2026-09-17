module Admin
  # Placeholder landing page for admins. Phase 2 replaces this with real
  # user counts, broadcast live over DashboardChannel.
  class DashboardsController < BaseController
    def show
      render inertia: "Admin/Dashboard"
    end
  end
end
