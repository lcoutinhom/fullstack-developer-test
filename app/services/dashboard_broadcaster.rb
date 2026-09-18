# Computes and pushes the admin dashboard's user counts. Called from a User
# model callback on create/destroy/role change, and reused by
# Admin::DashboardsController for the initial (pre-websocket) render.
class DashboardBroadcaster
  def self.call
    ActionCable.server.broadcast("dashboard", counts)
  end

  def self.counts
    {
      total: User.count,
      by_role: {
        admin: User.admin.count,
        user: User.user.count
      }
    }
  end
end
