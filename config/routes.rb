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
      get :typeahead
      get :select
      post :select, as: :post_select
    end
  end

  resources :search, only: [] do
    collection do
      post :search_xhr
    end
  end

  namespace :gi_paint do
    resources :ui, only: [] do
      collection do
        get '(*path)', to: 'ui#show', as: :ui
      end
    end

    root 'ui#show'
  end

  namespace :gi_raycaster do
    get '/', to: 'caster#show'
  end

  namespace :gi_album do
    get '/thumb/:size/:path', to: 'thumb#show', constraints: { path: /.*/ }
    get '/api/photo/index', to: 'photo#index'

    #  get '/', to: redirect('ui/show'), as: :redirect_ui
    get '(*path)', to: 'ui#show', as: :ui
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
