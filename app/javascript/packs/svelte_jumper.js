/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_svelte' %> (and
// <%= stylesheet_pack_tag 'hello_svelte' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Svelte!</div> at the bottom of the page.

//import Typeahead from '../components/typeahead.svelte'
import SvelteJumper from 'svelte_jumper/src/App.svelte';

function setupApp() {
  let containerEl = document.querySelector('.js-svelte-jumper');

  const app = new SvelteJumper({
    target: containerEl,
    props: {
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupApp();
});
