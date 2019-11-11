<script>
 import {onMount} from 'svelte';

 export let real;
 export let results = [];
 export let value = '';

 function onSelectItem() {
     counter = counter + 1;
 }

 onMount(function() {
     value = real.value;
     real.classList.add('d-none');
 });

 $: real.setAttribute('value', value);
</script>

<style>
</style>

<div class="input-group mb-3">
  <input class="{real.getAttribute('class')}"
         data-target="{real.id}"
         placeholder="{real.placeholder}"
         bind:value="{value}">
  <div class="input-group-append">
    <span class="input-group-text"><i class="fas fa-clock"></i></span>
  </div>
</div>


{value}

<!--
<div class="eco-w-search-quicksearch">
  <input class=" w-100 form-control eco-js-search-field"
         placeholder="Quick search"
         data-eco-target="main"
         data-eco-autofocus="true"
         autocomplete="new-password"
         autocorrect="off"
         autocapitalize="off"
         spellcheck="false"
         type="text"
         value="100"
         name="run_status[sf_quicksearch]"
         id="run_status_sf_quicksearch">
</div>
-->
