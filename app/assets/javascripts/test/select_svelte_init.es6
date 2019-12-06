import Select from '@kikonen/select_svelte/select_svelte';

export class SelectSvelteInit {
  init() {
    this.setupSelect();
  }

  setupSelect() {
    document.querySelectorAll('select').forEach(function(input) {
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
        let option2 = select2.querySelector('option[value="' + selectedOption.value + '"]');
        option2.setAttribute('selected', true);
        select2.dispatchEvent(new Event('change'));
      }

      if (input.id == 'sf_select_1') {
        input.addEventListener('change', handleChange);
      }
      input.addEventListener('select-select', handleSelect);

      const app = new Select({
        target: input.parentElement,
        props: {
          real: input
        }
      });
    });
  }
}
