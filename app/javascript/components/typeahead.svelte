<script>
 import {onMount} from 'svelte';

 export let real;
 export let allResults = [
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
 export let results = allResults;
 export let value = '';
 export let previousValue = '';
 export let popupVisible = false;

 function onSelectItem() {
     counter = counter + 1;
 }

 onMount(function() {
     value = real.value;
     real.classList.add('d-none');
     filterResults();
 });

 function reindexResults(results) {
     let index = 0;
     results.forEach(function(item) {
         item.index = index;
         index = index + 1;
     });
 }

 function filterResults() {
     if (value !== previousValue) {
         console.log("filter: " + value);
         results = allResults.filter(function(item) {
             return item == '' || item.text.includes(value);
         });
         reindexResults(results);
         previousValue = value;
         popupVisible = results.length > 0;
     }
 }

 function handleKeyup(event) {
     console.log(event);
     filterResults();
 }

 let inputKeydownHandlers = {
     base: function(event) {
     },
     ArrowDown: function(event) {
         getPopup().firstChild.focus();
     },
     ArrowUp: function(event) {
         getPopup().lastChild.focus();
     },
 };

 function handleInputKeydown(event) {
     console.log(event);
     let handler = inputKeydownHandlers[event.code] || inputKeydownHandlers.base;
     handler(event);
 }

 let itemKeydownHandlers = {
     base: function(event) {
     },
     ArrowDown: function(event) {
         let next = event.target.nextElementSibling;
         if (next) {
             next.focus();
         } else {
             getInput().focus();
         }
     },
     ArrowUp: function(event) {
         let next = event.target.previousElementSibling;
         if (next) {
             next.focus();
         } else {
             getInput().focus();
         }
     },

     Enter: function(event) {
         let item = results[event.target.dataset.index];
         previousValue = item.text;
         value = previousValue;
         popupVisible = false;
         getInput().focus();
     }
 };

 function handleItemKeydown(event) {
     console.log(event);
     let handler = itemKeydownHandlers[event.code] || itemKeydownHandlers.base;
     handler(event);
 }

 function handleTogglePopup() {
     popupVisible = !popupVisible && results.length > 0;
 }

 function getInput() {
     var container = event.target.closest('.js-typeahead-container');
     return container.querySelector('.js-input');
 }

 function getPopup() {
     var container = event.target.closest('.js-typeahead-container');
     return container.querySelector('.js-popup');
 }

 $: real.setAttribute('value', value);
</script>

<style>
.typeahead {
    position: relative;
}

.typeahead-popup {
    position: absolute;
    top: 35;
    width: 400px;
    height: 200px;
    z-order: 3000;
    background-color: white;
    border: 1px solid blue;
}

.typehead-item {
    display: block;
}
.typehead-item:focus {
    outline: 1px dashed red;
    background-color: lightgray;
    color: black;
}
</style>

<div class="input-group mb-3 typeahead js-typeahead-container">
  <input class="js-input {real.getAttribute('class')}"
         data-target="{real.id}"
         placeholder="{real.placeholder}"
         bind:value
         on:keydown={handleInputKeydown}
         on:keyup={handleKeyup}
         on:click={handleTogglePopup}>
  <div class="input-group-append">
    <span class="input-group-text"><i class="fas fa-clock"></i></span>
  </div>

  <div class="js-popup dropdown-menu {popupVisible ? 'show' : ''}">
    {#each results as item}
    <div tabindex=0 class="dropdown-item"  data-index="{item.index}" on:keydown={handleItemKeydown}>
      {item.text}
      <div class="text-muted">
        {item.desc}
      </div>
    </div>
    {/each}
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
