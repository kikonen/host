import Select from '@kikonen/select_svelte/select_svelte';

function setupSelect() {
  document.querySelectorAll('.js-svelte-select').forEach(function(input) {
    let ds = input.dataset;

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

    const app = new Select({
      target: input.parentElement,
      props: {
        real: input,
        typeahead: ds.typeahead === 'true'
      }
    });
  });
}

export class SelectSvelteInit {
  init() {
    setupSelect();
  }
}
