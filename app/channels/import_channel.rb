class ImportChannel < ApplicationCable::Channel
  def subscribed
    stream_for Import.find(params[:id])
  end
end
