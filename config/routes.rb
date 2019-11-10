Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#show'

  get '/test' => 'test#show'
  get '/test/pollute' => 'test#pollute'
  get '/test/stream' => 'test#stream'
  get '/test/stream_json' => 'test#stream_json'

  get '/ts' => 'ts#hello'
  get '/test_ng2' => 'test_ng2#hello'

  resources :svelte_test, only: [] do
    collection do
      get :hello
    end
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end

Rails.application.routes.draw do
  mount GiTest::Engine, at: GiTest::Engine.mount_path
end

Rails.application.routes.draw do
  mount GiAlbum::Engine, at: GiAlbum::Engine.mount_path
end

Rails.application.routes.draw do
  mount GiRaycaster::Engine, at: GiRaycaster::Engine.mount_path
end

Rails.application.routes.draw do
  mount GiPaint::Engine, at: GiPaint::Engine.mount_path
end
