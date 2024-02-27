import { test, expect } from '@playwright/test';

interface Pokemon {
  name: string;
  abilities: [any];
  sprite: any;
}

test.describe.only('Playwright Pokemon Challenge', () => {
  /**
   **Criteria**:
   Write a playwright script that calls the below API and then parse the results, grabbing 3 random Pokemon
        https://pokeapi.co/api/v2/pokemon
        
   Using the three Pokemion, call their corresponding endpoint & log each of their abbilities.
        example: https://pokeapi.co/api/v2/pokemon/ditto
        Return a JSON array that lists your 3 Pokemon & their corresponding abilities.

    **Bonus: render it via page.setContent() (edited) 
*/
  test('3 Random Pokemon Abilities', async ({ page, request }) => {
    const pokeResponse = await request.get('https://pokeapi.co/api/v2/pokemon');
    const results = (await pokeResponse.json()).results;
    const threeRandom = selectRandomPokemon(results, 3);

    let pokemonDetails: Pokemon[] = [];
    for (let i = 0; i < threeRandom.length; i++) {
      const response = await request.get(threeRandom[i].url);
      const pokeResults = await response.json();

      pokemonDetails.push({
        name: pokeResults.name,
        abilities: pokeResults.abilities,
        sprite: pokeResults.sprites.front_default,
      });
    }
    printPokemonDetailsToConsole(pokemonDetails);
    let html = makeHTMLPageFromPokemon(pokemonDetails);
    await page.setContent(html);
    await page.screenshot({ path: 'screenshot.png' });
  });
});

function printPokemonDetailsToConsole(pokemonDetails: any) {
  pokemonDetails.forEach((pokemon) => {
    console.log(pokemon);
  });
}

function makeHTMLPageFromPokemon(pokemonDetails: any) {
  let html = '';
  pokemonDetails.forEach((pokemon) => {
    html += `
      <div> 
      <img src="${pokemon.sprite}"/>
      <span> ${pokemon.name}</span>
     </div>
      `;

    pokemon.abilities.forEach((ability) => {
      html += ` <p>${JSON.stringify(ability)}</p>`;
    });
  });

  return html;
}

function selectRandomPokemon(array: any[], count: number): any[] {
  if (count >= array.length) {
    return array; // Return the whole array if count is equal or larger than array length
  }

  const shuffledArray = array.slice(); // Create a copy of the array
  const selectedElements: any[] = [];

  // Select random elements without duplicates
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * shuffledArray.length);
    const selectedElement = shuffledArray.splice(randomIndex, 1)[0];
    selectedElements.push(selectedElement);
  }

  return selectedElements;
}
