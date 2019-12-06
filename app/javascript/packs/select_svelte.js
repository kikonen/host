/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_svelte' %> (and
// <%= stylesheet_pack_tag 'hello_svelte' %> if you have styles in your component)
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Svelte!</div> at the bottom of the page.

import Select from '@kikonen/select_svelte/src/select.svelte';


function setupSelect() {
  document.querySelectorAll('select').forEach(function(input) {
    let ds = input.dataset;

    function handleSelect(event) {
      console.log("SELECTED", event.detail);

      let selectedOption2 = input.querySelector('option[selected]');
      console.log("SELECT_VIA_SELECTOR", selectedOption2);
    }

    function handleChange(event) {
      console.log("CHANGE", event);

      let selectedOption = input.querySelector('option[selected]');
      console.log("CHANGE_VIA_SELECTOR", selectedOption);

      let select2 = document.querySelector('#sf_select_2');
      let selectedOptions2 = select2.querySelectorAll('option[selected]');
      console.log(selectedOptions2);

      let styleId = selectedOption.value ? 'style_' + selectedOption.value : '';
      let option2 = select2.querySelector('option[value="' + styleId + '"]');
      option2.setAttribute('selected', true);
      select2.dispatchEvent(new Event('change'));
    }

    if (input.id === 'sf_select_1') {
      input.addEventListener('change', handleChange);
    }
    input.addEventListener('select-select', handleSelect);

    const app = new Select({
      target: input.parentElement,
      props: {
        real: input,
        typeahead: ds.typeahead === 'true'
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSelect();
});
