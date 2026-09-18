class ImportChannel < ApplicationCable::Channel
  def subscribed
    import = Import.find(params[:id])
    stream_for import
    # Catches up a subscriber that connects after the job already finished
    # (common for small files) or reconnects mid-import — broadcasts sent
    # while nobody was listening are otherwise lost.
    transmit(import.progress)
  end
end
