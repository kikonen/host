/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_svelte' %> (and
// <%= stylesheet_pack_tag 'hello_svelte' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Svelte!</div> at the bottom of the page.

import App from '../app.svelte'
import Typeahead from '../components/typeahead.svelte'

document.addEventListener('DOMContentLoaded', () => {
  _.each(document.querySelectorAll('.svelte-hello'), function(el) {
    const app = new App({
      target: el,
      props: {
        name: 'Svelte',
        message: el.dataset.msg
      }
    });
  });

  _.each(document.querySelectorAll('.js-typeahead'), function(el) {
    console.log(el);
    var input = el.querySelector('input');
    const app = new Typeahead({
      target: el,
      props: {
        real: input,
        value: input.value
      }
    });
  });

});
