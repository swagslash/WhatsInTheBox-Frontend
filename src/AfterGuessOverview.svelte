<script lang="ts">
    import {Box} from "./model/game";

    export let boxes: Box[];
    export let guesses: Record<string, string[]>;

    let guessList = Object.entries(guesses);
</script>

<style>
    .table {
        text-decoration: none;
        box-shadow: none;
        text-shadow: none;
        font-size: 17pt;
        background-color: white;
    }
</style>

<table class="table table-responsive table-hover bg-light">
    <thead>
    <tr>
        <th scope="col">Box #</th>
        <th scope="col">Content</th>
        <th scope="col">Decoration</th>
        {#each guessList as [userId, valueArray]}
        <th scope="col">{userId}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each boxes as box, index}
    <tr>
        <th scope="row">{index + 1}</th>
        <td>{box.content}</td>
        <td>{box.labels}</td>

        {#each guessList as [userId, valueArray]}
            <td>{valueArray[index]}</td>
        {/each}
    </tr>
    {/each}
    </tbody>
</table>
