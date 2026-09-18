class DashboardChannel < ApplicationCable::Channel
  def subscribed
    stream_from "dashboard"
    # Catches up a subscriber whose counts may already be stale by the time
    # the WebSocket subscription confirms.
    transmit(DashboardBroadcaster.counts)
  end
end
