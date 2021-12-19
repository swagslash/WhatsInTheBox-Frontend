<script>
    import {draggable} from './dragdrop.js'
    import {crossfade} from 'svelte/transition'
    import {elasticOut, quintOut} from 'svelte/easing'
    import {flip} from 'svelte/animate';

    export let shelf = [null, null, null]
    export let cart = [
        {id: 1, name: '🤑'},
        {id: 2, name: '🐇'},
        {id: 3, name: '🧙‍️'},
        {id: 4, name: '🗃️'},
        {id: 5, name: '⚛️'}
    ]

    function putInShelf(item, index) {
        const oldItem = shelf[index]
        const oldShelfIndex = shelf.indexOf(item)
        if (cart.indexOf(item) !== -1) cart.splice(cart.indexOf(item), 1)
        if (oldShelfIndex !== -1) shelf[oldShelfIndex] = oldItem
        else if (oldItem) cart.push(oldItem)
        shelf[index] = item;
        cart = cart
    }

    function putInCart(item) {
        if (cart.indexOf(item) !== -1) cart.splice(cart.indexOf(item), 1)
        if (shelf.indexOf(item) !== -1) shelf[shelf.indexOf(item)] = null
        cart.push(item)
        cart = cart
    }

    const [send, receive] = crossfade({
        duration: d => 600,
        easing: elasticOut,
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: t => `
                        transform: ${transform} scale(${t});
                        opacity: ${t}
                      `
            };
        }
    });

</script>

<style>
    .boxslot {
        position: relative;
        display: inline-block;
        background: #eee;
        box-shadow: 5px 5px 10px -10px black inset;
        width: 64px;
        height: 64px;
        margin: 3px;
        vertical-align: top;
    }

    .boxes {
        position: relative;
        box-shadow: 5px 5px 10px -10px black inset;
        min-height: 64px;
    }

    .boxitem {
        height: 56px;
        width: 56px;
        position: relative;
        display: inline-block;
        background: rgba(255, 255, 255, 0.5);
        margin: 4px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
        font-size: 27pt;
    }

    .boxslot .boxitem {
        position: absolute;
    }

    :global(.dragged) {
        pointer-events: none;
        z-index: 100;
    }

    :global(.boxslot.droptarget, .labelpool.droptarget) {
        background: #ddd;
    }
</style>

<div className="labelpool" on:dropped={(e) => putInCart(e.detail)}>
    {#each cart as item, index (item.id)}
        <div className="boxitem" animate:flip use:draggable={{data: item, targets: ['.boxslot', '.boxslot .boxitem']}}
             in:receive={item.id} out:send={item.id}>
            {item.name}
        </div>
    {/each}
</div>

<div class="boxes">
    {#each shelf as item, index }
        <div class="boxslot" on:dropped={(e) => putInShelf(e.detail, index)}>
            {#if item}
                {#each [item] as item (item.id)}
                    <div class="boxitem" use:draggable={{data: item, targets: ['.labelpool', '.boxslot', '.boxslot .boxitem']}}
                         in:receive={item.id} out:send={item.id} on:dropped={(e) => putInShelf(e.detail, index)}>
                        {item.name}
                    </div>
                {/each}
            {/if}
        </div>
    {/each}
</div>
