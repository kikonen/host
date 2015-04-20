require 'rails_helper'

describe 'test', js: true do
  it 'visit test' do
    visit 'http://localhost:4000/test'
    expect(ng_eval('1 + 1')).to be 2

    expect(page).to have_ng_model('name')
  end
end
