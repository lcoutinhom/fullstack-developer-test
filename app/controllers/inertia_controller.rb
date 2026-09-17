# frozen_string_literal: true

class InertiaController < ApplicationController
  inertia_share flash: -> { flash.to_hash }
  inertia_share current_user: -> { Current.user&.as_json(only: %i[id full_name email role]) }
end
