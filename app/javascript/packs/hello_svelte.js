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
  let entries = [
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
    let ds = input.dataset;
    let fetch_options = {
      fetch_url: ds.kiFetchUrl,
    };

    function fetcherLocal(offset, query) {
      let promise = new Promise(function(resolve, reject) {
        var queryStr = query.toUpperCase().trim();
        setTimeout(function() {
          var fetched = entries.filter(function(item) {
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

    function fetcherRest(offset, query) {
      let token = document.head.querySelector('meta[name="csrf-token"]').content;
      return fetch(
        fetch_options.fetch_url,
        { method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHTTPRequest',
            'X-CSRF-Token': token,
          }),
          credentials: 'same-origin',
          body: JSON.stringify({
            fetch_offset: offset,
            fetch_query: query})
        }).then(function(xhr) {
          console.log(xhr);
          return xhr.json();
        });
    }

    let fetcher = fetcherLocal;
    if (fetch_options.fetch_url) {
      fetcher = fetcherRest;
    }

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
