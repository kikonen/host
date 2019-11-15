/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_svelte' %> (and
// <%= stylesheet_pack_tag 'hello_svelte' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Svelte!</div> at the bottom of the page.

import App from '../app.svelte'
import Typeahead from '../components/typeahead.svelte'


function setupHello() {
  _.each(document.querySelectorAll('.svelte-hello'), function(el) {
    const app = new App({
      target: el,
      props: {
        name: 'Svelte',
        message: el.dataset.msg
      }
    });
  });
}

function setupTypeahead() {
  let results = [
    {
      text: 'foo',
      desc: 'hippo',
    },
    {
      text: 'zoo',
      desc: 'hippo',
    },
    {
      text: 'boo',
      desc: 'hippo',
    },
    {
      text: 'aoo',
      desc: 'hippo',
    },
    {
      text: 'boo',
      desc: 'hippo',
    },
    {
      text: 'coo',
      desc: 'hippo',
    },
    {
      text: 'doo',
      desc: 'hippo',
    },
    {
      text: 'bar really long entry here to check how sizing works EOF',
      desc: 'hippo',
    },
  ];

  _.each(document.querySelectorAll('.js-typeahead'), function(input) {
    function fetcher (offset, query) {
      let promise = new Promise(function(resolve, reject) {
        var queryStr = query.toUpperCase().replace(/ /g, '');
        setTimeout(function() {
          var fetched = results.filter(function(item) {
            return item == '' || item.text.toUpperCase().includes(queryStr);
          });
          resolve({
            entries: fetched,
            more: false,
          });
        }, 500);
      });

      return promise;
    };

    const app = new Typeahead({
      target: input.parentElement,
      real: input,
      props: {
        real: input,
        fetcher: fetcher,
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupHello();
  setupTypeahead();
});
