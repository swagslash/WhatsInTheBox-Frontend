<script>
    import {createEventDispatcher, onMount} from 'svelte';

    export let countdown = 0;
    const dispatch = createEventDispatcher();

    let timer = null;
    $: seconds = countdown % 60;

    onMount(() => {
        timer = setInterval(() => {
            countdown -= 1;
        }, 1000);
    })

    $: {
        if (countdown === 0) {
            clearInterval(timer);
            timer = null;
            dispatch('completed');
        }
    }
</script>

<style>
    ul {
        display: inline-block;
        list-style: none;
        padding-left: 0;
        height: 94px;
        overflow: hidden;
    }

    .num {
        font-size: 94px;
    }
</style>

<h3>
    {#if timer !== null}{countdown}{:else}Time is up!{/if}
</h3>
