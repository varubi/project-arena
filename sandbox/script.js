import { View, $ } from './_.js';
import config from './config.json';

require('./style.less');
// const e = [];
// for (let i = 0; i < 6; i++) {
//     const ent = {};
//     ent.name = 'Entity ' + (i + 1);
//     ent.attributes = { health: Math.floor(Math.random() * 500) };
//     ent.abilities = [];
//     for (let ii = 0; ii < 4; ii++) {
//         const modifier = Math.floor(Math.random() * 200) - 100;
//         const name = 'Ability ' + (ii + 1) + (modifier > 0 ? ' - Heal' : ' - Damage') + '(' + Math.abs(modifier) + ')';
//         ent.abilities.push(new ARENA.Ability(name, modifier));
//     }
//     e.push(ent);
// }

// const Encounter = new ARENA.Encounter();
// for (let i = 0; i < e.length; i++)
//     Encounter.addEntity(new ARENA.Entity(e[i].name, e[i].health, e[i].abilities));

const Encounter = ARENA.GameAdapter(config);


document.addEventListener('DOMContentLoaded', _ => {
    const body = $(document.body);
    body.append(View.header('Project Arena'))
    body.on('click', 'button', (e) => {
        const self = Encounter.entity(e.attribute('data-entity')),
            ability = e.attribute('data-ability'),
            target = randomEntity().id;
        self.doAction(ability, target);
        ui();

    })
    ui();
})
function randomEntity() {
    const e = Encounter.filterEntities(_ => !0);
    return e[Math.floor(Math.random() * e.length)];
}
function ui() {
    const body = $(document.body);
    body.remove(body.findAll('.entity'));
    const ents = Encounter.filterEntities(_ => !0)
    for (let i = 0; i < ents.length; i++)
        body.append(View.entity(ents[i]))
}
window.Encounter = Encounter;