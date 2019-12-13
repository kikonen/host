import Select, {config } from '@kikonen/select_svelte/src/select.svelte';

config.trnslations = {
  fetching: 'Etsitään..',
  no_results: 'Ei tuloksia',
  too_short: 'Too short',
  has_more: 'Lisää...',
  fetching_more: 'Etsitään lisää...',
};

function setupSelect() {
  document.querySelectorAll('.js-svelte-select').forEach(function(input) {
    let ds = input.dataset;

    let fetch_options = {
      fetch_url: ds.kiFetchUrl,
      fetch_limit: ds.kiFetchLimit,
      fetch_query_min_len: parseInt(ds.kiFetchQueryMinLen || 0, 10),
    };

    function fetcherRest(offset, query, fetchId) {
      console.log("fetchId=" + fetchId);

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
            fetch_query: query,
            fetch_id: fetchId})
        }).then(function(xhr) {
          console.log(xhr);
          return xhr.json();
        });
    }

    function handleSelect(event) {
      console.log("SELECTED", event.detail);

      let selectedOption2 = input.querySelector('option[selected]');
      console.log("SELECT_VIA_SELECTOR", selectedOption2);
    }

    function handleChange(event) {
      console.log("CHANGE", event);

      let selection = {};
      let selectedOptions = input.selectedOptions;
      for (let i = selectedOptions.length - 1; i >= 0; i--) {
        let el = selectedOptions[i];
        let styleId = el.value ? 'style_' + el.value : '';
        selection[styleId] = true;
      }

      let target = document.querySelector('#sf_select_2');
      let targetOptions = target.options;
      for (let i = targetOptions.length - 1; i >= 0; i--) {
        let el = targetOptions[i];
        el.selected = selection[el.value];
      }

      target.dispatchEvent(new Event('change'));
    }

    if (input.id === 'sf_select_1') {
      input.addEventListener('change', handleChange);
    }
//    input.addEventListener('select-select', handleSelect);

    let fetcher = null;
    if (fetch_options.fetch_url) {
      fetcher = fetcherRest;
    }

    const app = new Select({
      target: input.parentElement,
      props: {
        real: input,
        typeahead: ds.kiTypeahead === 'true',
        fetcher: fetcher,
        remote: fetcher !== null
      }
    });
    if (input.id === 'sf_select_1') {
      app.selectItem(3);
    }
    if (false && input.id === 'sf_rest_1') {
      app.selectItem(1000);
    }
  });
}

export class SelectSvelteInit {
  init() {
    setupSelect();
  }
}
