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
      text: 'bar really long entry here to check how sizing works EOF',
      desc: 'hippo',
    },
  ];

  _.each(document.querySelectorAll('.js-typeahead'), function(el) {
    console.log(el);
    var input = el.querySelector('input');

    function fetcher (query) {
      let promise = new Promise(function(resolve, reject) {
        console.log("fetching...: " + query);
        setTimeout(function() {
          console.log("fetched...: " + query);
          var queryStr = query.toUpperCase();
          var fetched = results.filter(function(item) {
            return item == '' || item.text.toUpperCase().includes(queryStr);
          });
          resolve(fetched);
        }, 500);
      });

      return promise;
    };

    const app = new Typeahead({
      target: el,
      props: {
        real: input,
        value: input.value,
        fetcher: fetcher,
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupHello();
  setupTypeahead();
});
