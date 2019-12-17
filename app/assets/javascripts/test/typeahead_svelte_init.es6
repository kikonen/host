import Typeahead, { config} from '@kikonen/typeahead_svelte/typeahead_svelte';

const TRANSLATIONS = {
  fetching: 'Etsitään..',
  no_results: 'Ei tuloksia',
  too_short: 'Too short',
  has_more: 'Lisää...',
  fetching_more: 'Etsitään lisää...',
};

config.translations = TRANSLATIONS;

export class TypeaheadSvelteInit {
  init() {
    this.setupTypeahead();
  }

  setupTypeahead() {
  let items = [
    {
      text: 'local',
      desc: 'hippo',
    },
    {
      text: 'foo',
      desc: 'hippo',
    },
    {
      separator: true,
    },
    {
      text: 'No results 1',
      disabled: true,
    },
    {
      text: 'No results 2',
      disabled: true,
    },
    {
      separator: true,
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
      separator: true,
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
      separator: true,
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

    document.querySelectorAll('.js-typeahead').forEach(function(input) {
      let ds = input.dataset;
      let fetch_options = {
        fetch_url: ds.kiFetchUrl,
        fetch_limit: ds.kiFetchLimit,
        fetch_query_min_len: parseInt(ds.kiFetchQueryMinLen || 0, 10),
      };

      function fetcherLocal(offset, query) {
        let promise = new Promise(function(resolve, reject) {
          let queryStr = query.toUpperCase().trim();
          setTimeout(function() {
            let fetched = items.filter(function(item) {
              return item.separator || item.disabled || item == '' || item.text.toUpperCase().includes(queryStr);
            });

            resolve({
              items: JSON.parse(JSON.stringify(fetched)),
              more: true,
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
              fetch_limit: fetch_options.fetch_limit,
              fetch_query: query})
          }).then(function(xhr) {
            console.log(xhr);
            return xhr.json();
          });
      }

      function handleSelect(event) {
        let item = event.detail;

        console.log("SELECTED", item);
        console.log(input.value);
        var el = document.querySelector('#foo2');
        if (el) {
          el.value = item.desc;
        }

        var el2 = document.querySelector('#sf_quicksearch_3');
        if (el2) {
          el2.setAttribute('value', item.text);

          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          el2.dispatchEvent(evt);
        }
      }

      let fetcher = fetcherLocal;
      if (fetch_options.fetch_url) {
        fetcher = fetcherRest;
      }

      input.addEventListener('typeahead-select', handleSelect);

      const app = new Typeahead({
        target: input.parentElement,
        real: input,
        props: {
          real: input,
          query: input.getAttribute('value'),
          fetcher: fetcher,
          queryMinLen: fetch_options.fetch_query_min_len
        }
      });
    });
  }
}
