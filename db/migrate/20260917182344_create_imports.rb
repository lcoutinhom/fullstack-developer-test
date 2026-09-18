class CreateImports < ActiveRecord::Migration[8.1]
  def change
    create_table :imports do |t|
      t.references :admin, null: false, foreign_key: { to_table: :users }
      t.integer :status, null: false, default: 0
      t.integer :total_rows, null: false, default: 0
      t.integer :processed_rows, null: false, default: 0
      t.integer :succeeded_rows, null: false, default: 0
      t.integer :failed_rows, null: false, default: 0
      t.json :error_log, null: false, default: []

      t.timestamps
    end
    add_index :imports, :status
  end
end
