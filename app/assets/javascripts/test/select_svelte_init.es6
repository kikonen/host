import Select from '@kikonen/select_svelte/select_svelte';


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

    function handleAction(event) {
      setTimeout(function() {
        let item = event.detail;
        let el = document.activeElement;
        alert("action: " + item.action);
        if (el) {
          el.focus();
        }
      });
    }

    function handleSelect(event) {
      console.log("SELECTED", event.detail);

      let selectedOption2 = input.querySelector('option[selected]');
      console.log("SELECT_VIA_SELECTOR", selectedOption2);
    }

    function handleChange(event) {
      console.log("CHANGE", event);

      let check = document.querySelector('#select_brand_sync');
      if (!check || !check.checked) {
        return;
      }

      let selection = {};
      let selectedOptions = input.selectedOptions;
      for (let i = selectedOptions.length - 1; i >= 0; i--) {
        let el = selectedOptions[i];
        let styleId = el.value ? 'style_' + el.value : '';
        selection[styleId] = true;
      }

      let target = document.querySelector('#select_style');
      let targetOptions = target.options;
      for (let i = targetOptions.length - 1; i >= 0; i--) {
        let el = targetOptions[i];
        el.selected = selection[el.value];
      }

      target.dispatchEvent(new Event('change'));
    }

    if (input.id === 'select_brand') {
      input.addEventListener('change', handleChange);
    }
//    input.addEventListener('select-select', handleSelect);
    input.addEventListener('select-action', handleAction);

    let fetcher = null;
    if (fetch_options.fetch_url) {
      fetcher = fetcherRest;
    }

    let styles = {};

    if (input.id === 'select_style') {
      styles = {
        container_class: 'border-danger',
      };
    }


    const translations = {
      clear: 'Tyhjennä',
      no_results: 'Ei tuloksia',
      max_limit: 'Maksimi',
      selected_count: 'valittua',
    };

    const app = new Select({
      target: input.parentElement,
      props: {
        real: input,
        config: {
          fetcher: fetcher,
          remote: fetcher !== null,
          placeholder: ds.kiPlaceholder,
          typeahead: ds.kiTypeahead === 'true',
          maxItems: parseInt(ds.kiMaxItems || 100, 0),
          summaryLen: parseInt(ds.kiSummaryLen || 2, 0),
          translations: translations,
          styles: styles,
        },
      }
    });
    if (input.id === 'select_brand') {
      app.selectItem(3);
    }
    if (false && input.id === 'select_rest_1') {
      app.selectItem(1000);
    }
  });
}

export class SelectSvelteInit {
  init() {
    setupSelect();
  }
}
