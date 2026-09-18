module Admin
  class UsersController < BaseController
    PER_PAGE = 20

    def index
      scope = User.order(:full_name)
      scope = scope.where("full_name LIKE :q OR email LIKE :q", q: "%#{params[:q]}%") if params[:q].present?

      pagy = Pagy::Offset.new(count: scope.count, page: params[:page].presence || 1, limit: PER_PAGE)

      render inertia: "Admin/Users/Index", props: {
        users: pagy.records(scope).as_json(only: %i[id full_name email role]),
        pagination: { page: pagy.page, pages: pagy.pages, count: pagy.count },
        q: params[:q]
      }
    end

    def new
      render inertia: "Admin/Users/New"
    end

    def create
      user = User.new(user_params)
      user.password = user.password_confirmation = SecureRandom.base58(24)

      if user.save
        PasswordsMailer.reset(user).deliver_later
        redirect_to admin_users_path, notice: "#{user.full_name} was created; they'll receive an email to set their password."
      else
        redirect_to new_admin_user_path, inertia: { errors: user.errors }
      end
    end

    def edit
      @user = User.find(params.expect(:id))
      render inertia: "Admin/Users/Edit", props: { user: @user.as_json(only: %i[id full_name email role]) }
    end

    def update
      user = User.find(params.expect(:id))

      if user.update(user_params)
        redirect_to admin_users_path, notice: "#{user.full_name} was updated."
      else
        redirect_to edit_admin_user_path(user), inertia: { errors: user.errors }
      end
    end

    def destroy
      user = User.find(params.expect(:id))
      user.destroy
      redirect_to admin_users_path, notice: "#{user.full_name} was deleted."
    end

    def toggle_role
      user = User.find(params.expect(:id))

      if user == Current.user
        redirect_to admin_users_path, alert: "You cannot change your own role."
      else
        user.update!(role: user.admin? ? :user : :admin)
        redirect_to admin_users_path
      end
    end

    private
      def user_params
        params.permit(:full_name, :email, :role, :avatar_url)
      end
  end
end
