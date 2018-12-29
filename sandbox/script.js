import { View, $ } from './_.js';
import config from './config.yaml';
console.log(config);
require('./style.less');
const adapt = (new ARENA.GameAdapter(config));
const Encounter = adapt.encounter;
console.log(adapt);

document.addEventListener('DOMContentLoaded', _ => {
    const body = $(document.body);
    body.append(View.header('Project Arena'))
    body.append(View.entities());
    body.on('click', 'button', (e) => {
        const self = Encounter.entity(e.attribute('data-entity')),
            ability = e.attribute('data-ability'),
            target = randomEntity().oid.rootId;
        self.castAbility(ability, target);

        UIRefresh();
    })
    UIRefresh();
})

function randomEntity() {
    const e = Encounter.getEntities(_ => !0);
    return e[Math.floor(Math.random() * e.length)];
}

function UIRefresh() {
    const container = $(document.body).find('.entities');
    container.remove(container.findAll('.entity'));
    const ents = Encounter.getEntities(_ => !0)
    for (let i = 0; i < ents.length; i++)
        container.append(View.entity(ents[i]))
}

window.Encounter = Encounter;